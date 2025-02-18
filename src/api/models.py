from flask_sqlalchemy import SQLAlchemy
from datetime import datetime



db = SQLAlchemy()


class Usuario(db.Model):
    __tablename__ = 'usuario'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=False, nullable=False)
    last_name = db.Column(db.String(), unique=False, nullable=False)
    country = db.Column(db.String(), unique=False, nullable=False)
    address = db.Column(db.String(), unique=False, nullable=False)
    phone = db.Column(db.String(), unique=False, nullable=False)
    gender = db.Column(db.String(), unique=False, nullable=False)
    is_rol = db.Column(db.Boolean(), unique=False, nullable=False)
    comprador_id = db.Column(db.Integer, db.ForeignKey('comprador.id'))
    comprador_to = db.relationship('Comprador', foreign_keys=(comprador_id), backref=db.backref('comprador_to'), lazy='select')
    vendedor_id = db.Column(db.Integer, db.ForeignKey('vendedor.id'))
    vendedor_to = db.relationship('Vendedor', foreign_keys=(vendedor_id), backref=db.backref('vendedor_to'), lazy='select')

    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'last_name': self.last_name,
                'country': self.country,
                'address': self.address,
                'phone': self.phone,
                'gender': self.gender,
                'is_rol': self.is_rol}

class Producto(db.Model):
    __tablename__ = 'producto'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=False, nullable=False)
    fecha_publicacion = db.Column(db.DateTime(), unique=False, nullable=False, default=datetime.utcnow)
    direccion_envio = db.Column(db.String(), unique=False, nullable=False)
    size = db.Column(db.String(), unique=False, nullable=False)
    color = db.Column(db.String(), unique=False, nullable=False)
    peso = db.Column(db.String(), unique=False, nullable=False)
    quantity = db.Column(db.Integer(), unique=False, nullable=False)
    price = db.Column(db.Integer(), unique=False, nullable=False)
    final_price = db.Column(db.Integer(), unique=False, nullable=False)
    description = db.Column(db.String(), unique=False, nullable=False)
    category = db.Column(db.Enum(), unique=False, nullable=False)
    vendedor_id = db.Column(db.Integer, db.ForeignKey('vendedor.id'))
    vendedor_to = db.relationship('Vendedor', foreign_keys=(vendedor_id), backref=db.backref('vendedor_to'), lazy='select')

    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'fecha_publicacion': self.fecha_publicacion,
                'direccion_envio': self.direccion_envio,
                'size': self.size,
                'color': self.color,
                'peso': self.peso,
                'quantity': self.quantity,
                'price': self.price,
                'final_price': self.final_price,
                'description': self.description,
                'category': self.category}

class Orders(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    total_Amount = db.Column(db.Integer(120), unique=False, nullable=False)
    estado = db.Column(db.String(80), unique=False, nullable=False) # enum 
    fecha_Compra = db.Column(db.Int(), unique=False, nullable=False)
    payment_Options = db.Column(db.String(80), unique=False, nullable=False)
    comprador_id = db.Column(db.Integer, db.ForeignKey('comprador.id'))
    comprador_to = db.relationship('Comprador', foreign_keys=(comprador_id), backref=db.backref('comprador_to'), lazy='select')

    def serialize(self):
        return {'id': self.id,
                'total_Amount': self.total_Amount,
                'estado': self.estado,
                'fecha_Compra': self.fecha_Compra,
                'payment_Options': self.payment_Options}
    

class Order_Item(db.Model):
    __tablename__ = 'orders_item'
    id = db.Column(db.Integer, primary_key=True)
    total_Amount = db.Column(db.Integer(120), unique=False, nullable=False)
    quantity = db.Column(db.Integer(120), unique=False, nullable=False)
    stock = db.Column(db.String(80), unique=False, nullable=False)
    fecha_Llegada = db.Column(db.Int(), unique=False, nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    order_to = db.relationship('Orders', foreign_keys=(order_id), backref=db.backref('order_to'), lazy='select')
    producto_id = db.Column(db.Integer, db.ForeignKey('producto.id'))
    producto_to = db.relationship('Producto', foreign_keys=(producto_id), backref=db.backref('producto_to'), lazy='select')

    def serialize(self):
        return {'id': self.id,
                'total_Amount': self.total_Amount,
                'quantity': self.quantity,
                'stock': self.stock,
                'paymentfecha_Llegada_Options': self.fecha_Llegada}

class Comprador(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    direccion_envio = db.Column(db.String(), unique=False, nullable=False)
    historial_compras = db.Column(db.String(), unique=False, nullable=False)

    def serialize(self):
        return {'id': self.id,
                'total_Amount': self.total_Amount,
                'quantity': self.quantity,
                'stock': self.stock,
                'paymentfecha_Llegada_Options': self.fecha_Llegada}
   

class Vendedor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    reputation= db.Column(db.String(), unique=False, nullable=False)
    historial_ventas = db.Column(db.String(), unique=False, nullable=False)
    productos_en_venta = db.Column(db.String(), unique=False, nullable=False)
    publicar_producto = db.Column(db.String(), unique=False, nullable=False)
    ingresos_totales = db.Column(db.String(), unique=False, nullable=False)

    def serialize(self):
        return {'id': self.id,
                'username': self.username,
                'reputation': self.reputation,
                'historial_ventas': self.historial_ventas,
                'productos_en_venta': self.productos_en_venta,
                'publicar_producto': self.publicar_producto,
                'ingresos_totales': self.ingresos_totales}
    


