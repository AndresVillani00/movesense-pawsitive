from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from datetime import datetime, timezone
from api.models import db, Metrica, TipoMetrica, DetailsMetrica, Mascotas


metricas_api = Blueprint('metricasApi', __name__)
CORS(metricas_api)  # Allow CORS requests to this API



@metricas_api.route('/metricas/tipos', methods=['GET', 'POST'])
def metricas():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(TipoMetrica)).scalars()
        list_metricas = [ row.serialize() for row in rows ]
        response_body['message'] = f'Listado de tipos de metricas'
        response_body['results'] = list_metricas
        return response_body, 200 
    

@metricas_api.route('/mascotas/<int:id>/metricas', methods=['GET', 'PUT', 'DELETE'])
def metricas_mascota(id):
         response_body = {}
         row = db.session.execute(db.select(Mascotas).where(Mascotas.id == id)).scalar()
         if not row:
            response_body['message'] = f'La mascota con el id: {id} no existe en nuestros registros'
            return response_body, 400
         if request.method == 'GET':
            response_body['message'] = f'Mascota para el id {id}'
            response_body['results'] = row.serialize()    
            return response_body, 200
         if request.method == 'POST':
            data = request.json
            row = DetailsMetrica(ts_metrica=datetime.now(timezone.utc),
                    valor=data.get('valor'))
            db.session.add(row)
            db.session.commit()
            response_body['message'] = f'Agregar nuevo detalle de metrica'
            response_body['results'] = row.serialize()
            return response_body, 201
         if request.method == 'PUT':
            data = request.json
            row.ts_metrica = data['ts_metrica']
            row.valor = data['valor']
            db.session.commit()
            response_body['message'] = f'El detalle de la metrica con el id {id} se ha actualizado correctamente.'
            response_body['results'] = row.serialize() 
            return response_body, 201
         if request.method == 'DELETE':
            db.session.delete(row)
            db.session.commit()
            response_body['message'] = f'El detalle de la metrica con el id {id} se ha eliminado correctamente.'
            response_body['results'] = row.serialize() 
            return response_body, 200 
    

@metricas_api.route('/mascotas/<int:id>/resumen-metricas', methods=['GET'])
def resumen_metricas(id):
    response_body = {}
    row = db.session.execute(db.select(Metrica).where(Metrica.id == id)).scalars()
    if not row:
        response_body['message'] = f'La metrica con el id{id} NO EXISTE'
    if request.method == 'GET':
        response_body['message'] = f'La metrica con el id {id}'
        response_body["results"] = row.serialize()


@metricas_api.route('/incidencias/<int:mascota_id>/metricas', methods=['GET'])
def metricas_incidencias(mascota_id):
    response_body = {}
    row = db.session.execute(db.select(Metrica).where(Metrica.mascota_id == mascota_id)).scalars()
    if not row:
        response_body['message'] = f'La mascota con el id{mascota_id} NO EXISTE'
    if request.method == 'GET':
        response_body['message'] = f'La mascota con el id {mascota_id}'
        response_body["results"] = row.serialize()
