import os
from flask import Flask, redirect, request, jsonify, Blueprint
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from api.models import db, Users
import stripe
import secrets


stripe_api = Blueprint('stripeApi', __name__)
stripe.api_key = os.getenv("BACKSTRIPEKEY")
localhosturl = os.getenv("BACKEND_URL")
CORS(stripe_api)  # Allow CORS requests to this API

@stripe_api.route("/create-subscription-session", methods=["POST"])
def create_subscription_session():
    data = request.json
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "Falta user_id"}), 400

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[
                {
                    "price": os.getenv("STRIPE_PRICE_ID"),  # ID del precio de tu producto en Stripe
                    "quantity": 1,
                }
            ],
            success_url=f"{localhosturl}/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{localhosturl}/fail",
            metadata={"user_id": user_id},
        )
        return jsonify({"id": session.id, "url": session.url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
@stripe_api.route("/validate-subscription", methods=["GET"])
@jwt_required()
def validate_subscription():
    session_id = request.args.get("session_id")
    if not session_id:
        return jsonify({"error": "Falta session_id"}), 400

    try:
        session = stripe.checkout.Session.retrieve(session_id)
        user_id = session["metadata"]["user_id"]

        user = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()

        if user and user.subscription_code:
            return jsonify({"active": True, "subscription_code": user.subscription_code}), 200
        else:
            return jsonify({"active": False}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@stripe_api.route("/webhook", methods=["POST"])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")  # config en Stripe

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        user_id = session["metadata"].get("user_id")
        user = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()

        if user:
            user.subscription_code = secrets.token_hex(8)  # genera código único
            db.session.commit()

    return jsonify({"status": "success"}), 200



