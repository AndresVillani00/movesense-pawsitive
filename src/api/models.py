from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()


class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    password = db.Column(db.String(), unique=False, nullable=False)
    name = db.Column(db.String(), unique=False, nullable=True, default=" ")
    last_name = db.Column(db.String(), unique=False, nullable=True, default=" ")
    email = db.Column(db.String(), unique=True, nullable=True, default=" ")
    country = db.Column(db.String(), unique=False, nullable=True, default=" ")
    address = db.Column(db.String(), unique=False, nullable=True, default=" ")
    phone = db.Column(db.String(), unique=False, nullable=True, default=" ")
    is_veterinario = db.Column(db.Boolean(), nullable=False, default=False)
    subscription_code = db.Column(db.String(36), nullable=True, unique=True)  # UUID string
    subscription_active = db.Column(db.Boolean(), default=False)
    stripe_customer_id = db.Column(db.String(120), nullable=True)   # ID de cliente Stripe
    stripe_subscription_id = db.Column(db.String(120), nullable=True)  # ID de suscripción Stripe
    mascotas = db.relationship('Mascotas', secondary='users_mascotas', back_populates='usuarios', lazy='subquery') # Relacion 1 --> n
    mascotas_registradas = db.relationship('Mascotas', back_populates='user_register', lazy='select') # Relacion n --> n

    def serialize(self):
        return {'id': self.id,
                'username': self.username,
                'password': self.password,
                'name': self.name,
                'last_name': self.last_name,
                'email': self.email,
                'country': self.country,
                'address': self.address,
                'phone': self.phone,
                'is_veterinario': self.is_veterinario,
                'subscription_code': self.subscription_code,
                'subscription_active': self.subscription_active,
                'stripe_customer_id': self.stripe_customer_id,
                'stripe_subscription_id': self.stripe_subscription_id,
                'mascotas': [m.serialize_basic() for m in self.mascotas],
                'mascotas_registradas': [m.serialize_basic() for m in self.mascotas_registradas]}


class Veterinarios(db.Model):
    __tablename__ = 'veterinarios'
    id = db.Column(db.Integer, primary_key=True)
    num_colegiado = db.Column(db.String(), unique=True, nullable=True, default=" ")
    name_clinica = db.Column(db.String(), unique=False, nullable=True, default=" ")
    email_clinica = db.Column(db.String(), unique=True, nullable=True, default=" ")
    address_clinica = db.Column(db.String(), unique=False, nullable=True, default=" ")
    phone_clinica = db.Column(db.String(), unique=False, nullable=True, default=" ")
    name_doctor = db.Column(db.String(), unique=False, nullable=True, default=" ")
    last_name_doctor = db.Column(db.String(), unique=False, nullable=True, default=" ")
    email_doctor = db.Column(db.String(), unique=True, nullable=True, default=" ")
    phone_doctor = db.Column(db.String(), unique=False, nullable=True, default=" ")
    incidencias_id = db.Column(db.Integer, db.ForeignKey('incidencias.id'))
    incidencias_to = db.relationship('Incidencias', foreign_keys=[incidencias_id], backref=db.backref('incidencias_to'), lazy='select')
    
    def serialize(self):
        return {'id': self.id,
                'num_colegiado': self.num_colegiado,
                'name_clinica': self.name_clinica,
                'email_clinica': self.email_clinica,
                'address_clinica': self.address_clinica,
                'phone_clinica': self.phone_clinica,
                'name_doctor': self.name_doctor,
                'last_name_doctor': self.last_name_doctor,
                'email_doctor': self.email_doctor,
                'phone_doctor': self.phone_doctor}


