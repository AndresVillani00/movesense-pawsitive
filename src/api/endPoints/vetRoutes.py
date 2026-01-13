from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from api.models import db, Veterinarios

veterinarios_api = Blueprint('veterinariosApi', __name__)
CORS(veterinarios_api)


@veterinarios_api.route('/veterinarios', methods=['GET'])
@jwt_required()
def veterinarios():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Veterinarios)).scalars()
        list_buyers = [ row.serialize() for row in rows ]
        response_body['message'] = f'Usuarios Veterinarios'
        response_body['results'] = list_buyers
        return response_body, 200
    

@veterinarios_api.route('/veterinarios', methods=['POST'])
def veterinario():
    response_body = {}
    additional_claims = get_jwt() 
    if request.method == 'POST':
        data = request.json 
        user_id = additional_claims['id']
        row = Veterinarios(id=user_id,            
                    num_colegiado=data.get('num_colegiado'),
                    name_clinica=data.get('name_clinica'),
                    email_clinica=data.get('email_clinica'),
                    address_clinica=data.get('address_clinica'),
                    phone_clinica=data.get('phone_clinica'),
                    name_doctor=data.get('name_doctor'),
                    last_name_doctor=data.get('last_name_doctor'),
                    email_doctor=data.get('email_doctor'),
                    phone_doctor=data.get('phone_doctor'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nuevo Veterinario'
        response_body['results'] = row.serialize()
        return response_body, 200 
   

@veterinarios_api.route('/veterinarios', methods=['PUT'])
def veterinario_put():
    response_body = {}
    additional_claims = get_jwt()
    user_id = additional_claims['user_id']
    row = db.session.execute(db.select(Veterinarios).where(Veterinarios.id == user_id)).scalar()
    if not row:
        response_body['message'] = f'El Veterinario con id: {user_id}, no existe'
    if request.method == 'PUT':
        data = request.json
        row.name_clinica=data.get('name_clinica'),
        row.email_clinica=data.get('email_clinica'),
        row.address_clinica=data.get('address_clinica'),
        row.phone_clinica=data.get('phone_clinica'),
        row.name_doctor=data.get('name_doctor'),
        row.last_name_doctor=data.get('last_name_doctor'),
        row.email_doctor=data.get('email_doctor'),
        row.phone_doctor=data.get('phone_doctor'),
        db.session.add(row)
        db.session.commit()  
        response_body['message'] = f'Veterinario con id: {user_id}. Actualizado'
        response_body["results"] = row.serialize()
        return response_body, 200
   