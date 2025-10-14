from flask import request, Blueprint
from flask_jwt_extended import create_access_token
from flask_cors import CORS
from api.models import db, Users, Veterinarios
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import get_jwt
from flask_jwt_extended import jwt_required
from flask import jsonify


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
        password = data.get('password', None)

        if len(password) < 8:
            response_body['message'] = f'La contraseña debe tener al menos 8 caracteres'
            return response_body, 400

        symbols = "!@#$%^&*"
        if not any(char in symbols for char in password):
            response_body['message'] = f'La contraseña debe contener al menos un símbolo'
            return response_body, 401
        
        row = Users(username=data.get('username'),
                    password=data.get('password'),
                    name=data.get('name'),
                    last_name=data.get('last_name'),
                    email=data.get('email'),
                    country=data.get('country'),
                    address=data.get('address'),
                    phone=data.get('phone'),
                    is_veterinario=data.get('is_veterinario', False))
        rowdb = db.session.execute(db.select(Users).where(Users.username == data.get('username'), Users.password == data.get('password'))).scalar()
        if rowdb:
            response_body['message'] = f'El usuario ya existe'
            return response_body, 404
        db.session.add(row)
        db.session.commit()
        if data.get('is_veterinario'):
            rowveterinario = Veterinarios(id = row.id,
                                            name_clinica = '',
                                            email_clinica = '',
                                            address_clinica = '',
                                            phone_clinica = '',
                                            name_doctor = '',
                                            last_name_doctor = '',
                                            email_doctor = '',
                                            phone_doctor = '')
            db.session.add(rowveterinario)
            db.session.commit()
        user = row.serialize()
        claims = {'user_id': user['id'],
              'user_username': user['username'],
              'is_veterinario': user['is_veterinario'],
              'subscription_code': user['subscription_code']}
        access_token = create_access_token(identity=data.get('username'), additional_claims=claims)
        response_body['access_token'] = access_token
        response_body['message'] = f'Agregar nuevo Usuario'
        response_body['results'] = row.serialize()
        return response_body, 200  
    

@users_api.route('/remember-user', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Devuelve la información del usuario actual autenticado según su token JWT.
    """
    claims = get_jwt()  # incluye los additional_claims que añadiste

    user_id = claims.get('user_id', None)
    if not user_id:
        return jsonify({"message": "No se encontró el ID del usuario en el token"}), 400

    # Busca el usuario en la base de datos
    user = db.session.execute(
        db.select(Users).where(Users.id == user_id)
    ).scalar()

    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    response_body = {
        "message": "Usuario autenticado correctamente",
        "results": user.serialize(),
        "claims": {
            "user_id": claims.get('user_id'),
            "user_username": claims.get('user_username'),
            "is_veterinario": claims.get('is_veterinario'),
            "subscription_code": claims.get('subscription_code')
        }
    }

    return jsonify(response_body), 200


@users_api.route('/users', methods=['PUT'])
@jwt_required()
def user():
    response_body = {}
    additional_claims = get_jwt()
    user_id = additional_claims['user_id']
    row = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not row:
        response_body['message'] = f'El Usuario con id: {user_id}, no existe'
    if request.method == 'PUT':
        data = request.json
        row.name=data.get('name'),
        row.last_name=data.get('last_name'),
        row.email=data.get('email'),
        row.country=data.get('country'),
        row.address=data.get('address'),
        row.phone=data.get('phone'),
        db.session.add(row)
        db.session.commit()  
        response_body['message'] = f'Usuario con id: {user_id}. Actualizado'
        response_body["results"] = row.serialize()
        return response_body, 200
    

@users_api.route('/veterinarios/<int:veterinario_id>/users', methods=['GET'])
def user_veterinario(veterinario_id):
    response_body = {}
    row = db.session.execute(db.select(Users).where(Users.id == veterinario_id, Users.is_veterinario == True)).scalars()
    if not row:
        response_body['message'] = f'No hay comprador en los usuarios con id: {veterinario_id}'
    if request.method == 'GET':
        response_body['message'] = f'Usuario comprador con id: {veterinario_id}'
        response_body["results"] = row.serialize()


#@users_api.route("/users/profile/picture", methods=["PUT"])
#@jwt_required()
#def update_profile_picture():
#    user_id = get_jwt_identity()
#    data = request.get_json()
#    image_url = data.get("image_url")
#    if not image_url:
#        return jsonify({"error": "URL de la imagen no proporcionada"}), 400
#    user = Users.query.get(user_id)
#    if not user:
#        return jsonify({"error": "Usuario no encontrado"}), 404
#    user.image_url = image_url
#    db.session.commit()
#    return jsonify({"message": "Foto de perfil actualizada", "user": users.serialize()}), 200