class Mascotas(db.Model):
    __tablename__ = 'mascotas'
    id = db.Column(db.Integer, primary_key=True)
    mascota_name_id = db.Column(db.String(), unique=True, nullable=False, default=" ") # Username de la Mascota unico
    password = db.Column(db.String(), unique=False, nullable=False, default=" ")
    raza = db.Column(db.String(), unique=False, nullable=False, default=" ")
    is_mix = db.Column(db.Boolean(), nullable=False, default=False)
    birth_date = db.Column(db.Date(), unique=False, nullable=True)
    gender = db.Column(db.String(), unique=False, nullable=False, default=" ")
    is_Esterilizado = db.Column(db.Boolean(), nullable=False, default=False)
    foto_mascot = db.Column(db.String(), unique=False, nullable=True, default=" ")
    name_mascot = db.Column(db.String(), unique=False, nullable=False, default=" ")
    patologia = db.Column(db.String(), unique=False, nullable=True, default=" ")
    tamano = db.Column(db.String(), unique=False, nullable=True, default=" ")
    json_mascota = db.Column(db.JSON(), unique=False, nullable=True)
    status = db.Column(db.Enum('active', 'nonactive', name='status'), nullable=False, default="active")
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_register = db.relationship('Users', back_populates='mascotas_registradas', lazy='select')
    usuarios = db.relationship('Users', secondary='users_mascotas', back_populates='mascotas', lazy='subquery')
   
    def serialize(self):
        return {'id': self.id,
                'mascota_name_id': self.mascota_name_id,
                'password': self.password,
                'raza': self.raza,
                'is_mix': self.is_mix,
                'birth_date': self.birth_date,
                'gender': self.gender,
                'is_Esterilizado': self.is_Esterilizado,
                'foto_mascot': self.foto_mascot,
                'name_mascot': self.name_mascot,
                'patologia': self.patologia,
                'tamano': self.tamano,
                'json_mascota': self.json_mascota,
                'status': self.status,
                'user_id': self.user_id,
                'usuarios': [u.id for u in self.usuarios]}
    
    def serialize_basic(self):
        return {
            'id': self.id,
            'name_mascot': self.name_mascot,
            'mascota_name_id': self.mascota_name_id
        }
    

class Users_Mascotas(db.Model):
    __tablename__ = 'users_mascotas'
    id = db.Column(db.Integer, primary_key=True)
    usuario_mascota_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    usuario_mascota_to = db.relationship('Users', foreign_keys=[usuario_mascota_id], backref=db.backref('usuario_mascota_to'), lazy='select')
    mascota_usuario_id = db.Column(db.Integer, db.ForeignKey('mascotas.id'))
    mascota_usuario_to = db.relationship('Mascotas', foreign_keys=[mascota_usuario_id], backref=db.backref('mascota_usuario_to'), lazy='select')

    def serialize(self):
        return {'id': self.id,
                'usuario_mascota_id': self.usuario_mascota_id,
                'mascota_usuario_id': self.mascota_usuario_id} 


class Incidencias(db.Model):
    __tablename__ = 'incidencias'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(), unique=False, nullable=False, default=" ")
    description = db.Column(db.Text(), unique=False, nullable=False, default=" ")
    initial_date = db.Column(db.DateTime(), unique=False, nullable=False)
    final_date = db.Column(db.DateTime(), unique=False, nullable=False)
    ia_description = db.Column(db.Text(), unique=False, nullable=False, default=" ")
    ia_action = db.Column(db.Text(), unique=False, nullable=False, default=" ")
    alert_status = db.Column(db.String(), unique=False, nullable=False, default=" ")
    foto_incidencia = db.Column(db.String(), unique=False, nullable=True, default=" ")
    ts_alta = db.Column(db.DateTime(), unique=False, nullable=False, default=datetime.utcnow)
    mascota_incidencia_id = db.Column(db.Integer, db.ForeignKey('mascotas.id'))
    mascota_incidencia_to = db.relationship('Mascotas', foreign_keys=[mascota_incidencia_id], backref=db.backref('mascota_incidencia_to'), lazy='select')
    
    def serialize(self):
        return {'id': self.id,
                'title': self.title,
                'description': self.description,
                'initial_date': self.initial_date,
                'final_date': self.final_date,
                'ia_description': self.ia_description,
                'ia_action': self.ia_action,
                'alert_status': self.alert_status,
                'foto_incidencia': self.foto_incidencia,
                'ts_alta': self.ts_alta,
                'mascota_incidencia_id':self.mascota_incidencia_id}
    

