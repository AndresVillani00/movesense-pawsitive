from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required     
from flask_jwt_extended import get_jwt                
from flask_jwt_extended import get_jwt_identity         
from flask_cors import CORS
from api.models import db, Mascotas, Users


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
        id = additional_claims['mascota_id']
        is_veterinario = additional_claims['is_veterinario']
        if is_veterinario:
            response_body['message'] = f'El usuario es Veterinario'
            return response_body, 404
        row = Mascotas(id=id,
                    raza=data.get('raza'), 
                    mix_raza=data.get('mix_raza'),
                    is_mix=data.get('is_mix'),
                    age=data.get('age'),
                    birth_date=data.get('birth_date'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nueva Mascota'
        response_body['results'] = row.serialize()
        return response_body, 200  
    

@mascotas_api.route('/mascotas/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def mascota(id):
    response_body = {}
    row = db.session.execute(db.select(Mascotas).where(Mascotas.id == id)).scalar()
    if not row:
        response_body['message'] = f'La Mascota de id: {id}, no existe'
    if request.method == 'GET':
        response_body['message'] = f'Mascota con id: {id}'
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.raza = data.get('raza', row.raza)
        row.mix_raza = data.get('mix_raza', row.mix_raza)
        row.is_mix = data.get('is_mix', row.is_mix)
        row.age = data.get('age', row.age)
        row.birth_date = data.get('birth_date', row.birth_date)
        db.session.commit()
        response_body['message'] = f'Mascota con id: {id}. Actualizado'
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Producto con id: {id}. Eliminado'
        return response_body, 200


@mascotas_api.route('/users/<int:user_id>/mascotas', methods=['GET'])
def user_mascotas(user_id):
    response_body = {}
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

