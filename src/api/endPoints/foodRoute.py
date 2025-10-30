from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required     
from flask_jwt_extended import get_jwt                
from flask_jwt_extended import get_jwt_identity         
from flask_cors import CORS
from api.models import db, Comida, Mascotas


food_api = Blueprint('foodApi', __name__)
CORS(food_api)  # Allow CORS requests to this API


@food_api.route('/food', methods=['GET', 'POST'])
def food():
    response_body = {}       
    if request.method == 'GET':
        rows = db.session.execute(db.select(Comida)).scalars()
        list_food = [ row.serialize() for row in rows ]
        response_body['message'] = f'Listado de comida'
        response_body['results'] = list_food
        return response_body, 200
    if request.method == 'POST':
        data = request.json 
        row = Comida(title=data.get('title'),
                    type_food=data.get('type_food'),
                    marca=data.get('marca'),
                    grasa=data.get('grasa'),
                    proteina=data.get('proteina'),
                    fibra=data.get('fibra'),
                    ia_food=data.get('ia_food'),
                    food_time=data.get('food_time'),
                    quantity=data.get('quantity'),
                    foto_food=data.get('foto_food'),
                    mascota_comida_id=data.get('mascota_comida_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nueva Comida'
        response_body['results'] = row.serialize()
        return response_body, 201  
    

@food_api.route('/mascotas/<int:id>/food', methods=['GET'])
def mascotas_food(id):
    response_body = {}
    mascota = db.session.execute(db.select(Mascotas).where(Mascotas.id == id)).scalar()
    if not mascota:
        response_body['message'] = f'La mascota con id: {id} no existe'
        return response_body, 404    
    mascotas = db.session.execute(db.select(Comida).where(Comida.mascota_comida_id == id)).scalars()    
    food_list = [mascota.serialize() for mascota in mascotas]    
    if not food_list:
        response_body['message'] = f'No hay analysis para la mascota con id: {id}'
        response_body['results'] = []
        return response_body, 200
    response_body['message'] = f'Food de la mascota con id: {id}'
    response_body['results'] = food_list
    return response_body, 200


@food_api.route('/foods/<int:id>', methods=['DELETE'])
def delete_foods(id):
    response_body = {}
    row = db.session.execute(db.select(Comida).where(Comida.id == id)).scalar()
    if not row:
       response_body['message'] = f'La comida con el id: {id} no existe en nuestros registros'
       return response_body, 400
    if request.method == 'DELETE':
       db.session.delete(row)
       db.session.commit()
       response_body['message'] = f'La comida con el id {id} se ha eliminado correctamente.'
       response_body['results'] = row.serialize() 
       return response_body, 200  
