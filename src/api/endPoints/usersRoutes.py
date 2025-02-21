from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from api.models import db, Users


users_api = Blueprint('usersApi', __name__)
CORS(users_api)  # Allow CORS requests to this API


@users_api.route('/users', methods=['GET'])
def users():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Users)).scalars()
        list_users = [ row.serialize() for row in rows ]
        response_body['message'] = f'Listado de usuarios'
        response_body['results'] = list_users
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Users(name=data.get('name'),
                    last_name=data.get('last_name'),
                    country=data.get('country'),
                    address=data.get('address'),
                    phone=data.get('phone'),
                    gender=data.get('gender'),
                    is_rol=data.get('is_rol'))
        response_body['message'] = f'Agregar nuevo Usuario'
        response_body['results'] = row.serialize()
        return response_body, 200  
    

@users_api.route('/users/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def user(id):
    response_body = {}
    row = db.session.execute(db.select(Users).where(Users.id == id)).scalars()
    if not row:
        response_body['message'] = f'El Usuario de id: {id}, no existe'
    if request.method == 'GET':
        response_body['message'] = f'Usuario con id: {id}'
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.name=data.get('name'),
        row.last_name=data.get('last_name'),
        row.country=data.get('country'),
        row.address=data.get('address'),
        row.phone=data.get('phone'),
        row.gender=data.get('gender'),
        row.is_rol=data.get('is_rol')
        response_body['message'] = f'Usuario con id: {id}. Actualizado'
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Usuario con id: {id}. Eliminado'
        return response_body, 200
    

@users_api.route('/buyers/<int:buyer_id>/users', methods=['GET'])
def user_buyer(buyer_id):
    response_body = {}
    row = db.session.execute(db.select(Users).where(Users.buyer_id == buyer_id)).scalars()
    if not row:
        response_body['message'] = f'No hay comprador en los usuarios con id: {buyer_id}'
    if request.method == 'GET':
        response_body['message'] = f'Usuario comprador con id: {buyer_id}'
        response_body["results"] = row.serialize()


@users_api.route('/sellers/<int:seller_id>/users', methods=['GET'])
def user_seller(seller_id):
    response_body = {}
    row = db.session.execute(db.select(Users).where(Users.seller_id == seller_id)).scalars()
    if not row:
        response_body['message'] = f'No hay vendedor en los usuarios con id: {seller_id}'
    if request.method == 'GET':
        response_body['message'] = f'Usuario vendedor con id: {seller_id}'
        response_body["results"] = row.serialize()
