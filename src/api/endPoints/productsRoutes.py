from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from api.models import db, Producto


product_api = Blueprint('productApi', __name__)
CORS(product_api)  # Allow CORS requests to this API

