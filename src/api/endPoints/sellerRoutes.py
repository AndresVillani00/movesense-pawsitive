from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from api.models import db, Sellers

seller_api = Blueprint('sellerApi', __name__)
CORS(seller_api)

@seller_api.route('/sellers', methods=['GET'])
def sellers():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Sellers)).scalars()
        list_sellers = [ row.serialize() for row in rows ]
        response_body['message'] = f'Usuarios vendedores'
        response_body['results'] = list_sellers
        return response_body, 200


@seller_api.route('/sellers/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def seller(id):
    response_body = {}
    row = db.session.execute(db.select(Sellers).where(Sellers.id == id)).scalars()
    if not row:
        response_body['message'] = f'El Vendedor de id: {id}, no existe'
    if request.method == 'GET':
        response_body['message'] = f'Vendedor con id: {id}'
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.reputation=data.get('reputation'),
        row.sell_history=data.get('sell_history'),
        row.product_for_sell=data.get('product_for_sell'),
        row.publish_product=data.get('publish_product'),
        row.total_income=data.get('total_income')
        response_body['message'] = f'Vendedor con id: {id}. Actualizado'
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Vendedor con id: {id}. Eliminado'
        return response_body, 200
     