class Reportes(db.Model):
    __tablename__ = 'reportes'
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer(), unique=False, nullable=True, default=0)
    food_ia = db.Column(db.Text(), unique=False, nullable=False, default=" ")
    description_ia = db.Column(db.Text(), unique=False, nullable=False, default=" ")
    action_ia = db.Column(db.Text(), unique=False, nullable=False, default=" ")
    future_ia = db.Column(db.Text(), unique=False, nullable=False, default=" ")
    analysis_ia = db.Column(db.Text(), unique=False, nullable=False, default=" ")
    status_read = db.Column(db.Enum('leido', 'noleido', name='status_read'), nullable=False, default='noleido')
    ts_alta = db.Column(db.DateTime(), unique=False, nullable=True, default=datetime.utcnow)
    mascota_reports_id = db.Column(db.Integer, db.ForeignKey('mascotas.id'))
    mascota_reports_to = db.relationship('Mascotas', foreign_keys=[mascota_reports_id], backref=db.backref('mascota_reports_to'), lazy='select')
    
    def serialize(self):
        return {'id': self.id,
                'score': self.score,
                'food_ia': self.food_ia,
                'description_ia': self.description_ia,
                'action_ia': self.action_ia,
                'analysis_ia': self.analysis_ia,
                'status_read': self.status_read,
                'ts_alta': self.ts_alta,
                'mascota_reports_id':self.mascota_reports_id}
        

class Metrica(db.Model):
    __tablename__ = 'metrica'
    id = db.Column(db.Integer, primary_key=True)
    valor_diario = db.Column(db.String(), unique=False, nullable=True, default="")
    valor_mensual = db.Column(db.String(), unique=False, nullable=True, default="")
    note = db.Column(db.Text(), unique=False, nullable=True, default="")
    ts_init = db.Column(db.DateTime(), unique=False, nullable=True, default=datetime.utcnow)
    sensor_id = db.Column(db.Integer, db.ForeignKey('sensor.id'))
    sensor_to = db.relationship('Sensor', foreign_keys=[sensor_id], backref=db.backref('sensor_to'), lazy='select')
    mascota_metrica_id = db.Column(db.Integer, db.ForeignKey('mascotas.id'))
    mascota_metrica_to = db.relationship('Mascotas', foreign_keys=[mascota_metrica_id], backref=db.backref('mascota_metrica_to'), lazy='select')
    tipo_metrica_id = db.Column(db.String, db.ForeignKey('tipo_metrica.metrica_name'))
    tipo_metrica_to = db.relationship('TipoMetrica', foreign_keys=[tipo_metrica_id], backref=db.backref('tipo_metrica_to'), lazy='select')
    
    def serialize(self):
        return {
            'id': self.id,
            'valor_diario': self.valor_diario,
            'valor_mensual': self.valor_mensual,
            'note': self.note,
            'ts_init': self.ts_init,
            'mascota_metrica_id': self.mascota_metrica_id,
            'tipo_metrica_id': self.tipo_metrica_id}
    

class TipoMetrica(db.Model):
    __tablename__ = 'tipo_metrica'
    id = db.Column(db.Integer, primary_key=True)
    metrica_name = db.Column(db.String(), unique=True, nullable=False, default="")

    def serialize(self):
        return {
            'id': self.id,
            'metrica_name': self.metrica_name}
    

class MetricaJSON(db.Model):
    __tablename__ = 'metrica_json'
    id = db.Column(db.Integer, primary_key=True)
    json_actividad = db.Column(db.JSON(), unique=False, nullable=True)
    json_peso = db.Column(db.JSON(), unique=False, nullable=True)
    json_pulso = db.Column(db.JSON(), unique=False, nullable=True)
    json_temperatura = db.Column(db.JSON(), unique=False, nullable=True)
    json_clasificacion = db.Column(db.JSON(), unique=False, nullable=True)

    def serialize(self):
        return {
            'id': self.id,
            'json_actividad': self.json_actividad,
            'json_peso': self.json_peso,
            'json_pulso': self.json_pulso,
            'json_temperatura': self.json_temperatura,
            'json_clasificacion': self.json_clasificacion}


