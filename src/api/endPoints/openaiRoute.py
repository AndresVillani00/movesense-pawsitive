import os
import json
import tempfile
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from openai import OpenAI    
from collections import defaultdict
from datetime import datetime, timedelta
from sqlalchemy import and_
from api.models import db, Metrica, Mascotas, Incidencias, Comida, Analysis

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

openai_api = Blueprint("openai_api", __name__)

# Ruta del excel
EXCEL_PATH = "/workspaces/movesense-pawsitive/src/api/endPoints/files/Perros - Modelo de metricas y alertas.pdf"

# Reglas
VETCHECK_RULES = r"""
Rol:
Eres “VetCheck”, un evaluador de salud canina.
Tu conocimiento está en un Excel con tres hojas: "Clasificaciones", "Categorías" y "Diccionario Clasificaciones".

Objetivo
Dado un JSON de entrada con: especie, raza, tamaño, edad_meses, sexo, esterilizado, peso_kg, agua_ml_dia, actividad_min_dia, temperatura_c y pulso_bpm,
debes compararlos con los rangos del Excel y devolver EXCLUSIVAMENTE un JSON con:
- Estado de cada métrica.
- Estado general.

Fuentes y herramientas:
- Usa SIEMPRE Code Interpreter para abrir y leer el Excel.
- No inventes datos ni rangos.
- Si falta información en el Excel, devuelve "ND".
- Salida solo en formato JSON válido (json.loads debe funcionar).

Normalización de entrada:
- esterilizado: "si"|"sí" → "Si", "no" → "No", "true" → "Si", "false" → "No".
- sexo: "m"|"macho"|"male" → "Macho", "h"|"hembra"|"female" → "Hembra".
- edad_meses: <12 → "Cachorro"; 12–96 → "Adulto"; >96 → "Viejo".
- tamaño: capitaliza → "Pequeño", "Mediano", "Grande".
- raza: usar el nombre tal como aparece en el Excel.

Resolución del código de comparación (Diccionario):
1) Busca por tokens (no string exacto) en “Diccionario Clasificaciones”.
2) Prioridad: D (Raza-Esterilizado-Genero-Edad-Tamaño) → C (Esterilizado-Genero-Edad-Tamaño) → B (Genero-Edad-Tamaño) → A (Edad-Tamaño).
3) Guarda "codigo_comparacion" y "nivel_prioridad_usado" (raza | esterilizado | genero | edad_tamaño).

Localización de rangos (Categorías):
1) Localiza {codigo}-N, {codigo}-A, {codigo}-R en la misma fila (columnas separadas).
2) Desde fila_base+1, en col 0, localiza métricas: "peso_kg", "agua_ml_dia", "actividad_min_dia", "temperatura_c", "pulso_bpm".
3) Para cada métrica, toma valores en columnas N/A/R.

Parsing de rangos:
- Soporta: x-y (intervalo), "x-y o a-b" (uniones), <z, >z.
- Evalúa en orden R → A → N.
- Si no encaja: "sin_referencia".

Clasificación:
1) Métrica: -R ⇒ "peligro"; -A ⇒ "advertencia"; -N ⇒ "normal"; else ⇒ "sin_referencia".
2) General: si alguna "peligro" ⇒ "peligro"; si ninguna "peligro" y alguna "advertencia" ⇒ "advertencia"; si todas "normal" o "sin_referencia" ⇒ "normal".
3) Reglas extra: temperatura_c < 30 o pulso_bpm < 20 o > 350 ⇒ "peligro".

Notas:
- Incluye aviso en el JSON.
- Trátalo como "peligro" si hay unidades imposibles.

Formato de salida (OBLIGATORIO, SOLO JSON):
{
  "estado_general": {
    "situacion": "normal|advertencia|peligro",
    "codigo_comparacion": "PE.*|ND",
    "nivel_prioridad_usado": "raza|esterilizado|genero|edad_tamaño"
  },
  "detalle_metricas": {
    "peso_kg": {"estado": "...", "valor": 0, "codigo_comparacion_peso": "PE.*-N|PE.*-A|PE.*-R|ND", "rango_ref": ""},
    "actividad_min_dia": {"estado": "...", "valor": 0, "codigo_comparacion_actividad": "PE.*-N|PE.*-A|PE.*-R|ND", "rango_ref": ""},
    "agua_ml_dia": {"estado": "...", "valor": 0, "codigo_comparacion_agua": "PE.*-N|PE.*-A|PE.*-R|ND", "rango_ref": ""},
    "temperatura_c": {"estado": "...", "valor": 0, "codigo_comparacion_temperatura": "PE.*-N|PE.*-A|PE.*-R|ND", "rango_ref": ""},
    "pulso_bpm": {"estado": "...", "valor": 0, "codigo_comparacion_pulso": "PE.*-N|PE.*-A|PE.*-R|ND", "rango_ref": ""}
  },
  "contexto_aplicado": {
    "especie": "", "raza": "", "tamano": "", "edad_meses": 0, "segmento_edad": "Cachorro|Adulto|Viejo", "sexo": "", "esterilizado": ""
  },
  "aviso": { "mensaje": "Los datos proporcionados son solo orientativos. Si tiene alguna duda sobre la salud de su mascota, consulte a su veterinario para obtener un diagnóstico y tratamiento adecuados." }
}

RECUERDA: responde ÚNICAMENTE con un único objeto JSON válido.
"""

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
    for name in ("ts_init", "ts_alta"):
        if hasattr(Model, name):
            return getattr(Model, name)
    return None

