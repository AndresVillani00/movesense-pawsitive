from flask_sqlalchemy import SQLAlchemy


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
    OrderID = db.Column(db.Integer, primary_key=True)
    Total_Amount = db.Column(db.Integer(120), unique=False, nullable=False)
    Estado = db.Column(db.String(80), unique=False, nullable=False) # enum 
    Fecha_Compra = db.Column(db.Int(), unique=False, nullable=False)
    Payment_Options = db.Column(db.String(80), unique=False, nullable=False)
    CompradorID = db.relationship("Comprador", foreign_keys=[comprador_id], backref=db.backref("CompradorID", lazy="select"))
    

class Order_Item(db.Model):
    Order_itemID = db.Column(db.Integer, primary_key=True)
    Total_Amount = db.Column(db.Integer(120), unique=False, nullable=False)
    Quantity = db.Column(db.Integer(120), unique=False, nullable=False)
    Stock = db.Column(db.String(80), unique=False, nullable=False)
    Fecha_Llegada = db.Column(db.Int(), unique=False, nullable=False)
    OrderID = db.relationship("Orders", foreign_keys=[order_id], backref=db.backref("OrderID", lazy="select"))
    ProductoID = db.Column(db.Integer, primary_key=True)

class Comprador(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    direccion_envio = db.Column(db.String(), unique=False, nullable=False)
    historial_compras = db.Column(db.String(), unique=False, nullable=False)
   

class Vendedor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    reputation= db.Column(db.String(), unique=False, nullable=False)
    historial_ventas = db.Column(db.String(), unique=False, nullable=False)
    Productos_En_Venta = db.Column(db.String(), unique=False, nullable=False)
    Publicar_Producto = db.Column(db.String(), unique=False, nullable=False)
    Ingresos_Totales = db.Column(db.String(), unique=False, nullable=False)
    


