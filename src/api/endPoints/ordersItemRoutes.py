from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from datetime import datetime, timezone
from api.models import db, Order_Items


order_items_api = Blueprint('orderItemsApi', __name__)
CORS(order_items_api)  # Allow CORS requests to this API


@order_items_api.route('/ordersItem', methods=['GET', 'POST'])
def orders_item():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Order_Items)).scalars()
        list_orders = [ row.serialize() for row in rows ]
        response_body['message'] = f'Número de artículos'
        response_body['results'] = list_orders
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Order_Items(total_amount=data.get('total_amount'),
                    order_status=data.get('order_status'),
                    arrival_date=datetime.now(timezone.utc), # Hablar con el profe para hacer esto
                    payment_Options=data.get('payment_Options'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nueva orden'
        response_body['results'] = row.serialize()
        return response_body, 201  
    
@order_items_api.route('/ordersItems/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def order_items(id):
         response_body = {}
         row = db.session.execute(db.select(Order_Items).where(Order_Items.id == id)).scalar()
         if not row:
            response_body['message'] = f'El artículo con el id: {id} no existe en nuestros registros'
            return response_body, 400
         
         if request.method == 'GET':
            response_body['message'] = f'Artículo para el id {id}'
            response_body['results'] = row.serialize()    
            return response_body, 200
         
         if request.method == 'PUT':
            data = request.json
            row.total_amount = data['total_amount']
            row.order_status = data['order_status']
            row.arrival_date = data['arrival_date']
            row.payment_Options = data['payment_Options']
            db.session.commit()
            response_body['message'] = f'El artículo con el id {id} se ha actualizado correctamente.'
            response_body['results'] = row.serialize() 
            return response_body, 201
         
         if request.method == 'DELETE':
            db.session.delete(row)
            db.session.commit()
            response_body['message'] = f'El artículo con el id {id} se ha eliminado correctamente.'
            response_body['results'] = row.serialize() 
            return response_body, 200 
    

# Para que se vean los articulos de la orden
@order_items_api.route('/order/<int:order_id>/orderItem', methods=['GET'])
def order_items_order(order_id):
    response_body = {}
    row = db.session.execute(db.select(Order_Items).where(Order_Items.order_id == order_id)).scalars()
    if not row:
        response_body['message'] = f'El artículo con el id{order_id} NO EXISTE'
    if request.method == 'GET':
        response_body['message'] = f'El artículo con el id {order_id}'
        response_body["results"] = row.serialize()