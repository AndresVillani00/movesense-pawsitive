from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from api.models import db, Usuario


user_api = Blueprint('userApi', __name__)
CORS(user_api)  # Allow CORS requests to this API


@user_api.route('/users', methods=['GET'])
def usuario():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Usuario)).scalars()
        list_users = [ row.serialize() for row in rows ]
        response_body['message'] = f'Listado de usuarios'
        response_body['results'] = list_users
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        row = Usuario(email=data.get('email'),
                    password=data.get('password'),
                    is_active=data.get('is_active'),
                    first_name=data.get('first_name'),
                    last_name=data.get('last_name'))
        response_body['message'] = f'Agregar nueva publicacion'
        response_body['results'] = row.serialize()
        return response_body, 200  