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
    veterinario_id = db.Column(db.Integer, db.ForeignKey('veterinarios.id'))
    veterinario_to = db.relationship('Veterinarios', foreign_keys=[veterinario_id], backref=db.backref('veterinarios_to'), lazy='select')

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
                'is_veterinario': self.is_veterinario}


class Veterinarios(db.Model):
    __tablename__ = 'veterinarios'
    id = db.Column(db.Integer, primary_key=True)
    name_clinica = db.Column(db.String(), unique=False, nullable=True, default=" ")
    email_clinica = db.Column(db.String(), unique=True, nullable=True, default=" ")
    address_clinica = db.Column(db.String(), unique=False, nullable=True, default=" ")
    phone_clinica = db.Column(db.String(), unique=False, nullable=True, default=" ")
    name_doctor = db.Column(db.String(), unique=False, nullable=True, default=" ")
    last_name_doctor = db.Column(db.String(), unique=False, nullable=True, default=" ")
    email_doctor = db.Column(db.String(), unique=True, nullable=True, default=" ")
    address_doctor = db.Column(db.String(), unique=False, nullable=True, default=" ")
    phone_doctor = db.Column(db.String(), unique=False, nullable=True, default=" ")
    incidencias_id = db.Column(db.Integer, db.ForeignKey('incidencias.id'))
    incidencias_to = db.relationship('Incidencias', foreign_keys=[incidencias_id], backref=db.backref('incidencias_to'), lazy='select')
    
    def serialize(self):
        return {'id': self.id,
                'name_clinica': self.name_clinica,
                'email_clinica': self.email_clinica,
                'address_clinica': self.address_clinica,
                'phone_clinica': self.phone_clinica,
                'name_doctor': self.name_doctor,
                'last_name_doctor': self.last_name_doctor,
                'email_doctor': self.email_doctor,
                'address_doctor': self.address_doctor,
                'phone_doctor': self.phone_doctor}


class Incidencias(db.Model):
    __tablename__ = 'incidencias'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(), unique=False, nullable=False, default=" ")
    description = db.Column(db.Text(), unique=False, nullable=False, default=" ")
    initial_date = db.Column(db.DateTime(), unique=False, nullable=False)
    final_date = db.Column(db.DateTime(), unique=False, nullable=False)
    ia_description = db.Column(db.Text(), unique=False, nullable=False, default=" ")
    alert_status = db.Column(db.Enum('en proceso', 'pendiente', 'completado', 'cancelado', name='alert_status'), nullable=False)
    
    def serialize(self):
        return {'id': self.id,
                'title': self.title,
                'description': self.description,
                'initial_date': self.initial_date,
                'final_date': self.final_date,
                'ia_description': self.ia_description,
                'alert_status': self.alert_status}
    

class Mascotas(db.Model):
    __tablename__ = 'mascotas'
    id = db.Column(db.Integer, primary_key=True)
    raza = db.Column(db.String(), unique=False, nullable=False, default=" ")
    is_mix = db.Column(db.Boolean(), nullable=False, default=False)
    birth_date = db.Column(db.DateTime(), unique=False, nullable=True)
    gender = db.Column(db.String(), unique=False, nullable=False, default=" ")
    is_Esterilizado = db.Column(db.Boolean(), nullable=False, default=False)
    foto_mascot = db.Column(db.String(), unique=False, nullable=False, default=" ")
    name_mascot = db.Column(db.String(), unique=False, nullable=False, default=" ")
    patologia = db.Column(db.String(), unique=False, nullable=False, default=" ")
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('user_to'), lazy='select')

    
    def serialize(self):
        return {'id': self.id,
                'raza': self.raza,
                'is_mix': self.is_mix,
                'birth_date': self.birth_date,
                'gender': self.gender,
                'is_Esterilizado': self.is_Esterilizado,
                'foto_mascot': self.foto_mascot,
                'name_mascot': self.name_mascot,
                'patologia': self.patologia}
        

