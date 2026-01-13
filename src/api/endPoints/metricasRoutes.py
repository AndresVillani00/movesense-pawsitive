from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt
from flask_cors import CORS
from datetime import datetime
from api.models import db, Metrica, TipoMetrica, Mascotas, MetricaJSON


metricas_api = Blueprint('metricasApi', __name__)
CORS(metricas_api)  # Allow CORS requests to this API


@metricas_api.route('/metricas', methods=['GET'])
@jwt_required()
def metricas():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(TipoMetrica)).scalars()
        list_metricas = [ row.serialize() for row in rows ]
        response_body['message'] = f'Listado de tipos de metricas'
        response_body['results'] = list_metricas
        return response_body, 200 
    

@metricas_api.route('/metricas', methods=['POST'])
def metrica():
    response_body = {}
    if request.method == 'POST':
        data = request.json
        row = Metrica(valor_diario=data.get('valor_diario'),
                     note=data.get('note'),
                     ts_init=data.get('ts_init'),
                     mascota_metrica_id=data.get('mascota_metrica_id'),
                     tipo_metrica_id=data.get('tipo_metrica_id'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nueva metrica'
        response_body['results'] = row.serialize()
        return response_body, 200 
    

@metricas_api.route('/metricas/<int:id>', methods=['DELETE'])
def delete_metricas(id):
    response_body = {}
    row = db.session.execute(db.select(Metrica).where(Metrica.id == id)).scalar()
    if not row:
        response_body['message'] = f'La metrica con el id: {id} no existe en nuestros registros'
        return response_body, 400
    if request.method == 'DELETE':
        db.session.delete(row)
        db.session.commit()
        response_body['message'] = f'El detalle de la metrica con el id {id} se ha eliminado correctamente.'
        response_body['results'] = row.serialize() 
        return response_body, 200 
         

@metricas_api.route('/mascotas/<int:id>/metricas', methods=['GET'])
@jwt_required()
def mascotas_metricas(id):
    response_body = {}
    mascota = db.session.execute(db.select(Mascotas).where(Mascotas.id == id)).scalar()
    if not mascota:
        response_body['message'] = f'La mascota con id: {id} no existe'
        return response_body, 404    
    mascotas = db.session.execute(db.select(Metrica).where(Metrica.mascota_metrica_id == id)).scalars()    
    metrica_list = [mascota.serialize() for mascota in mascotas]    
    if not metrica_list:
        response_body['message'] = f'No hay metrica para la mascota con id: {id}'
        response_body['results'] = []
        return response_body, 200
    response_body['message'] = f'Metrica de la mascota con id: {id}'
    response_body['results'] = metrica_list
    return response_body, 200


@metricas_api.route('/metricas-json', methods=['POST'])
def metricas_json():
    response_body = {}
    if request.method == 'POST':
        data = request.json
        row = MetricaJSON(json_actividad=data.get('json_actividad'),
                     json_peso=data.get('json_peso'),
                     json_pulso=data.get('json_pulso'),
                     json_temperatura=data.get('json_temperatura'),
                     json_clasificacion=data.get('json_clasificacion'))
        db.session.add(row)
        db.session.commit()
        response_body['message'] = f'Agregar nueva metrica'
        response_body['results'] = row.serialize()
        return response_body, 200 
    

@metricas_api.route('/mascotas/<int:id>/metricas-json', methods=['GET'])
@jwt_required()
def mascotas_metricas_json(id):
    response_body = {}
    mascota = db.session.execute(db.select(Mascotas).where(Mascotas.id == id)).scalar()
    if not mascota:
        response_body['message'] = f'La mascota con id: {id} no existe'
        return response_body, 404    
    mascotas = db.session.execute(db.select(MetricaJSON).where(MetricaJSON.mascota_metrica_json_id == id)).scalars()    
    metrica_list = [mascota.serialize() for mascota in mascotas]    
    if not metrica_list:
        response_body['message'] = f'No hay json de metrica para la mascota con id: {id}'
        response_body['results'] = []
        return response_body, 200
    response_body['message'] = f'JSON de Metrica de la mascota con id: {id}'
    response_body['results'] = metrica_list
    return response_body, 200


def _norm_str(raza):
    if raza is None:
        return ""
    return str(raza).strip()

def _norm_genero(genero):
    if genero is None: return ""
    gender = str(genero).strip()
    if gender in ("Male"):
        return "Macho"
    if gender in ("Female"):
        return "Hembra"
    return gender.capitalize()

def _norm_esterilizado(is_esterilizado):
    if is_esterilizado is None: return ""
    esterilizado = str(is_esterilizado).strip()
    if esterilizado in ("true", "True"):
        return "Si"
    if esterilizado in ("false", "False"):
        return "No"
    return esterilizado.capitalize()

def _norm_tamano(tamano):
    if tamano is None: return ""
    size = str(tamano).strip()
    if size in ("Pequeño"):
        return "Pequeño"
    if size in ("Mediano"):
        return "Mediano"
    if size in ("Grande"):
        return "Grande"
    return size.capitalize()

def _norm_edad_segmento(meses):
    try:
        edad = int(meses)
    except Exception:
        return None
    if edad < 13:
        return "Cachorro"
    if (edad >= 13) and (edad <= 84):
        return "Adulto"
    if edad > 84:
        return "Viejo"

def find_valor_by_pair(records, val1, val2):
    """Busca el 'valor' según los dos campos en la lista de clasificaciones."""
    if not records:
        return None
    v1, v2 = _norm_str(val1).lower(), _norm_str(val2).lower()
    for r in records:
        a = _norm_str(r.get("dato_clasificacion_1", "")).lower()
        b = _norm_str(r.get("dato_clasificacion_2", "")).lower()
        if a == v1 and b == v2:
            return r.get("valor")
    return None

@metricas_api.route("/codigo-final/<int:id>", methods=["GET"])
@jwt_required()
def codigo_mascota(id):    
    # 1) Buscar mascota por mascota_name_id
    mascota = db.session.execute(db.select(Mascotas).where(Mascotas.id == id)).scalar()
    if not mascota:
        return jsonify({"error": f"No se encontró la mascota con id '{id}'"}), 404
    
    # 2) Obtener el registro de MetricaJSON (hay uno estático) -> usar scalar() o first()
    metrica_row = db.session.execute(db.select(MetricaJSON)).scalar()

    # alternativamente si puede haber varios: db.session.execute(db.select(MetricaJSON)).scalars().first()
    if not metrica_row:
        return jsonify({"error": "No existe ningún registro en MetricaJSON (json_clasificacion faltante)"}), 404

    if not getattr(metrica_row, "json_clasificacion", None):
        return jsonify({"error": "El registro de MetricaJSON no contiene 'json_clasificacion'"}), 404

    clasif_root = metrica_row.json_clasificacion
    # si la estructura es {"Clasificaciones": {...}} nos quedamos con el dict interior
    clasif_json = clasif_root.get("Clasificaciones", clasif_root) if isinstance(clasif_root, dict) else {}

    # 3) Obtener datos de la mascota (y normalizarlos)
    raza = getattr(mascota, "raza", None)
    genero = getattr(mascota, "gender", None)
    esterilizado = getattr(mascota, "is_Esterilizado", None)
    tamano = getattr(mascota, "tamano", None)

    birth_date = getattr(mascota, "birth_date", None)

    # 4) calcular edad en meses desde birth_date si existe
    edad_meses = None
    if birth_date:
        try:
            today = datetime.utcnow().date()
            # birth_date puede ser date o datetime
            bd = birth_date if isinstance(birth_date, (datetime,)) else birth_date
            # si es datetime, extraer date
            if hasattr(bd, "date"):
                bd = bd.date()
            edad_meses = (today.year - bd.year) * 12 + (today.month - bd.month)
            if today.day < bd.day:
                edad_meses -= 1
        except Exception:
            edad_meses = None

    # 5) normalizaciones
    edad_segmento = _norm_edad_segmento(edad_meses)
    genero_n = _norm_genero(genero)
    esterilizado_n = _norm_esterilizado(esterilizado)
    tamano_n = _norm_tamano(tamano)
    raza_n = _norm_str(raza)

    # 6) listas del JSON
    edad_tamano_list = clasif_json.get("edad_tamano", [])
    genero_list = clasif_json.get("genero", [])
    esterilizacion_list = clasif_json.get("esterilizacion", [])
    raza_list = clasif_json.get("raza", [])

    # 7) secuencia de búsqueda
    codigo1 = None
    if edad_segmento and tamano_n:
        codigo1 = find_valor_by_pair(edad_tamano_list, edad_segmento, tamano_n)
    codigo2 = None
    if codigo1 and genero_n:
        codigo2 = find_valor_by_pair(genero_list, genero_n, codigo1)
    codigo3 = None
    if codigo2 and esterilizado_n:
        codigo3 = find_valor_by_pair(esterilizacion_list, esterilizado_n, codigo2)
    codigo4 = None
    if codigo3 and raza_n:
        codigo4 = find_valor_by_pair(raza_list, raza_n, codigo3)

    response_body = {}
    response_body['message'] = f'Codigo recuperado de la mascota con id: {id}'
    response_body['results'] = codigo4
    return response_body, 200


@metricas_api.route('/metricas-alertas/<string:codigo>', methods=['GET'])
@jwt_required()
def metricas_codigo(codigo):
    # Buscar todos los registros de MetricaJSON que tengan json_peso
    metricas = db.session.execute(db.select(MetricaJSON)).scalar()

    result_actividad = []
    datos = metricas.json_actividad.get("metricas_actividad", {}).get("datos", [])
    for d in datos:
        if d.get("Codigo") == codigo:
            result_actividad.append({
                "Alarma": d.get("Alarma"),
                "RangoActividad": d.get("RangoActividad")
            })

    result_peso = []
    datos = metricas.json_peso.get("metricas_peso", {}).get("datos", [])
    for d in datos:
        if d.get("Codigo") == codigo:
            result_peso.append({
                "Alarma": d.get("Alarma"),
                "RangoPeso": d.get("RangoPeso")
            })

    result_pulso = []
    datos = metricas.json_pulso.get("metricas_pulso", {}).get("datos", [])
    for d in datos:
        if d.get("Codigo") == codigo:
            result_pulso.append({
                "Alarma": d.get("Alarma"),
                "RangoPulso": d.get("RangoPulso")
            })
    
    result_temperatura = []
    datos = metricas.json_temperatura.get("metricas_temperatura", {}).get("datos", [])
    for d in datos:
        if d.get("Codigo") == codigo:
            result_temperatura.append({
                "Alarma": d.get("Alarma"),
                "RangoTemperatura": d.get("RangoTemperatura")
            })

    if not result_actividad:
        return jsonify({"message": f"No se encontraron datos de actividad para el código {codigo}"}), 404
    
    if not result_peso:
        return jsonify({"message": f"No se encontraron datos de peso para el código {codigo}"}), 404
    
    if not result_pulso:
        return jsonify({"message": f"No se encontraron datos de pulso para el código {codigo}"}), 404
    
    if not result_temperatura:
        return jsonify({"message": f"No se encontraron datos de temperatura para el código {codigo}"}), 404

    return jsonify({
        "codigo": codigo,
        "results": {
            "result_actividad": result_actividad,
            "result_peso": result_peso,
            "result_pulso": result_pulso,
            "result_temperatura": result_temperatura
        }
    }), 200


