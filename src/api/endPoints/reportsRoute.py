from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from datetime import datetime, timezone
from api.models import db, Reportes, Mascotas


reportes_api = Blueprint('reportesApi', __name__)
CORS(reportes_api)  # Allow CORS requests to this API


@reportes_api.route('/reportes', methods=['GET'])
@jwt_required()
def reportes():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Reportes)).scalars()
        list_reportes = [ row.serialize() for row in rows ]
        response_body['message'] = f'Listado de reportes'
        response_body['results'] = list_reportes
        return response_body, 200
    

@reportes_api.route('/reportes', methods=['POST'])
def reporte():
    response_body = {}
    if request.method == 'POST': 
        data = request.json
        row = Reportes(score=data.get('score'),
                     food_ia=data.get('food_ia'),
                     description_ia=data.get('description_ia'),
                     action_ia=data.get('action_ia'),
                     future_ia=data.get('future_ia'),
                     analysis_ia=data.get('analysis_ia'),
                     mascota_reports_id=data.get('mascota_reports_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nuevo reporte'
        response_body['results'] = row.serialize()
        return response_body, 201
    

@reportes_api.route('/reportes/<int:id>', methods=['PUT'])
def read_reportes(id):
    response_body = {}
    row = db.session.execute(db.select(Reportes).where(Reportes.id == id)).scalar()
    if not row:
        response_body['message'] = f'El Reporte con id: {id}, no existe'
    if request.method == 'PUT':
        data = request.json
        row.status_read=data.get('status_read')
        db.session.add(row)
        db.session.commit()  
        response_body['message'] = f'Reporte con id: {id}. Actualizado'
        response_body["results"] = row.serialize()
        return response_body, 200
    

@reportes_api.route('/reportes/<int:id>', methods=['DELETE'])
def delete_reportes(id):
    response_body = {}
    row = db.session.execute(db.select(Reportes).where(Reportes.id == id)).scalar()
    if not row:
       response_body['message'] = f'El reporte con el id: {id} no existe en nuestros registros'
       return response_body, 400
    if request.method == 'DELETE':
       db.session.delete(row)
       db.session.commit()
       response_body['message'] = f'El reporte con el id {id} se ha eliminado correctamente.'
       response_body['results'] = row.serialize() 
       return response_body, 200 


@reportes_api.route('/mascotas/<int:id>/reportes', methods=['GET'])
@jwt_required()
def mascotas_reportes(id):
    response_body = {}
    mascota = db.session.execute(db.select(Mascotas).where(Mascotas.id == id)).scalar()
    if not mascota:
        response_body['message'] = f'La mascota con id: {id} no existe'
        return response_body, 404    
    mascotas = db.session.execute(db.select(Reportes).where(Reportes.mascota_reports_id == id)).scalars()    
    reportes_list = [mascota.serialize() for mascota in mascotas]    
    if not reportes_list:
        response_body['message'] = f'No hay reportes para la mascota con id: {id}'
        response_body['results'] = []
        return response_body, 200
    response_body['message'] = f'Reportes de la mascota con id: {id}'
    response_body['results'] = reportes_list
    return response_body, 200
