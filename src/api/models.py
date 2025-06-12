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
    mascotas_id = db.Column(db.Integer, db.ForeignKey('mascotas.id'))
    mascotas_to = db.relationship('Mascotas', foreign_keys=[mascotas_id], backref=db.backref('mascotas_to'), lazy='select')

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
    last_name_clinica = db.Column(db.String(), unique=False, nullable=True, default=" ")
    email_clinica = db.Column(db.String(), unique=True, nullable=True, default=" ")
    address_clinica = db.Column(db.String(), unique=False, nullable=True, default=" ")
    phone_clinica = db.Column(db.String(), unique=False, nullable=True, default=" ")
    name_doctor = db.Column(db.String(), unique=False, nullable=True, default=" ")
    last_name_doctor = db.Column(db.String(), unique=False, nullable=True, default=" ")
    email_doctor = db.Column(db.String(), unique=True, nullable=True, default=" ")
    address_doctor = db.Column(db.String(), unique=False, nullable=True, default=" ")
    phone_doctor = db.Column(db.String(), unique=False, nullable=True, default=" ")
    incidencia_id = db.Column(db.Integer, db.ForeignKey('incidencias.id'))
    incidencia_to = db.relationship('Incidencias', foreign_keys=[incidencia_id], backref=db.backref('incidencia_to'), lazy='select')
    
    def serialize(self):
        return {'id': self.id,
                'name_clinica': self.name_clinica,
                'last_name_clinica': self.last_name_clinica,
                'email_clinica': self.email_clinica,
                'address_clinica': self.address_clinica,
                'phone_clinica': self.phone_clinica,
                'name_doctor': self.name_doctor,
                'last_name_doctor': self.last_name_doctor,
                'email_doctor': self.email_doctor,
                'address_doctor': self.address_doctor,
                'phone_doctor': self.phone_doctor,
                'incidencia_id': self.incidencia_id}


class Incidencias(db.Model):
    __tablename__ = 'incidencias'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(), unique=False, nullable=False, default=" ")
    description = db.Column(db.Text(), unique=False, nullable=False, default=" ")
    initial_date = db.Column(db.DateTime(), unique=False, nullable=False)
    final_date = db.Column(db.DateTime(), unique=False, nullable=False)
    ia_description = db.Column(db.Text(), unique=False, nullable=False, default=" ")
    details_id = db.Column(db.Integer, db.ForeignKey('mascota_details.details_id'))
    details_to = db.relationship('MascotaDetails', foreign_keys=[details_id], backref=db.backref('details_to'), lazy='select')
    
    def serialize(self):
        return {'id': self.id,
                'title': self.title,
                'description': self.description,
                'initial_date': self.initial_date,
                'final_date': self.final_date,
                'ia_description': self.ia_description}
    

class Mascotas(db.Model):
    __tablename__ = 'mascotas'
    id = db.Column(db.Integer, primary_key=True)
    raza = db.Column(db.String(), unique=False, nullable=False, default=" ")
    mix_raza = db.Column(db.String(), unique=False, nullable=False, default=" ")
    is_mix = db.Column(db.Boolean(), nullable=False, default=False)
    age = db.Column(db.Integer(), unique=False, nullable=False)
    birth_date = db.Column(db.DateTime(), unique=False, nullable=True)
    details_id = db.Column(db.Integer, db.ForeignKey('mascota_details.id'))
    details_to = db.relationship('MascotaDetails', foreign_keys=[details_id], backref=db.backref('details_to'), lazy='select')

    
    def serialize(self):
        return {'id': self.id,
                'raza': self.raza,
                'mix_raza': self.mix_raza,
                'is_mix': self.is_mix,
                'age': self.age,
                'birth_date': self.birth_date}
        

class MascotaDetails(db.Model):
    __tablename__ = 'mascota_details'
    id = db.Column(db.Integer, primary_key=True)
    size = db.Column(db.String(), unique=False, nullable=True, default="")
    weight = db.Column(db.String(), unique=False, nullable=True, default="")
    patologia = db.Column(db.String(), unique=False, nullable=True, default="")
    water = db.Column(db.String(), unique=False, nullable=True, default="")
    food = db.Column(db.String(), unique=False, nullable=True, default="")
    food_in_a_day = db.Column(db.String(), unique=False, nullable=True, default="")
    imagen = db.Column(db.String(), unique=False, nullable=True)
    medic_inform = db.Column(db.String(), unique=False, nullable=True)
    outside_weather = db.Column(db.String(), unique=False, nullable=True, default="")
    inside_weather = db.Column(db.String(), unique=False, nullable=True, default="")
    alert_status = db.Column(db.Enum('en proceso', 'pendiente', 'completado', 'cancelado', name='estado_enum'), nullable=False)    
    is_esterilizado = db.Column(db.Boolean(), nullable=False, default=False)
    sensor_id = db.Column(db.Integer, db.ForeignKey('sensor.id'))
    sensor_to = db.relationship('Sensor', foreign_keys=[sensor_id], backref=db.backref('sensor_to'), lazy='select')
    details_id = db.Column(db.Integer, db.ForeignKey('mascota_details.details_id'))
    details_to = db.relationship('MascotaDetails', foreign_keys=[details_id], backref=db.backref('details_to'), lazy='select')
    
    def serialize(self):
        return {
            'id': self.id,
            'size': self.size,
            'weight': self.weight,
            'patologia': self.patologia,
            'water': self.water,
            'food': self.food,
            'food_in_a_day': self.food_in_a_day,
            'imagen': self.imagen,
            'medic_inform': self.medic_inform,
            'outside_weather': self.outside_weather,
            'inside_weather': self.inside_weather,
            'alert_status': self.alert_status,
            'is_esterilizado': self.is_esterilizado}
        

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
    