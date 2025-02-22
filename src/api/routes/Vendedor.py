from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from api.models import db, Vendedor

usuario_api = Blueprint('vendedorApi', __name__)
CORS(Vendedor_api)

@Vendedor_api.route('/vendedor', methods=['GET'])
def usuario():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Vendedor)).scalars()
        vendor_info = [ row.serialize() for row in rows ]
        response_body['message'] = f'Información del vendedor'
        response_body['results'] = vendor_info
        return response_body, 200
     