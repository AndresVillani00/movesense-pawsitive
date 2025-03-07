from flask import request, Blueprint
from flask_jwt_extended import create_access_token
from flask_cors import CORS
from api.models import db, Users
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import get_jwt
from flask_jwt_extended import jwt_required


users_api = Blueprint('usersApi', __name__)
CORS(users_api)  # Allow CORS requests to this API


@users_api.route('/users', methods=['GET', 'POST'])
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
        row = Users(username=data.get('username'),
                    password=data.get('password'),
                    name=data.get('name'),
                    last_name=data.get('last_name'),
                    email=data.get('email'),
                    country=data.get('country'),
                    address=data.get('address'),
                    phone=data.get('phone'),
                    gender=data.get('gender'),
                    is_buyer=data.get('is_buyer', False),
                    is_seller=data.get('is_seller', False))
        rowdb = db.session.execute(db.select(Users).where(Users.username == data.get('username'), Users.password == data.get('password'))).scalar()
        if rowdb:
            response_body['message'] = f'El usuario ya existe'
            return response_body, 401
        db.session.add(row)
        db.session.commit()
        user = row.serialize()
        claims = {'user_id': user['id'],
              'user_username': user['username'],
              'is_buyer': user['is_buyer'],
              'is_seller': user['is_seller']}
        access_token = create_access_token(identity=data.get('username'), additional_claims=claims)
        response_body['access_token'] = access_token
        response_body['message'] = f'Agregar nuevo Usuario'
        response_body['results'] = row.serialize()
        return response_body, 200  


@users_api.route('/users/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def user(id):
    response_body = {}
    row = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
    if not row:
        response_body['message'] = f'El Usuario con id: {id}, no existe'
    if request.method == 'GET':
        response_body['message'] = f'Usuario con id: {id}'
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.username=data.get('username'),
        row.name=data.get('name'),
        row.last_name=data.get('last_name'),
        row.email=data.get('email'),
        row.country=data.get('country'),
        row.address=data.get('address'),
        row.phone=data.get('phone')
        db.session.add(row)
        db.session.commit()  
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
    row = db.session.execute(db.select(Users).where(Users.buyer_id == buyer_id, Users.is_buyer == True)).scalars()
    if not row:
        response_body['message'] = f'No hay comprador en los usuarios con id: {buyer_id}'
    if request.method == 'GET':
        response_body['message'] = f'Usuario comprador con id: {buyer_id}'
        response_body["results"] = row.serialize()


@users_api.route('/sellers/<int:seller_id>/users', methods=['GET'])
def user_seller(seller_id):
    response_body = {}
    row = db.session.execute(db.select(Users).where(Users.seller_id == seller_id, Users.is_seller == True)).scalars()
    if not row:
        response_body['message'] = f'No hay vendedor en los usuarios con id: {seller_id}'
    if request.method == 'GET':
        response_body['message'] = f'Usuario vendedor con id: {seller_id}'
        response_body["results"] = row.serialize()
