from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required     
from flask_jwt_extended import get_jwt                
from flask_jwt_extended import get_jwt_identity         
from flask_cors import CORS
from api.models import db, Products


products_api = Blueprint('productsApi', __name__)
CORS(products_api)  # Allow CORS requests to this API


@products_api.route('/products', methods=['GET'])
def products():
    response_body = {}       
    if request.method == 'GET':
        rows = db.session.execute(db.select(Products)).scalars()
        list_users = [ row.serialize() for row in rows ]
        response_body['message'] = f'Listado de usuarios'
        response_body['results'] = list_users
        return response_body, 200
    
@products_api.route('/products', methods=['POST'])
@jwt_required()
def postProducts():
    response_body = {}
    additional_claims = get_jwt()  
    if request.method == 'POST':
        data = request.json 
        seller_id = additional_claims['user_id']
        is_seller = additional_claims['is_seller']
        if not is_seller:
            response_body['message'] = f'El  usuario es comprador'
            return response_body, 404
        row = Products(name=data.get('name'),
                    seller_id=seller_id,            # HE AGREGADO ESTO
                    post_date=data.get('post_date'),
                    sending_address=data.get('sending_address'),
                    size=data.get('size'),
                    color=data.get('color'),
                    weight=data.get('weight'),
                    quantity=data.get('quantity', 1),
                    price=data.get('price'),
                    description=data.get('description'),
                    image_url=data.get('image_url'),
                    category=data.get('category'))
        db.session.add(row)  #AGREGADO
        db.session.commit()
        response_body['message'] = f'Agregar nuevo Producto'
        response_body['results'] = row.serialize()
        return response_body, 200  
    

@products_api.route('/products/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def product(id):
    response_body = {}
    row = db.session.execute(db.select(Products).where(Products.id == id)).scalars()
    if not row:
        response_body['message'] = f'El Producto de id: {id}, no existe'
    if request.method == 'GET':
        response_body['message'] = f'Producto con id: {id}'
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.name=data.get('name'),
        row.post_date=data.get('post_date'),
        row.sending_address=data.get('sending_address'),
        row.size=data.get('size'),
        row.color=data.get('color'),
        row.weight=data.get('weight'),
        row.quantity=data.get('quantity'),
        row.price=data.get('price'),
        row.final_price=data.get('final_price'),
        row.description=data.get('description'),
        row.category=data.get('category')
        db.session.commit()
        response_body['message'] = f'Producto con id: {id}. Actualizado'
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Producto con id: {id}. Eliminado'
        return response_body, 200


@products_api.route('/sellers/<int:seller_id>/products', methods=['GET'])
def seller_products(seller_id):
    response_body = {}
    row = db.session.execute(db.select(Products).where(Products.seller_id == seller_id)).scalars()
    if not row:
        response_body['message'] = f'No hay comprador en los usuarios con id: {seller_id}'
    if request.method == 'GET':
        response_body['message'] = f'Usuario comprador con id: {seller_id}'
        response_body["results"] = row.serialize()

