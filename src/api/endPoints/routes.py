from flask import request, Blueprint
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import get_jwt
from flask_jwt_extended import jwt_required
from flask_cors import CORS
from api.models import db, Users


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/login', methods=['POST'])
def login():
    response_body = {}
    data = request.json
    username = data.get('username', None)
    password = data.get('password', None)
    row = db.session.execute(db.select(Users).where(Users.username == username, Users.password == password)).scalar()
    if not row:
        response_body['message'] = f'El usuario no existe'
        return response_body, 401
    user = row.serialize()
    claims = {'user_id': user['id'],
              'user_username': user['username'],
              'is_buyer': user['is_buyer'],
              'is_seller': user['is_seller']}
    access_token = create_access_token(identity=username, additional_claims=claims)
    response_body['access_token'] = access_token
    response_body['message'] = f'Usuario Logeado'
    response_body['results'] = user
    return response_body, 200


@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    response_body = {}
    current_user = get_jwt_identity()
    additional_claims = get_jwt()
    response_body['message'] = f'Usuario logeado por: {current_user}'
    response_body['datos adicionales'] = additional_claims
    return response_body, 200
