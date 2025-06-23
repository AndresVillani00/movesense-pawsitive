from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from api.models import db, Veterinarios

veterinarios_api = Blueprint('veterinariosApi', __name__)
CORS(veterinarios_api)

@veterinarios_api.route('/veterinarios', methods=['GET'])
def veterinarios():
    response_body = {}
    additional_claims = get_jwt() 
    if request.method == 'GET':
        rows = db.session.execute(db.select(Veterinarios)).scalars()
        list_buyers = [ row.serialize() for row in rows ]
        response_body['message'] = f'Usuarios Veterinarios'
        response_body['results'] = list_buyers
        return response_body, 200
    if request.method == 'POST':
        data = request.json 
        user_id = additional_claims['id']
        row = Veterinarios(id=user_id,            
                    name_clinica=data.get('name_clinica'),
                    email_clinica=data.get('email_clinica'),
                    address_clinica=data.get('address_clinica'),
                    phone_clinica=data.get('phone_clinica'),
                    name_doctor=data.get('name_doctor'),
                    last_name_doctor=data.get('last_name_doctor'),
                    email_doctor=data.get('email_doctor'),
                    address_doctor=data.get('address_doctor'),
                    phone_doctor=data.get('phone_doctor'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nuevo Veterinario'
        response_body['results'] = row.serialize()
        return response_body, 200 
   

@veterinarios_api.route('/veterinarios/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def veterinario(id):
    response_body = {}
    row = db.session.execute(db.select(Veterinarios).where(Veterinarios.id == id)).scalars()
    if not row:
        response_body['message'] = f'El Veterinario de id: {id}, no existe'
    if request.method == 'GET':
        response_body['message'] = f'Veterinario con id: {id}'
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == 'PUT':
        data = request.json
        row.name_clinica=data.get('name_clinica'),
        row.email_clinica=data.get('email_clinica'),
        row.address_clinica=data.get('address_clinica')
        row.phone_clinica=data.get('phone_clinica'),
        row.name_doctor=data.get('name_doctor'),
        row.last_name_doctor=data.get('last_name_doctor')
        row.email_doctor=data.get('email_doctor'),
        row.address_doctor=data.get('address_doctor'),
        row.phone_doctor=data.get('phone_doctor')
        response_body['message'] = f'Veterinario con id: {id}. Actualizado'
        response_body["results"] = row.serialize()
        return response_body, 200
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'Veterinario con id: {id}. Eliminado'
        return response_body, 200
   