class Metrica(db.Model):
    __tablename__ = 'metrica'
    id = db.Column(db.Integer, primary_key=True)
    valor_diario = db.Column(db.String(), unique=False, nullable=True, default="")
    valor_mensual = db.Column(db.String(), unique=False, nullable=True, default="")
    sensor_id = db.Column(db.Integer, db.ForeignKey('sensor.id'))
    sensor_to = db.relationship('Sensor', foreign_keys=[sensor_id], backref=db.backref('sensor_to'), lazy='select')
    details_id = db.Column(db.Integer, db.ForeignKey('incidencias.id'))
    details_to = db.relationship('Incidencias', foreign_keys=[details_id], backref=db.backref('details_to'), lazy='select')
    mascotas_id = db.Column(db.Integer, db.ForeignKey('mascotas.id'))
    mascotas_to = db.relationship('Mascotas', foreign_keys=[mascotas_id], backref=db.backref('mascotas_to'), lazy='select')
    tipo_metrica_id = db.Column(db.Integer, db.ForeignKey('tipo_metrica.id'))
    tipo_metrica_to = db.relationship('TipoMetrica', foreign_keys=[tipo_metrica_id], backref=db.backref('tipo_metrica_to'), lazy='select')
    metrica_asin_id = db.Column(db.Integer, db.ForeignKey('metricas_asincronas.id'))
    metrica_asin_to = db.relationship('MetricasAsincronas', foreign_keys=[metrica_asin_id], backref=db.backref('metrica_asin_to'), lazy='select')
    comida_id = db.Column(db.Integer, db.ForeignKey('comida.id'))
    comida_to = db.relationship('Comida', foreign_keys=[comida_id], backref=db.backref('comida_to'), lazy='select')
    
    def serialize(self):
        return {
            'id': self.id,
            'valor_diario': self.valor_diario,
            'valor_mensual': self.valor_mensual,
            'details_id': self.details_id,
            'mascotas_id': self.mascotas_id,
            'tipo_metrica_id': self.tipo_metrica_id,
            'metrica_asin_id': self.metrica_asin_id,
            'comida_id': self.comida_id}


class DetailsMetrica(db.Model):
    __tablename__ = 'details_metrica'
    id = db.Column(db.Integer, primary_key=True)
    ts_metrica = db.Column(db.DateTime(), unique=False, nullable=True)
    valor_metrica = db.Column(db.String(), unique=False, nullable=True, default="")
    mascota_id = db.Column(db.Integer, db.ForeignKey('mascotas.id'))
    mascota_to = db.relationship('Mascotas', foreign_keys=[mascota_id], backref=db.backref('mascota_to'), lazy='select')
    tipo_metricas_id = db.Column(db.Integer, db.ForeignKey('tipo_metrica.id'))
    tipo_metricas_to = db.relationship('TipoMetrica', foreign_keys=[tipo_metricas_id], backref=db.backref('tipo_metricas_to'), lazy='select')
    
    def serialize(self):
        return {
            'id': self.id,
            'ts_metrica': self.ts_metrica,
            'valor': self.valor,
            'mascota_id': self.mascota_id,
            'tipo_metrica_id': self.tipo_metrica_id}
    

class TipoMetrica(db.Model):
    __tablename__ = 'tipo_metrica'
    id = db.Column(db.Integer, primary_key=True)
    metrica_name = db.Column(db.String(), unique=False, nullable=True, default="")
    
    def serialize(self):
        return {
            'id': self.id,
            'metrica_name': self.metrica_name}
    

class MetricasAsincronas(db.Model):
    __tablename__ = 'metricas_asincronas'
    id = db.Column(db.Integer, primary_key=True)
    foto = db.Column(db.String(), unique=False, nullable=True, default="")
    interpretacion_IA = db.Column(db.String(), unique=False, nullable=True, default="")
    ts_metrica_asin = db.Column(db.DateTime(), unique=False, nullable=True)
    
    def serialize(self):
        return {
            'id': self.id,
            'foto': self.foto,
            'interpretacion_IA': self.interpretacion_IA,
            'ts_metrica_asin': self.ts_metrica_asin}


class Comida(db.Model):
    __tablename__ = 'comida'
    id = db.Column(db.Integer, primary_key=True)
    type_food = db.Column(db.Enum('suave', 'dura', name='type_food'), nullable=False)
    marca = db.Column(db.String(), unique=False, nullable=True, default="")
    grasa = db.Column(db.String(), unique=False, nullable=True, default="")
    proteina = db.Column(db.String(), unique=False, nullable=True, default="")
    fibra = db.Column(db.String(), unique=False, nullable=True, default="")
    food_in_a_day = db.Column(db.String(), unique=False, nullable=True, default="")
    
    def serialize(self):
        return {
            'id': self.id,
            'type_food': self.type_food,
            'marca': self.marca,
            'grasa': self.grasa,
            'proteina': self.proteina,
            'fibra': self.fibra,
            'food_in_a_day': self.food_in_a_day}
        

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
    