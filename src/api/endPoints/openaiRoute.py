import os
import json
from flask import Blueprint, request, jsonify, current_app
from openai import OpenAI    

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

openai_api = Blueprint("openai_api", __name__)


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
