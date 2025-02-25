from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from datetime import datetime, timezone
from api.models import db, OrderItems, Orders, Products


order_items_api = Blueprint('orderItemsApi', __name__)
CORS(order_items_api)  # Allow CORS requests to this API



@order_items_api.route('/order-items', methods=['GET', 'POST'])
def order_items():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(OrderItems)).scalars()
        list_orders = [ row.serialize() for row in rows ]
        response_body['message'] = f'Número de artículos'
        response_body['results'] = list_orders
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        """ 
        "buyer_id", "order_id", "product_id", "quantity" 
        """
        # Aqui recibo el cliente, el producto, y el numero de orden si la tiene (puede venir null)
        # Si no tiene un numero de orden, tengo que crear una orden nueva. 
        # Revisar nombres archivos
        product = db.session.execute(db.select(Products).where(Products.id  == data.get("product_id"))).scalar()
        if not product: 
            response_body['message'] = 'Producto inexistente'
            return response_body, 401 # Verificar que error devolver aqui 
        order_id = data.get("order_id", None)
        if not order_id:
            row = Orders(total_amount=0,
                         order_status='en proceso',
                         buy_date=datetime.now(timezone.utc),
                         buyer_id=data.get('buyer_id'),
                         payment_options='')
            db.session.add(row)
            db.session.commit()
            order_id = row.serialize()["id"] 
        order = db.session.execute(db.select(Orders).where(Orders.id == order_id)).scalar()
        if not order: 
            response_body['message'] = 'orden inexistente'
            return response_body, 401 # Verificar que error devolver aqui 
        row = OrderItems(total_amount=product.serialize()["price"],
                         product_id=product.serialize()["id"],
                         order_id=order.serialize()["id"],
                         quantity=data.get('quantity', 1))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nueva orden'
        response_body['results'] = row.serialize()
        return response_body, 201  
    

@order_items_api.route('/ordersItems/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def order_item(id):
         response_body = {}
         row = db.session.execute(db.select(OrderItems).where(OrderItems.id == id)).scalar()
         if not row:
            response_body['message'] = f'El articulo con el id: {id} no existe en nuestros registros'
            return response_body, 400
         if request.method == 'GET':
            response_body['message'] = f'Articulo para el id {id}'
            response_body['results'] = row.serialize()    
            return response_body, 200
         if request.method == 'PUT':
            data = request.json
            row.total_amount = data['total_amount']
            row.order_status = data['order_status']
            row.arrival_date = data['arrival_date']
            row.payment_Options = data['payment_Options']
            db.session.commit()
            response_body['message'] = f'El articulo con el id {id} se ha actualizado correctamente.'
            response_body['results'] = row.serialize() 
            return response_body, 201
         if request.method == 'DELETE':
            db.session.delete(row)
            db.session.commit()
            response_body['message'] = f'El articulo con el id {id} se ha eliminado correctamente.'
            response_body['results'] = row.serialize() 
            return response_body, 200 
    

# Para que se vean los articulos de la orden
@order_items_api.route('/order/<int:order_id>/orderItem', methods=['GET'])
def order_order_items(order_id):
    response_body = {}
    row = db.session.execute(db.select(OrderItems).where(OrderItems.order_id == order_id)).scalars()
    if not row:
        response_body['message'] = f'El articulo con el id{order_id} NO EXISTE'
    if request.method == 'GET':
        response_body['message'] = f'El articulo con el id {order_id}'
        response_body["results"] = row.serialize()