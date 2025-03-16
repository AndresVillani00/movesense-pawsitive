from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from api.models import db, Users, Events

events_api = Blueprint('eventsApi', __name__)
CORS(events_api)

@events_api.route('/events', methods=['GET', 'POST'])
def events():
    response_body = {}
    additional_claims = get_jwt()
    if request.method == 'GET':
        rows = db.session.execute(db.select(Events)).scalars()
        list_events = [row.serialize() for row in rows]
        response_body['message'] = 'Listado de eventos'
        response_body['results'] = list_events
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        user_id = additional_claims['id']
        if not data.get('title') or not data.get('location'):
            response_body['message'] = 'El título y la ubicación son requeridos'
            return response_body, 400
        row = Events(
                     user_post=user_id,
                     title=data.get('title'),
                     date=data.get('date'),
                     location=data.get('location'),
                     body_content=data.get('body_content'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nuevo evento'
        response_body['results'] = row.serialize()
        return response_body, 200 

    