class Analysis(db.Model):
    __tablename__ = 'analysis'
    id = db.Column(db.Integer, primary_key=True)
    blood = db.Column(db.String(), unique=False, nullable=True, default="")
    bilirubin = db.Column(db.String(), unique=False, nullable=True, default="")
    urobiling = db.Column(db.String(), unique=False, nullable=True, default="")
    ketones = db.Column(db.String(), unique=False, nullable=True, default="")
    glucose = db.Column(db.String(), unique=False, nullable=True, default="")
    protein = db.Column(db.String(), unique=False, nullable=True, default="")
    nitrite = db.Column(db.String(), unique=False, nullable=True, default="")
    leukocytes = db.Column(db.String(), unique=False, nullable=True, default="")
    ph = db.Column(db.String(), unique=False, nullable=True, default="")
    foto_analysis = db.Column(db.String(), unique=False, nullable=True, default=" ")
    ia_analysis = db.Column(db.Text(), unique=False, nullable=False, default=" ")
    ts_init = db.Column(db.DateTime(), unique=False, nullable=True, default=datetime.utcnow)
    mascota_analysis_id = db.Column(db.Integer, db.ForeignKey('mascotas.id'))
    mascota_analysis_to = db.relationship('Mascotas', foreign_keys=[mascota_analysis_id], backref=db.backref('mascota_analysis_to'), lazy='select')

    def serialize(self):
        return {
            'id': self.id,
            'blood': self.blood,
            'bilirubin': self.bilirubin,
            'urobiling': self.urobiling,
            'ketones': self.ketones,
            'glucose': self.glucose,
            'protein': self.protein,
            'nitrite': self.nitrite,
            'leukocytes': self.leukocytes,
            'ph': self.ph,
            'foto_analysis': self.foto_analysis,
            'ia_analysis': self.ia_analysis,
            'ts_init': self.ts_init,
            'mascota_analysis_id':self.mascota_analysis_id}


class Comida(db.Model):
    __tablename__ = 'comida'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(), unique=False, nullable=False, default="")
    type_food = db.Column(db.Enum('suave', 'dura', name='type_food'), nullable=False)
    marca = db.Column(db.String(), unique=False, nullable=False, default="")
    grasa = db.Column(db.String(), unique=False, nullable=False, default="")
    proteina = db.Column(db.String(), unique=False, nullable=False, default="")
    fibra = db.Column(db.String(), unique=False, nullable=False, default="")
    ia_food = db.Column(db.Text(), unique=False, nullable=True, default=" ")
    quantity = db.Column(db.String(), unique=False, nullable=False, default=" ")
    food_time = db.Column(db.Time, unique=False, nullable=True)
    foto_food = db.Column(db.String(), unique=False, nullable=True, default=" ")
    ts_init = db.Column(db.DateTime(), unique=False, nullable=True, default=datetime.utcnow)
    mascota_comida_id = db.Column(db.Integer, db.ForeignKey('mascotas.id'))
    mascota_comida_to = db.relationship('Mascotas', foreign_keys=[mascota_comida_id], backref=db.backref('mascota_comida_to'), lazy='select')

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'type_food': self.type_food,
            'marca': self.marca,
            'grasa': self.grasa,
            'proteina': self.proteina,
            'fibra': self.fibra,
            'ia_food': self.ia_food,
            'foto_food': self.foto_food,
            'quantity': self.quantity,
            'food_time': self.food_time.strftime("%H:%M:%S"),
            'ts_init': self.ts_init}
    

class Alerts(db.Model):
    __tablename__ = 'alerts'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(), unique=False, nullable=True, default="")
    danger_value = db.Column(db.Integer, unique=False, nullable=True, default="")
    source = db.Column(db.String(), unique=False, nullable=True, default="")
    description = db.Column(db.String(), unique=False, nullable=True, default="")
    traffic_light = db.Column(db.Enum('rojo', 'amarillo', 'verde', name='traffic_light'), nullable=False)
    status_read = db.Column(db.Enum('leido', 'noleido', name='status_read'), nullable=False, default='noleido')
    post_time = db.Column(db.DateTime(), unique=False, nullable=True, default=datetime.utcnow)
    mascota_alerts_id = db.Column(db.Integer, db.ForeignKey('mascotas.id'))
    mascota_alerts_to = db.relationship('Mascotas', foreign_keys=[mascota_alerts_id], backref=db.backref('mascota_alerts_to'), lazy='select')

    def serialize(self):
        return {
            'id': self.id,
            'type': self.type,
            'danger_value': self.danger_value,
            'source': self.source,
            'description': self.description,
            'traffic_light': self.traffic_light,
            'status_read': self.status_read,
            'post_time': self.post_time,
            'mascota_alerts_id': self.mascota_alerts_id}
        

class Sensor(db.Model):
    __tablename__ = 'sensor'
    id = db.Column(db.Integer, primary_key=True)
    json_acelerometro = db.Column(db.String(), unique=False, nullable=True, default="")
    json_giroscopio = db.Column(db.String(), unique=False, nullable=True, default="")
    json_heart_rate = db.Column(db.String(), unique=False, nullable=True, default="")

    def serialize(self):
        return {
            'id': self.id,
            'json_acelerometro': self.json_acelerometro,
            'json_giroscopio': self.json_giroscopio,
            'json_heart_rate': self.json_heart_rate}
    