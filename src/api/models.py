from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {'id': self.id,
                'email': self.email,
                'is_active': self.is_active}

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




