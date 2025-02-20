import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import db, Usuarios, Comprador, Vendedor, Order_Item, Orders


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'darkly'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Usuarios, db.session))  # You can duplicate that line to add mew models
    admin.add_view(ModelView(Comprador, db.session)) 
    admin.add_view(ModelView(Vendedor, db.session)) 
    admin.add_view(ModelView(Order_Item, db.session)) 
    admin.add_view(ModelView(Orders, db.session)) 