@openai_api.route("/mascota/<int:mascota_id>/json-entrada", methods=["GET"])
@jwt_required()
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
    metricas_by_type = defaultdict(lambda: defaultdict(list))  # { tipo: {date_str: {"Valor":..., "ts":...}}}
    for m in metricas:
        if not m.ts_init:
            continue
        tipo = m.tipo_metrica_id or "unknown"
        fecha = m.ts_init.strftime("%d/%m/%Y")
        metricas_by_type[tipo][fecha].append({
            "Valor": m.valor_diario,
            "ts": m.ts_init.isoformat()
        })
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
            "Blood en el analisis": getattr(a, "blood", None),
            "Bilirubin en el analisis": getattr(a, "bilirubin", None),
            "Urobiling en el analisis": getattr(a, "urobiling", None),
            "Ketones en el analisis": getattr(a, "ketones", None),
            "Glucose en el analisis": getattr(a, "glucose", None),
            "Protein en el analisis": getattr(a, "protein", None),
            "Nitrite en el analisis": getattr(a, "nitrite", None),
            "Leukocytes en el analisis": getattr(a, "leukocytes", None),
            "PH en el analisis": getattr(a, "ph", None),
            "ts": ts.isoformat()
        })
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
    # --- Construir JSON final ---
    result = {
        "Descripcion de la Mascota": {
            "Raza de la mascota": mascota.raza,
            "Campo en booleano si la mascota esta o no mezclada": mascota.is_mix,
            "Genero de la mascota": mascota.gender,
            "Campo en booleano si la mascota esta o no esterilizado": mascota.is_Esterilizado if hasattr(mascota, 'is_Esterilizado') else getattr(mascota, 'is_esterilizado', None),
            "Patologia de la mascota, si la tuviera": mascota.patologia
        },
        "Analisis Orina": analisis_by_date,
        "Comida": comidas_by_date,
        "Incidencias": incidencias_by_date
    }
    # Añadimos Metricass bajo la sección Descripcion -> "Metricas": {tipo: {fecha: {Valor, ts}}}
    met_section = {}
    for tipo, bydate in metricas_by_type.items():
        # normalizar nombres conocidos
        display_tipo = TIPO_LABELS.get(tipo.lower(), tipo)
        met_section[display_tipo] = {}
        # bydate[fecha] es una lista de dicts; mantenemos la lista tal cual (o puedes transformarla)
        for fecha, entries in bydate.items():
            # entries es una lista de dicts: [{"Valor":..., "ts":...}, ...]
            try:
                sorted_entries = sorted(entries, key=lambda x: x.get("ts") or "")
            except Exception:
                sorted_entries = entries
            # si quieres devolver solo Valor y ts:
            met_section[display_tipo][fecha] = [
                {"Valor": e.get("Valor"), "ts": e.get("ts"), "nota": e.get("nota")} for e in sorted_entries
            ]
    # asignar al result
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
            "Devuelve únicamente un JSON válido con keys: Score, Descripcion, Analisis, Comida, Accion, Futuro. "
            "El valor de las etiquetas Descripcion, Analisis, Comida, Accion es un reporte explicando si es buena o mala la informacion enviada en el JSON de entrada tomando en cuenta que las Incidencias son para el reporte Accion, "
            "y da recomendaciones claras, no muestres los titulos de los datos enviados simplemente da tu opinion profesional,"
            "y genera un quinto reporte para la parte (Futuro) del JSON con los pasos a seguir para el futuro segun los reportes anteriores."
            "Por ultimo para la primera etiqueta Score dame una puntuacion del 1 al 10 sin usar decimales basandote en el posible estado de la mascota segun los datos de cada reporte, donde 1 es muy malo y 10 es muy bueno. "
            "No incluyas texto adicional fuera del JSON. solo devuelve un JSON del estilo {Score:'puntuacion', Descripcion: 'reporte', Analisis: 'reporte', Comida: 'reporte', Accion: 'reporte', Futuro: 'reporte'}. "
            "Es importante que respetes los nombres de las etiquetas ya que las voy a buscar por ese exacto nombre al mostrarlas en mi front-end {Score, Descripcion, Analisis, Comida, Accion, Futuro}"
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
    

