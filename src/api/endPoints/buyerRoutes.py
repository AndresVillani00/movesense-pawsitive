from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from api.models import db, Buyers

buyer_api = Blueprint('buyerApi', __name__)
CORS(buyer_api)

@buyer_api.route('/buyers', methods=['GET'])
def buyers():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Buyers)).scalars()
        list_buyers = [ row.serialize() for row in rows ]
        response_body['message'] = f'Usuarios Compradores'
        response_body['results'] = list_buyers
        return response_body, 200
   

@buyer_api.route('/buyers/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def buyer(id):
    response_body = {}
    row = db.session.execute(db.select(Buyers).where(Buyers.id == id)).scalars()
    if not row:
        response_body['message'] = f'El Comprador de id: {id}, no existe'
    if request.method == 'GET':
        response_body['message'] = f'Comprador con id: {id}'
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.sending_address_buyer=data.get('sending_address_buyer'),
        row.sell_history=data.get('sell_history'),
        row.purchase_history=data.get('purchase_history')
        response_body['message'] = f'Comprador con id: {id}. Actualizado'
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Comprador con id: {id}. Eliminado'
        return response_body, 200
   