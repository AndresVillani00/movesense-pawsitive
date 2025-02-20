from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from datetime import datetime, timezone
from api.models import db, Orders


orders_api = Blueprint('ordersApi', __name__)
CORS(orders_api)  # Allow CORS requests to this API


@orders_api.route('/orders', methods=['GET', 'POST'])
def orders():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Orders)).scalars()
        list_orders = [ row.serialize() for row in rows ]
        response_body['message'] = f'Listado de órdenes'
        response_body['results'] = list_orders
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Orders(total_amount=data.get('total_amount'),
                    estado=data.get('estado'),
                    fecha_Compra=datetime.now(timezone.utc),
                    payment_Options=data.get('payment_Options'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nueva orden'
        response_body['results'] = row.serialize()
        return response_body, 201

@orders_api.route('/orders/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def order(id):
         response_body = {}
         row = db.session.execute(db.select(Orders).where(Orders.id == id)).scalar()
         if not row:
            response_body['message'] = f'La orden con el id: {id} no existe en nuestros registros'
            return response_body, 400
         
         if request.method == 'GET':
            response_body['message'] = f'Response from the {request.method} para el id {id}'
            response_body['results'] = row.serialize()    
            return response_body, 200
         
         if request.method == 'PUT':
            data = request.json
            row.total_amount = data['total_amount']
            row.estado = data['estado']
            row.fecha_Compra = data['fecha_Compra']
            row.payment_Options = data['payment_Options']
            db.session.commit()
            response_body['message'] = f'La orden con el id {id} se ha actualizado correctamente.'
            response_body['results'] = row.serialize() 
            return response_body, 201
         
         if request.method == 'DELETE':
            db.session.delete(row)
            db.session.commit()
            response_body['message'] = f'La orden para el id {id} se ha eliminado correctamente.'
            response_body['results'] = row.serialize() 
            return response_body, 200 