from flask_sqlalchemy import SQLAlchemy
from datetime import datetime



db = SQLAlchemy()


class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    password = db.Column(db.String(), unique=False, nullable=False)
    name = db.Column(db.String(120), unique=False, nullable=True, default=" ")
    last_name = db.Column(db.String(), unique=False, nullable=True, default=" ")
    email = db.Column(db.String(), unique=True, nullable=True, default=" ")
    country = db.Column(db.String(), unique=False, nullable=True, default=" ")
    address = db.Column(db.String(), unique=False, nullable=True, default=" ")
    phone = db.Column(db.String(), unique=False, nullable=True, default=" ")
    gender = db.Column(db.String(), unique=False, nullable=True, default=" ")
    is_buyer = db.Column(db.Boolean(), nullable=False, default=False)
    is_seller = db.Column(db.Boolean(), nullable=False, default=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('buyers.id'))
    buyer_to = db.relationship('Buyers', foreign_keys=[buyer_id], backref=db.backref('buyers_to'), lazy='select')
    seller_id = db.Column(db.Integer, db.ForeignKey('sellers.id'))
    seller_to = db.relationship('Sellers', foreign_keys=[seller_id], backref=db.backref('sellers_to'), lazy='select')

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
                'gender': self.gender,
                'is_buyer': self.is_buyer,
                'is_seller': self.is_seller}


class Products(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=False, nullable=False, default="")
    post_date = db.Column(db.DateTime(), unique=False, nullable=False, default=datetime.utcnow)
    sending_address = db.Column(db.String(), unique=False, nullable=False, default="")
    size = db.Column(db.String(), unique=False, nullable=False, default="")
    color = db.Column(db.String(), unique=False, nullable=False, default="")
    weight = db.Column(db.String(), unique=False, nullable=False, default="")
    quantity = db.Column(db.Integer(), unique=False, nullable=False)
    price = db.Column(db.Integer(), unique=False, nullable=False)
    final_price = db.Column(db.Integer(), unique=False, nullable=False)
    description = db.Column(db.String(), unique=False, nullable=False, default="")
    category = db.Column(db.Enum('tipo1', 'tipo2', 'tipo3', name='category'), unique=False, nullable=False)  # ARREGLAR, QUE CATEGORIAS PONER? 
    seller_id = db.Column(db.Integer, db.ForeignKey('sellers.id'))
    seller_to = db.relationship('Sellers', foreign_keys=[seller_id], backref=db.backref('seller_to'), lazy='select')

    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'post_date': self.post_date,
                'sending_address': self.sending_address,
                'size': self.size,
                'color': self.color,
                'weight': self.weight,
                'quantity': self.quantity,
                'price': self.price,
                'final_price': self.final_price, # quitar para primera version 
                'description': self.description,
                'category': self.category}


class Orders(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    total_amount = db.Column(db.Integer(), unique=False, nullable=False)
    order_status = db.Column(db.Enum('en proceso', 'pendiente', 'completado', 'cancelado', name='estado_enum'), nullable=False)    
    buy_date = db.Column(db.DateTime(), unique=False, nullable=False)
    payment_options = db.Column(db.String(80), unique=False, nullable=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('buyers.id'))
    buyer_to = db.relationship('Buyers', foreign_keys=[buyer_id], backref=db.backref('buyer_to'), lazy='select')

    def serialize(self):
        return {'id': self.id,
                'total_Amount': self.total_amount,
                'order_status': self.order_status,
                'buy_date': self.buy_date,
                'payment_options': self.payment_options}
    

class OrderItems(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    total_amount = db.Column(db.Integer(), unique=False, nullable=False)
    quantity = db.Column(db.Integer(), unique=False, nullable=False)
    arrival_date = db.Column(db.DateTime(), unique=False, nullable=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    order_to = db.relationship('Orders', foreign_keys=[order_id], backref=db.backref('order_to'), lazy='select')
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    product_to = db.relationship('Products', foreign_keys=[product_id], backref=db.backref('product_to'), lazy='select')

    def serialize(self):
        return {'id': self.id,
                'total_amount': self.total_amount,
                'quantity': self.quantity,
                'stock': self.stock,
                'arrival_date': self.arrival_date}


class Buyers(db.Model):
    __tablename__ = 'buyers'
    id = db.Column(db.Integer, primary_key=True)
    sending_address_buyer = db.Column(db.String(), unique=False, nullable=False)
    purchase_history = db.Column(db.String(), unique=False, nullable=False)

    def serialize(self):
        return {
                'id': self.id,
                'sending_address_buyer': self.sending_address_buyer,
                'purchase_history': self.purchase_history}


class Sellers(db.Model):
    __tablename__ = 'sellers'
    id = db.Column(db.Integer, primary_key=True)
    reputation= db.Column(db.String(), unique=False, nullable=False)
    sell_history = db.Column(db.String(), unique=False, nullable=False)
    product_for_sell = db.Column(db.String(), unique=False, nullable=False)
    publish_product = db.Column(db.String(), unique=False, nullable=False)
    total_income = db.Column(db.Integer(), unique=False, nullable=False)

    def serialize(self):
        return {'id': self.id,
                'reputation': self.reputation,
                'sell_history': self.sell_history,
                'product_for_sell': self.product_for_sell,
                'publish_product': self.publish_product,
                'total_income': self.total_income}
    