def upload_excel(path: str):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Excel no encontrado: {path}")
    print(f"[VetCheck] Subiendo Excel a OpenAI desde {path} ...")
    with open(path, "rb") as f:
        up = client.files.create(file=f, purpose="assistants")
    print(f"[VetCheck] Excel subido con file_id: {up.id}")
    return up.id

def build_user_input(payload: dict) -> str:
    return (
        "Entrada (JSON):\n"
        + json.dumps(payload, ensure_ascii=False)
        + "\n\nAcciones:\n"
        "- Abre el Excel con Code Interpreter (pandas) y aplica las reglas indicadas.\n"
        "- Devuelve exclusivamente el objeto JSON solicitado.\n"
    )

def vetcheck_eval(payload: dict, file_id: str, save_raw_to: str | None = None):
    system_msg = {
        "role": "system", 
        "content": VETCHECK_RULES
    }
    user_msg = {
        "role": "user", 
        "content": [
            {"type": "text", "text": build_user_input(payload)},
            {"type": "file", "file": {"file_id": file_id}}
        ],
    }
    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[system_msg, user_msg],
            temperature=1,
            max_completion_tokens=1000,
            response_format={"type": "json_object"},
        )

        out = getattr(resp, "output_text", None)
        if not out:
            out = "".join([
                getattr(p, "content", "")
                for p in getattr(resp, "output", [])
                if hasattr(p, "content")
            ])

        if save_raw_to:
            with open(save_raw_to, "w", encoding="utf-8") as f:
                f.write(out)

        return json.loads(out)

    except Exception as e:
        raise RuntimeError(f"Error llamando a OpenAI: {str(e)}")
    

@openai_api.route("/generate-analisis", methods=["POST"])
def generate_analisis():
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
            "Eres un veterinario experto. Analiza los datos sobre los analisis de orina enviados "
            "Devuelve únicamente un JSON válido con keys: [blood, bilirubin, urobiling, ketones, glucose, protein, nitrite, leukocytes, ph] "
            "Rellena las keys del json con los datos de la foto enviada en base64 del json en la etiqueta AnalisisEnviado basandote en los datos de la imagen en base64 del json en la etiqueta AnalisisBase "
            "Necesito que los valores que me devuelvas para cada keys del json sea un numero aproximado y si es necesario con al menos un decimal al valor del color que representa, si el valor es Negativo devuelveme Negativo "
            "No incluyas texto adicional fuera del JSON. solo devuelve un JSON del estilo {blood: 'valor', bilirubin: 'valor', urobiling: 'valor', ketones: 'valor', glucose: 'valor', protein: 'valor', nitrite: 'valor', leukocytes: 'valor', ph: 'valor'}. "
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
    

@openai_api.route("/generate-comida", methods=["POST"])
def generate_comida():
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
            "Eres un veterinario experto. Analiza los datos sobre la comida enviada "
            "Devuelve únicamente un JSON válido con keys: [type_food, marca, grasa, proteina, fibra] "
            "Rellena las keys del json con la informacion que precises importante mas lo que consigas como experto veterinario, solo aceptando valores con estas caracteristicas, "
            "para type_food solo puedo aceptar ('suave' si es pure, pate o liquida; 'dura' si es pienzo); para marca: el nombre de la empresa de la comida en la imagen, sino la conoces o no la encuentras devuelve 'No Encontrada'; para grasa, proteina, fibra la que contenga el saco o la cantidad de comida aproximada en la imagen "
            "No incluyas texto adicional fuera del JSON. solo devuelve un JSON del estilo {type_food: 'valor', marca: 'valor', grasa: 'valor', proteina: 'valor', fibra: 'valor'}. "
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
    

@openai_api.route("/vetcheck", methods=["POST"])
def vetcheck_route():
    try:
        payload = request.get_json()
        if not payload:
            return jsonify({"error": "Debe enviar un JSON válido"}), 400

        # Subir Excel y obtener file_id
        file_id = upload_excel(EXCEL_PATH)

        # Archivo temporal para debug (opcional)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".txt") as tmp:
            tmpfile = tmp.name

        # Ejecutar evaluación
        result = vetcheck_eval(payload, file_id, save_raw_to=tmpfile)

        # Limpieza
        try:
            os.remove(tmpfile)
        except:
            pass

        return jsonify(result), 200

    except FileNotFoundError as e:
        print(f"[VetCheck] {e}")
        return jsonify({"error": str(e)}), 500
    except RuntimeError as e:
        print(f"[VetCheck] {e}")
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        print(f"[VetCheck] Error inesperado: {e}")
        return jsonify({"error": str(e)}), 500
