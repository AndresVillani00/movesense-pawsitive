from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required     
from flask_jwt_extended import get_jwt                
from flask_jwt_extended import get_jwt_identity         
from flask_cors import CORS
from api.models import db, Mascotas, Users, Users_Mascotas


mascotas_api = Blueprint('mascotasApi', __name__)
CORS(mascotas_api)  # Allow CORS requests to this API


@mascotas_api.route('/mascotas', methods=['GET'])
def mascotas():
    response_body = {}       
    if request.method == 'GET':
        rows = db.session.execute(db.select(Mascotas)).scalars()
        list_mascotas = [ row.serialize() for row in rows ]
        response_body['message'] = f'Listado de mascotas'
        response_body['results'] = list_mascotas
        return response_body, 200
    
@mascotas_api.route('/mascotas', methods=['POST'])
@jwt_required()
def postMascotas():
    response_body = {}
    additional_claims = get_jwt() 
    if request.method == 'POST':
        data = request.json 
        user_id = additional_claims['user_id']
        is_veterinario = additional_claims['is_veterinario']
        if is_veterinario:
            response_body['message'] = f'El usuario es Veterinario'
            return response_body, 404
        row = Mascotas(mascota_name_id=data.get('mascota_name_id'),
                    password=data.get('password'),
                    name_mascot=data.get('name_mascot'),
                    foto_mascot=data.get('foto_mascot'),
                    raza=data.get('raza'),
                    gender=data.get('gender'),
                    birth_date=data.get('birth_date'),
                    patologia=data.get('patologia'),
                    is_mix=data.get('is_mix'),
                    is_Esterilizado=data.get('is_Esterilizado'),
                    score=data.get('score'),
                    user_id=user_id)
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nueva Mascota'
        response_body['results'] = row.serialize()
        return response_body, 200  
    

@mascotas_api.route('/mascotas/<string:mascota_name_id>/usuarios', methods=['GET'])
def get_usuarios_de_mascota(mascota_name_id):
    response_body = {}
    mascota = db.session.execute(db.select(Mascotas).where(Mascotas.mascota_name_id == mascota_name_id)).scalar()
    if not mascota:
        response_body['message'] = f'La Mascota con id: {mascota_name_id} no existe'
        return response_body, 404
    if request.method == 'GET':
        share = db.session.execute(db.select(Users).join(Users_Mascotas).where(Users_Mascotas.mascota_usuario_id == mascota.id)).scalars().all()
        response_body['message'] = f'Usuarios asociados a la mascota con id: {mascota.id}'
        response_body['results'] = [usuario.serialize() for usuario in share]
        return response_body, 200
    

@mascotas_api.route('/usuarios/<int:id>/share-mascot', methods=['GET'])
def get_mascotas_ajenas(id):
    response_body = {}
    usuario = db.session.execute(db.select(Users).where(Users.id == id)).scalar()
    if not usuario:
        response_body['message'] = f'El usuario con id {id} no existe'
        return response_body, 404
    if request.method == 'GET':
        mascotas_share = usuario.mascotas  # relación many-to-many
        mascotas_ajenas = [m for m in mascotas_share if m.user_id != id]
        response_body['message'] = f'Mascotas ajenas asociadas al usuario con id: {id}'
        response_body['results'] = [m.serialize() for m in mascotas_ajenas]
        return response_body, 200


@mascotas_api.route('/mascotas/<string:mascota_name_id>/share', methods=['POST'])
def share_mascot(mascota_name_id):
    response_body = {}
    data = request.json
    user_id = data.get('usuario_mascota_id')
    password = data.get('password')
    mascota = Mascotas.query.filter_by(mascota_name_id=mascota_name_id, password=password).first()
    if not mascota:
        response_body['message'] = 'Mascota no encontrada o contraseña incorrecta'
        return response_body, 404
    existing = db.session.execute(db.select(Users_Mascotas).where(Users_Mascotas.usuario_mascota_id == data.get('usuario_mascota_id'), Users_Mascotas.mascota_usuario_id == mascota.id)).scalar()
    if existing:
        response_body['message'] = 'El usuario ya tiene acceso a esta mascota'
        return response_body, 409
    if request.method == 'POST':
        share = Users_Mascotas(usuario_mascota_id=user_id, 
                                mascota_usuario_id=mascota.id)
        db.session.add(share)
        db.session.commit()
        response_body['message'] = 'Mascota agregada a tu cuenta'
        return response_body, 200
    

@mascotas_api.route('/mascotas/<int:id>/delete-share/<int:usuario_id>', methods=['DELETE'])
@jwt_required()
def delete_share_mascot(id, usuario_id):
    response_body = {}
    user_log_id = get_jwt()['user_id']
    row = db.session.execute(db.select(Mascotas).where(Mascotas.id == id)).scalar()
    if not row:
        response_body['message'] = f'La Mascota de id: {id}, no existe'
        return response_body, 404
    if row.user_id != user_log_id:
        response_body['message'] = 'No tienes permisos para eliminar usuarios de esta mascota'
        return response_body, 403
    if request.method == 'DELETE':
        share_mascot = db.session.execute(db.select(Users_Mascotas).where(Users_Mascotas.usuario_mascota_id == usuario_id, Users_Mascotas.mascota_usuario_id == id)).scalar()
        if not share_mascot:
            response_body['message'] = 'Este usuario no está asociado a la mascota'
            return response_body, 404
        db.session.delete(share_mascot)
        db.session.commit()
        response_body['message'] = 'Usuario eliminado correctamente de la mascota'
        return response_body, 200

@mascotas_api.route('/mascotas/<int:id>', methods=['PUT', 'DELETE'])
def mascota(id):
    response_body = {}
    row = db.session.execute(db.select(Mascotas).where(Mascotas.id == id)).scalar()
    if not row:
        response_body['message'] = f'La Mascota de id: {id}, no existe'
    if request.method == 'PUT':
        data = request.json
        row.mascota_name_id = data.get('mascota_name_id', row.mascota_name_id)
        row.password = data.get('password', row.password)
        row.name_mascot = data.get('name_mascot', row.name_mascot)
        row.foto_mascot = data.get('foto_mascot', row.foto_mascot)
        row.raza = data.get('raza', row.raza)
        row.birth_date = data.get('birth_date', row.birth_date)
        row.patologia = data.get('patologia', row.patologia)
        row.is_mix = data.get('is_mix', row.is_mix)
        row.is_Esterilizado = data.get('is_Esterilizado', row.is_Esterilizado)
        row.score = data.get('score', row.score)
        row.status = data.get('status', row.status)
        db.session.commit()
        response_body['message'] = f'Mascota con id: {id}. Actualizado'
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Mascota con id: {id}. Eliminado'
        return response_body, 200


@mascotas_api.route('/users/mascotas', methods=['GET'])
@jwt_required()
def user_mascotas():
    response_body = {}
    additional_claims = get_jwt()
    user_id = additional_claims['user_id']
    usuario = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not usuario:
        response_body['message'] = f'El usuario con id: {user_id} no existe'
        return response_body, 404    
    mascotas = db.session.execute(db.select(Mascotas).where(Mascotas.user_id == user_id)).scalars()    
    mascotas_list = [mascota.serialize() for mascota in mascotas]    
    if not mascotas_list:
        response_body['message'] = f'No hay mascotas para el usuario con id: {user_id}'
        response_body['results'] = []
        return response_body, 200
    response_body['message'] = f'Mascotas del usuario con id: {user_id}'
    response_body['results'] = mascotas_list
    return response_body, 200

