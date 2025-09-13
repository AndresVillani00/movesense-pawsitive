from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from datetime import datetime, timezone
from api.models import db, Incidencias, Mascotas, Users


incidencias_api = Blueprint('incidenciasApi', __name__)
CORS(incidencias_api)  # Allow CORS requests to this API


@incidencias_api.route('/incidencias', methods=['GET', 'POST'])
def incidencias():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Incidencias)).scalars()
        list_incidencias = [ row.serialize() for row in rows ]
        response_body['message'] = f'Listado de incidencias'
        response_body['results'] = list_incidencias
        return response_body, 200
    if request.method == 'POST': 
        data = request.json
        row = Incidencias(title=data.get('title'),
                     description=data.get('description'),
                     initial_date=data.get('initial_date'),
                     final_date=data.get('final_date'),
                     alert_status=data.get('alert_status'),
                     ia_description=data.get('ia_description'),
                     ia_action=data.get('ia_action'),
                     foto_incidencia=data.get('foto_incidencia'),
                     mascota_incidencia_id=data.get('mascota_incidencia_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nueva incidencia'
        response_body['results'] = row.serialize()
        return response_body, 201

@incidencias_api.route('/incidencias/<int:id>', methods=['DELETE'])
def delete_incidencias(id):
    response_body = {}
    row = db.session.execute(db.select(Incidencias).where(Incidencias.id == id)).scalar()
    if not row:
       response_body['message'] = f'La incidencia con el id: {id} no existe en nuestros registros'
       return response_body, 400
    if request.method == 'DELETE':
       db.session.delete(row)
       db.session.commit()
       response_body['message'] = f'La incidencia con el id {id} se ha eliminado correctamente.'
       response_body['results'] = row.serialize() 
       return response_body, 200  


@incidencias_api.route('/usuarios/incidencias', methods=['GET'])
@jwt_required()
def usuario_incidencias():
    response_body = {}
    additional_claims = get_jwt()
    user_id = additional_claims['user_id']
    usuario = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
    if not usuario:
        response_body['message'] = f'El usuario con id: {user_id} no existe'
        return response_body, 404    
    incidencias = db.session.execute(db.select(Incidencias).join(Mascotas).where(Mascotas.user_id == user_id)).scalars()
    incidencias_list = [incidencia.serialize() for incidencia in incidencias]
    if not incidencias_list:
        response_body['message'] = f'No hay incidencias para las mascotas del usuario con id: {user_id}'
        return response_body, 200
    response_body['message'] = f'Incidencias de las mascotas del usuario con id: {user_id}'
    response_body['results'] = incidencias_list
    return response_body, 200



@incidencias_api.route('/mascotas/<int:id>/incidencias', methods=['GET'])
def mascotas_incidencias(id):
    response_body = {}
    mascota = db.session.execute(db.select(Mascotas).where(Mascotas.id == id)).scalar()
    if not mascota:
        response_body['message'] = f'La mascota con id: {id} no existe'
        return response_body, 404    
    mascotas = db.session.execute(db.select(Incidencias).where(Incidencias.mascota_incidencia_id == id)).scalars()    
    incidencias_list = [mascota.serialize() for mascota in mascotas]    
    if not incidencias_list:
        response_body['message'] = f'No hay incidencias para la mascota con id: {id}'
        response_body['results'] = []
        return response_body, 200
    response_body['message'] = f'Incidencias de la mascota con id: {id}'
    response_body['results'] = incidencias_list
    return response_body, 200
