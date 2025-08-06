from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from datetime import datetime, timezone
from api.models import db, Metrica, TipoMetrica, Mascotas


metricas_api = Blueprint('metricasApi', __name__)
CORS(metricas_api)  # Allow CORS requests to this API



@metricas_api.route('/metricas', methods=['GET', 'POST'])
def metricas():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(TipoMetrica)).scalars()
        list_metricas = [ row.serialize() for row in rows ]
        response_body['message'] = f'Listado de tipos de metricas'
        response_body['results'] = list_metricas
        return response_body, 200 
    if request.method == 'POST':
        data = request.json
        row = Metrica(valor_diario=data.get('valor_diario'),
                     note=data.get('note'),
                     ts_init=data.get('ts_init'),
                     mascota_metrica_id=data.get('mascota_metrica_id'),
                     tipo_metrica_id=data.get('tipo_metrica_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nueva metrica'
        response_body['results'] = row.serialize()
        return response_body, 200 
    

@metricas_api.route('/metricas/<int:id>', methods=['DELETE'])
def delete_metricas(id):
    response_body = {}
    row = db.session.execute(db.select(Metrica).where(Metrica.id == id)).scalar()
    if not row:
        response_body['message'] = f'La metrica con el id: {id} no existe en nuestros registros'
        return response_body, 400
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'El detalle de la metrica con el id {id} se ha eliminado correctamente.'
        response_body['results'] = row.serialize() 
        return response_body, 200 
         

@metricas_api.route('/mascotas/<int:id>/metricas', methods=['GET'])
def mascotas_metricas(id):
    response_body = {}
    mascota = db.session.execute(db.select(Mascotas).where(Mascotas.id == id)).scalar()
    if not mascota:
        response_body['message'] = f'La mascota con id: {id} no existe'
        return response_body, 404    
    mascotas = db.session.execute(db.select(Metrica).where(Metrica.mascota_metrica_id == id)).scalars()    
    metrica_list = [mascota.serialize() for mascota in mascotas]    
    if not metrica_list:
        response_body['message'] = f'No hay metrica para la mascota con id: {id}'
        response_body['results'] = []
        return response_body, 200
    response_body['message'] = f'Metrica de la mascota con id: {id}'
    response_body['results'] = metrica_list
    return response_body, 200
