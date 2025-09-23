import os
import json
from flask import Blueprint, request, jsonify, current_app
from openai import OpenAI    
from collections import defaultdict
from datetime import datetime
from sqlalchemy import and_
from api.models import db, Metrica, Mascotas, Incidencias, Comida, Analysis

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

openai_api = Blueprint("openai_api", __name__)


def get_mascota_data(mascota_id, start_date, end_date):
    # convertir timestamps string → datetime
    start = datetime.fromisoformat(start_date)
    end = datetime.fromisoformat(end_date)

    # Query base Mascota
    mascota = db.session.get(Mascotas, mascota_id)

    # Query métricas
    metricas = db.session.query(Metrica).filter(
        Metrica.mascota_metrica_id == mascota_id,
        Metrica.ts_init.between(start, end)
    ).all()

    # Query análisis orina
    analisis = db.session.query(Analysis).filter(
        Analysis.mascota_analysis_id == mascota_id,
        Analysis.ts_init.between(start, end)
    ).all()

    # Query comida
    comidas = db.session.query(Comida).filter(
        Comida.mascota_comida_id == mascota_id,
        Comida.ts_init.between(start, end)
    ).all()

    # Query incidencias
    incidencias = db.session.query(Incidencias).filter(
        Incidencias.mascota_incidencia_id == mascota_id,
        Incidencias.ts_alta.between(start, end)
    ).all()

    return mascota, metricas, analisis, comidas, incidencias


def build_report_json(mascota, metricas, analisis, comidas, incidencias):
    data = {
        "Descripcion de la Mascota": {
            "Raza de la mascota": mascota.raza,
            "Campo en booleano si la mascota esta o no mezclada": mascota.is_mix,
            "Genero de la mascota": mascota.gender,
            "Campo en booleano si la mascota esta o no esterilizado": mascota.is_esterilizado,
            "Patologia de la mascota, si la tuviera": mascota.patologia
        },
        "Analisis Orina": {},
        "Comida": {},
        "Incidencias": {}
    }

    # --- Métricas agrupadas por día ---
    metricas_by_date = defaultdict(dict)
    for m in metricas:
        fecha = m.ts_init.strftime("%d/%m/%Y")
        tipo = m.tipo_metrica_id  # ej: "Peso", "HeartRate"
        if "Metricas" not in metricas_by_date[fecha]:
            metricas_by_date[fecha]["Metricas"] = {}
        metricas_by_date[fecha]["Metricas"][tipo] = m.valor_diario

    # Añadir métricas al JSON de mascota
    for fecha, metricas_dia in metricas_by_date.items():
        data["Descripcion de la Mascota"][fecha] = metricas_dia

    # --- Análisis agrupados por día ---
    for a in analisis:
        fecha = a.ts_init.strftime("%d/%m/%Y")
        data["Analisis Orina"].setdefault(fecha, {
            "Foto del analisis de orina en base64": a.foto_analysis
        })

    # --- Comidas agrupadas por día ---
    for c in comidas:
        fecha = c.ts_init.strftime("%d/%m/%Y")
        data["Comida"].setdefault(fecha, {
            "Foto de la comida en base64": c.foto_food,
            "Titulo de contexto de la comida": c.title,
            "Marca de la comida": c.marca,
            "Tipo de la comida": c.type_food,
            "Cantidad de la comida": c.quantity,
            "Fibra, proteina y grasa por porcentajes": {
                "Fibra": c.fibra,
                "Proteina": c.proteina,
                "Grasa": c.grasa
            }
        })

    # --- Incidencias agrupadas por día ---
    for i in incidencias:
        fecha = i.ts_init.strftime("%d/%m/%Y")
        data["Incidencias"].setdefault(fecha, {
            "Descripcion": i.descripcion,
            "Tipo": i.tipo,
            "Notas": i.notas
        })

    return data


@openai_api.route("/api/mascota/<int:mascota_id>/report", methods=["GET"])
def mascota_report(mascota_id):
    start_date = request.args.get("start_date")  # ej: "2025-09-15T00:00:00"
    end_date = request.args.get("end_date")      # ej: "2025-09-22T23:59:59"

    mascota, metricas, analisis, comidas, incidencias = get_mascota_data(
        mascota_id, start_date, end_date
    )

    if not mascota:
        return {"error": "Mascota no encontrada"}, 404

    data = build_report_json(mascota, metricas, analisis, comidas, incidencias)
    return jsonify(data), 200



@openai_api.route("/generate-report", methods=["POST"])
def generate_report():
    response_body = {} 
    body = request.get_json(force=True, silent=True) or {}
    prompt = body.get("prompt")
    data = body.get("dataToSend")
    if not prompt:
        response_body['message'] = f"Falta el campo 'prompt'"
        return response_body, 400
    # Construimos el contexto: system + user message que incluye el JSON
    system_msg = {
        "role": "system",
        "content": (
            "Eres un veterinario experto. Analiza los datos para mascotas "
            "Devuelve únicamente un JSON válido con keys: Descripcion de la Mascota, Analisis Orina, Comida y Accion, el valor de las tres primeras es un reporte explicando si es buena o mala la informacion enviada, "
            "y da recomendaciones claras, no muestres los titulos de los datos enviados simplemente da tu opinion,"
            "y genera un cuarto reporte para la parte (Accion) del JSON con los pasos a seguir para el futuro segun los reportes anteriores."
            "No incluyas texto adicional fuera del JSON. solo devuelve un JSON del estilo {Descripcion: 'reporte', Analisis: 'reporte', Comida: 'reporte', Accion: 'reporte'}"
        )
    }
    user_msg = {
        "role": "user",
        "content": f"Instrucción: {prompt}\n\nDatos:\n{json.dumps(data, ensure_ascii=False)}"
    }
    try:
        # Llamada al endpoint chat completions (síncrona)
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[system_msg, user_msg],
            temperature=1,
            max_completion_tokens=1000,
            response_format={ "type": "json_object" }
        )
        # El texto generado
        text = resp.choices[0].message.content
        # Intentamos parsear a JSON (si pedimos JSON al modelo es ideal)
        try:
            parsed = json.loads(resp.choices[0].message.content)
            return jsonify({"status": "ok", "results": parsed}), 200
        except Exception:
            # Si no es JSON válido devolvemos el texto crudo para debugging
            return jsonify({"ok": True, "report_text": text}), 200
    except Exception as e:
        current_app.logger.exception("OpenAI request failed")
        response_body['message'] = str(e)
        return response_body, 500
