from flask import request, Blueprint
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import get_jwt
from flask_jwt_extended import jwt_required
from flask_cors import CORS
from api.models import db, Users, Mascotas, TipoMetrica
from flask import jsonify
from datetime import timedelta


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/login', methods=['POST'])
def login():
    response_body = {}
    data = request.json
    username = data.get('username', None)
    email = data.get('email', None)
    password = data.get('password', None)
    remember = data.get('remember', False)
    if username is not None:
        row = db.session.execute(db.select(Users).where(Users.username == username, Users.password == password)).scalar()    
    if username is None:
        row = db.session.execute(db.select(Users).where(Users.email == email, Users.password == password)).scalar()
    if not row:
        response_body['message'] = f'El usuario no existe'
        return response_body, 404
    
    if len(password) < 8:
        return response_body, 400

    symbols = "!@#$%^&*"
    if not any(char in symbols for char in password):
        return response_body, 401

    user = row.serialize()
    claims = {'user_id': user['id'],
              'user_username': user['username'],
              'is_veterinario': user['is_veterinario'],
              'subscription_code': user['subscription_code']}
    if remember:
        access_token = create_access_token(identity=username, additional_claims=claims, expires_delta=timedelta(days=3))
    else:
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

@api.route('/users/mascotas', methods=['GET'])
def get_mascotas():
    response_body = {}
    rows = db.session.execute(db.select(Mascotas)).scalars()
    mascotas = [row.serialize() for row in rows]
    response_body['message'] = 'Lista de mascotas obtenida con éxito'
    response_body['results'] = mascotas
    return response_body, 200


@api.route('/default-metricas', methods=['POST'])
def default_metricas():
    response_body = {}
    valores_por_defecto = [
        "weight",
        "temperature",
        "heart_rate",
        "activity"
    ]
    if request.method == 'POST':
        for metrica_name in valores_por_defecto:
            existe = db.session.execute(db.select(TipoMetrica).where(TipoMetrica.metrica_name == metrica_name)).scalar()
            if not existe:
                tipo = TipoMetrica(metrica_name=metrica_name)
                db.session.add(tipo)

        db.session.commit()
    response_body['message'] = 'Metricas por defecto insertados con éxito'
    return response_body, 200

@api.route('/default-users', methods=['POST'])
def default_usuarios():
    response_body = {}
    usuarios_default = [
        {
            "username": "veterinarioadmin",
            "password": "pawsitivevetadmin25",
            "email": "veterinario@example.com",
            "is_veterinario": True
        },
        {
            "username": "usuarioadmin",
            "password": "pawsitiveuseradmin25",
            "email": "usuario@example.com",
            "is_veterinario": False
        }
    ]

    if request.method == 'POST':
        for usuario_data in usuarios_default:
            username = usuario_data["username"]
            password = usuario_data["password"]
            existing_user = db.session.execute(db.select(Users).where(Users.username == username, Users.password == password)).scalar()

            if not existing_user:
                nuevo_usuario = Users(
                    username=username,
                    password=password,
                    email=usuario_data["email"],
                    is_veterinario=usuario_data["is_veterinario"]
                )
        db.session.add(nuevo_usuario)
        db.session.commit()
    response_body['message'] = 'Usuarios por defecto insertados con éxito'
    response_body['results'] = nuevo_usuario.serialize()
    return response_body, 200

