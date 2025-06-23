from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from datetime import datetime, timezone
from api.models import db, Incidencias


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
                     initial_date=datetime.now(timezone.utc),
                     final_date=data.get('final_date'),
                     ia_description=data.get('ia_description'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nueva incidencia'
        response_body['results'] = row.serialize()
        return response_body, 201

@incidencias_api.route('/incidencias/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def incidencia(id):
         response_body = {}
         row = db.session.execute(db.select(Incidencias).where(Incidencias.id == id)).scalar()
         if not row:
            response_body['message'] = f'La incidencia con el id: {id} no existe en nuestros registros'
            return response_body, 400
         
         if request.method == 'GET':
            response_body['message'] = f'Response from the {request.method} para el id {id}'
            response_body['results'] = row.serialize()    
            return response_body, 200
         
         if request.method == 'PUT':
            data = request.json
            row.title = data['title']
            row.description = data['description']
            row.final_date = data['final_date']
            row.ia_description = data['ia_description']
            db.session.commit()
            response_body['message'] = f'La incidencia con el id {id} se ha actualizado correctamente.'
            response_body['results'] = row.serialize() 
            return response_body, 201
         
         if request.method == 'DELETE':
            db.session.delete(row)
            db.session.commit()
            response_body['message'] = f'La incidencia para el id {id} se ha eliminado correctamente.'
            response_body['results'] = row.serialize() 
            return response_body, 200 

# Para ver las ordenes del comprador
@incidencias_api.route('/veterinarios/<int:veterinarios_id>/incidencia', methods=['GET'])
def buyers_orders(veterinarios_id):
    response_body = {}
    row = db.session.execute(db.select(Incidencias).where(Incidencias.veterinarios_id == veterinarios_id)).scalars()
    if not row:
        response_body['message'] = f'Incidencias del veterinario con id: {veterinarios_id}'
    if request.method == 'GET':
        response_body['message'] = f'Incidencias del veterinario con id: {veterinarios_id}'
        response_body["results"] = row.serialize()

