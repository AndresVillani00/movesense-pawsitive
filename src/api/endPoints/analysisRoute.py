from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required     
from flask_jwt_extended import get_jwt                
from flask_jwt_extended import get_jwt_identity         
from flask_cors import CORS
from api.models import db, Analysis, Mascotas


analysis_api = Blueprint('analysisApi', __name__)
CORS(analysis_api)  # Allow CORS requests to this API


@analysis_api.route('/analysis', methods=['GET', 'POST'])
def analysis():
    response_body = {}       
    if request.method == 'GET':
        rows = db.session.execute(db.select(Analysis)).scalars()
        list_analysis = [ row.serialize() for row in rows ]
        response_body['message'] = f'Listado de analysis'
        response_body['results'] = list_analysis
        return response_body, 200
    if request.method == 'POST':
        data = request.json 
        row = Analysis(blood=data.get('blood'),
                    bilirubin=data.get('bilirubin'),
                    urobiling=data.get('urobiling'),
                    ketones=data.get('ketones'),
                    glucose=data.get('glucose'),
                    protein=data.get('protein'),
                    nitrite=data.get('nitrite'),
                    leukocytes=data.get('leukocytes'),
                    ph=data.get('ph'),
                    json_analysis=data.get('json_analysis'),
                    ts_init=data.get('ts_init'),
                    mascota_analysis_id=data.get('mascota_analysis_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nuevo Analysis'
        response_body['results'] = row.serialize()
        return response_body, 201  
    

@analysis_api.route('/analysis/<int:id>', methods=['DELETE'])
def delete_analysis(id):
    response_body = {}
    row = db.session.execute(db.select(Analysis).where(Analysis.id == id)).scalar()
    if not row:
       response_body['message'] = f'El Analysis con el id: {id} no existe en nuestros registros'
       return response_body, 400
    if request.method == 'DELETE':
       db.session.delete(row)
       db.session.commit()
       response_body['message'] = f'El analysis con el id {id} se ha eliminado correctamente.'
       response_body['results'] = row.serialize() 
       return response_body, 200  


@analysis_api.route('/mascotas/<int:id>/analysis', methods=['GET'])
def mascotas_analysis(id):
    response_body = {}
    mascota = db.session.execute(db.select(Mascotas).where(Mascotas.id == id)).scalar()
    if not mascota:
        response_body['message'] = f'La mascota con id: {id} no existe'
        return response_body, 404    
    mascotas = db.session.execute(db.select(Analysis).where(Analysis.mascota_analysis_id == id)).scalars()    
    analysis_list = [mascota.serialize() for mascota in mascotas]    
    if not analysis_list:
        response_body['message'] = f'No hay analysis para la mascota con id: {id}'
        response_body['results'] = []
        return response_body, 200
    response_body['message'] = f'Analysis de la mascota con id: {id}'
    response_body['results'] = analysis_list
    return response_body, 200
