from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from datetime import datetime, timezone
from api.models import db, Orders_Item


orders_item_api = Blueprint('ordersItemApi', __name__)
CORS(orders_item_api)  # Allow CORS requests to this API


@orders_item_api.route('/orders_item', methods=['GET', 'POST'])
def orders_Item():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Orders_Item)).scalars()
        list_orders = [ row.serialize() for row in rows ]
        response_body['message'] = f'Número de artículos'
        response_body['results'] = list_orders
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Orders_Item(total_amount=data.get('total_amount'),
                    estado=data.get('estado'),
                    fecha_Llegada=datetime.now(timezone.utc), # Hablar con el profe para hacer esto
                    payment_Options=data.get('payment_Options'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nueva orden'
        response_body['results'] = row.serialize()
        return response_body, 201  