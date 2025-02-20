from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from api.models import db, Comprador

usuario_api = Blueprint('vendedorApi', __name__)
CORS(Comprador_api)

@Comprador_api.route('/vendedor', methods=['GET'])
def usuario():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Comprador)).scalars()
        datos_comprador = [ row.serialize() for row in rows ]
        response_body['message'] = f'Datos del comprador'
        response_body['results'] = datos_comprador
        return response_body, 200
   