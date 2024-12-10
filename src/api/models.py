from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(250), unique=False, nullable=False)
    name = db.Column(db.String(250), unique=False, nullable=False)
    country = db.Column(db.String(250), unique=False, nullable=False)
    address = db.Column(db.String(250), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'
    
    def __init__(self, email, password, name, country, address):
        self.email = email
        self.password = password
        self.name = name
        self.country = country
        self.address = address
        self.is_active = True

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'password': self.password, # do not serialize the password, its a security breach
            'name':  self.name,
            'country': self.country,
            'address': self.address
        }