import os
import json
from flask import Blueprint, request, jsonify, current_app
from openai import OpenAI    
from collections import defaultdict
from datetime import datetime, timedelta
from sqlalchemy import and_
from api.models import db, Metrica, Mascotas, Incidencias, Comida, Analysis

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

openai_api = Blueprint("openai_api", __name__)

# Mapeo de nombres de tipo_metrica a labels legibles
TIPO_LABELS = {
    "activity": "Actividad Fisica",
    "temperature": "Temperatura",
    "heart_rate": "Heart Rate",
    "weight": "Peso",
}

def parse_ts_param(ts_str):
    """Parsea yyyyMMddhhmmss -> datetime"""
    try:
        return datetime.strptime(ts_str, "%Y%m%d%H%M%S")
    except Exception:
        return None

def find_timestamp_attr(Model):
    """Devuelve el atributo timestamp usable en Model (Instrumented attribute) o None."""
    # orden de preferencia
    for name in ("ts_init", "initial_date", "created_at", "created_on", "date", "timestamp", "fecha", "food_time"):
        if hasattr(Model, name):
            return getattr(Model, name)
    return None

@openai_api.route("/mascota/<int:mascota_id>/json-entrada", methods=["GET"])
def mascota_report_range(mascota_id):
    """
    Params:
      start_ts (optional): formato yyyyMMddhhmmss
      end_ts   (optional): formato yyyyMMddhhmmss
    Si no se pasan, toma rango: (ahora - 7d) .. ahora.
    """
    # Parse params
    response_body = {} 
    data = request.args
    start_ts_str = data.get("start_ts")
    end_ts_str = data.get("end_ts")
    now = datetime.utcnow()
    if end_ts_str:
        end = parse_ts_param(end_ts_str) or now
    else:
        end = now
    if start_ts_str:
        start = parse_ts_param(start_ts_str) or (end - timedelta(days=7))
    else:
        start = end - timedelta(days=7)
    if start > end:
        return jsonify({"error": "start_ts debe ser anterior a end_ts"}), 400
    # Obtener mascota
    mascota = db.session.execute(db.select(Mascotas).where(Mascotas.id == mascota_id)).scalar()
    if not mascota:
        return jsonify({"error": f"Mascota id {mascota_id} no encontrada"}), 404
    # --- 1) Métricas ---
    metric_ts_col = find_timestamp_attr(Metrica)  # normalmente ts_init
    q_metric = db.select(Metrica).where(Metrica.mascota_metrica_id == mascota_id)
    if metric_ts_col is not None:
        try:
            q_metric = q_metric.where(metric_ts_col.between(start, end))
        except Exception:
            pass
    metricas = db.session.execute(q_metric).scalars().all()
    # Agrupar metricas: tipo -> fecha -> tomar el registro más reciente del día
    metricas_by_type = defaultdict(dict)  # { tipo: {date_str: {"Valor":..., "ts":...}}}
    for m in metricas:
        if not m.ts_init:
            continue
        tipo = m.tipo_metrica_id or "unknown"
        fecha = m.ts_init.strftime("%d/%m/%Y")
        existing = metricas_by_type[tipo].get(fecha)
        if not existing or (m.ts_init and m.ts_init > datetime.fromisoformat(existing["ts"])):
            metricas_by_type[tipo][fecha] = {
                "Valor": m.valor_diario,
                "ts": m.ts_init.isoformat()
            }
    # --- 2) Analisis (urina) ---
    analysis_ts_col = find_timestamp_attr(Analysis)
    q_analisis = db.select(Analysis).where(Analysis.mascota_analysis_id == mascota_id)
    if analysis_ts_col is not None:
        try:
            q_analisis = q_analisis.where(analysis_ts_col.between(start, end))
        except Exception:
            pass
    analisis = db.session.execute(q_analisis).scalars().all()
    analisis_by_date = defaultdict(list)
    for a in analisis:
        ts = getattr(a, "ts_init", None)
        fecha = ts.strftime("%d/%m/%Y")
        analisis_by_date[fecha].append({
            "Foto del analisis de orina en base64": getattr(a, "foto_analysis", None),
            "ts": ts.isoformat()
        })
    # Si quieres solo el último por día, convertimos a single dict (último)
    analisis_by_date_single = {}
    for fecha, items in analisis_by_date.items():
        # escoger último por ts
        last = sorted(items, key=lambda x: x.get("ts") or "", reverse=True)[0]
        analisis_by_date_single[fecha] = {
            "Foto del analisis de orina en base64": last.get("Foto del analisis de orina en base64"),
            "ts": last.get("ts")
        }
    # --- 3) Comida ---
    comida_ts_col = find_timestamp_attr(Comida)
    q_comida = db.select(Comida).where(Comida.mascota_comida_id == mascota_id)
    if comida_ts_col is not None:
        try:
            q_comida = q_comida.where(comida_ts_col.between(start, end))
        except Exception:
            pass
    comidas = db.session.execute(q_comida).scalars().all()
    comidas_by_date = defaultdict(list)
    for c in comidas:
        ts = getattr(c, "ts_init", None)
        fecha = ts.strftime("%d/%m/%Y")
        comidas_by_date[fecha].append({
            "Foto de la comida en base 64": getattr(c, "foto_food", None),
            "Titulo de contexto de la comida": getattr(c, "title", None),
            "Tipo de comida": getattr(c, "type_food", None),
            "Marca de la comida": getattr(c, "marca", None),
            "Cantidad de comida": getattr(c, "quantity", None),
            "Proteina": getattr(c, "proteina", None),
            "Fibra": getattr(c, "fibra", None),
            "Grasa": getattr(c, "grasa", None),
            "ts": ts.isoformat() if hasattr(ts, "isoformat") else None
        })
    comidas_by_date_single = {}
    for fecha, items in comidas_by_date.items():
        last = sorted(items, key=lambda x: x.get("ts") or "", reverse=True)[0]
        comidas_by_date_single[fecha] = {k: v for k, v in last.items() if k != "ts"}
    # --- 4) Incidencias ---
    inc_ts_col = find_timestamp_attr(Incidencias)
    q_inc = db.select(Incidencias).where(Incidencias.mascota_incidencia_id == mascota_id)
    if inc_ts_col is not None:
        try:
            q_inc = q_inc.where(inc_ts_col.between(start, end))
        except Exception:
            pass
    incidencias = db.session.execute(q_inc).scalars().all()
    incidencias_by_date = defaultdict(list)
    for i in incidencias:
        ts = getattr(i, "ts_alta", None)
        if not ts:
            continue
        fecha = ts.strftime("%d/%m/%Y")
        incidencias_by_date[fecha].append({
            "Foto de la incidencia en base 64": getattr(i, "foto_incidencia", None),
            "Titulo de contexto de la incidencia": getattr(i, "title", None),
            "Descripcion de contexto de la incidencia": getattr(i, "description", None),
            "Fecha de inicio de la incidencia": getattr(i, "initial_date", None).isoformat() if getattr(i, "initial_date", None) else None,
            "Fecha de fin de la incidencia": getattr(i, "final_date", None).isoformat() if getattr(i, "final_date", None) else None,
            "ts": ts.isoformat()
        })
    incidencias_by_date_single = {}
    for fecha, items in incidencias_by_date.items():
        last = sorted(items, key=lambda x: x.get("ts") or "", reverse=True)[0]
        incidencias_by_date_single[fecha] = {k: v for k, v in last.items() if k != "ts"}
    # --- Construir JSON final ---
    result = {
        "Descripcion de la Mascota": {
            "Raza de la mascota": mascota.raza,
            "Campo en booleano si la mascota esta o no mezclada": mascota.is_mix,
            "Genero de la mascota": mascota.gender,
            "Campo en booleano si la mascota esta o no esterilizado": mascota.is_Esterilizado if hasattr(mascota, 'is_Esterilizado') else getattr(mascota, 'is_esterilizado', None),
            "Patologia de la mascota, si la tuviera": mascota.patologia
        },
        "Analisis Orina": analisis_by_date_single,
        "Comida": comidas_by_date_single,
        "Incidencias": incidencias_by_date_single
    }
    # Añadimos Metricass bajo la sección Descripcion -> "Metricas": {tipo: {fecha: {Valor, ts}}}
    met_section = {}
    for tipo, bydate in metricas_by_type.items():
        # normalizar nombres conocidos: activity -> "Actividad Fisica", etc.
        name_map = {
            "activity": "Actividad Fisica",
            "temperature": "Temperatura",
            "heart_rate": "Heart Rate",
            "weight": "Peso"
        }
        display_tipo = name_map.get(tipo.lower(), tipo)
        met_section[display_tipo] = {}
        for fecha, valobj in bydate.items():
            # solo mantenemos "Valor" y "ts" (puedes quitar ts si prefieres)
            met_section[display_tipo][fecha] = {
                "Valor": valobj.get("Valor"),
                "ts": valobj.get("ts")
            }
    result["Descripcion de la Mascota"]["Metricas"] = met_section
    response_body['results'] = result
    return response_body, 200


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
