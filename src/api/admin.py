import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import db, Users, Mascotas, Veterinarios, Metrica, TipoMetrica, Comida, Users_Mascotas, Incidencias, Analysis, Sensor


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'darkly'
    admin = Admin(app, name='Admin', template_mode='bootstrap3')
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Users, db.session))  # You can duplicate that line to add mew models
    admin.add_view(ModelView(Mascotas, db.session))
    admin.add_view(ModelView(Veterinarios, db.session)) 
    admin.add_view(ModelView(Metrica, db.session))  
    admin.add_view(ModelView(TipoMetrica, db.session)) 
    admin.add_view(ModelView(Comida, db.session)) 
    admin.add_view(ModelView(Users_Mascotas, db.session))
    admin.add_view(ModelView(Incidencias, db.session))
    admin.add_view(ModelView(Analysis, db.session)) 
    admin.add_view(ModelView(Sensor, db.session)) 