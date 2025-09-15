import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required     
from flask_jwt_extended import get_jwt                
from flask_jwt_extended import get_jwt_identity         
from flask_cors import CORS

ollama_api = Blueprint("ollama_api", __name__)
CORS(ollama_api)

# Conexión a tu base Postgres (ajusta credenciales)
#report_service = ReportService(os.getenv('DATABASE_URL'))

@ollama_api.route("/ollama/<string:tipo>", methods=["POST"])
def analizar(tipo):
    """
    Endpoint que recibe un JSON y genera un reporte.
    Tipos soportados: orina, incidencia, comida, general
    """
    try:
        data = request.json
        if tipo not in ["orina", "incidencia", "comida", "general"]:
            return jsonify({"error": "Tipo de reporte no válido"}), 400

        reporte = report_service.analizar(data, tipo)
        return jsonify({"reporte": reporte})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

