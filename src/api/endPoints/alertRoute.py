from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required     
from flask_jwt_extended import get_jwt                
from flask_jwt_extended import get_jwt_identity         
from flask_cors import CORS
from api.models import db, Alerts


alerts_api = Blueprint('alertsApi', __name__)
CORS(alerts_api)  # Allow CORS requests to this API


@alerts_api.route('/alerts', methods=['GET', 'POST'])
def alerts():
    response_body = {}       
    if request.method == 'GET':
        rows = db.session.execute(db.select(Alerts)).scalars()
        list_alerts = [ row.serialize() for row in rows ]
        response_body['message'] = f'Listado de alertas'
        response_body['results'] = list_alerts
        return response_body, 200
    if request.method == 'POST':
        data = request.json 
        row = Alerts(type=data.get('type'),
                    danger_value=data.get('danger_value'),
                    source=data.get('source'),
                    description=data.get('description'),
                    traffic_light=data.get('traffic_light'),
                    status_read=data.get('status_read'),
                    mascota_alerts_id=data.get('mascota_alerts_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nueva Alerta'
        response_body['results'] = row.serialize()
        return response_body, 201  


@alerts_api.route('/alerts/<int:id>', methods=['PUT'])
def read_alerts(id):
    response_body = {}
    row = db.session.execute(db.select(Alerts).where(Alerts.id == id)).scalar()
    if not row:
        response_body['message'] = f'El Alerta con id: {id}, no existe'
    if request.method == 'PUT':
        data = request.json
        row.status_read=data.get('status_read')
        db.session.add(row)
        db.session.commit()  
        response_body['message'] = f'Alerta con id: {id}. Actualizado'
        response_body["results"] = row.serialize()
        return response_body, 200
    