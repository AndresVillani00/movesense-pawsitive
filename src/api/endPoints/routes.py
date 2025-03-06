from flask import request, Blueprint
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import get_jwt
from flask_jwt_extended import jwt_required
from flask_cors import CORS
from api.models import db, Users
from flask import jsonify


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

@api.route('/users/profile', methods=['GET'])
@jwt_required()
def user_profile():
    username = get_jwt_identity() 
    user = db.session.execute(db.select(Users).where(Users.username == username)).scalar()
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404
    return jsonify({"message": "Perfil del usuario", "results": user.serialize()}), 200

@api.route('/users/artists', methods=['GET'])
def get_artists():
    response_body = {}
    rows = db.session.execute(db.select(Users).where(Users.is_seller == True)).scalars()
    artists = [row.serialize() for row in rows]
    
    response_body['message'] = 'Lista de artistas obtenida con éxito'
    response_body['results'] = artists
    
    return response_body, 200

