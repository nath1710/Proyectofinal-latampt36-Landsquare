from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ARRAY
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    photo_profile = db.Column(db.String(
        500), default="https://i.pinimg.com/736x/01/ab/d7/01abd79ebcabded1f6636e05727c3e26.jpg")
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    name = db.Column(db.String(250), nullable=False)
    country = db.Column(db.String(250), nullable=False)
    phone_number = db.Column(db.String(30), nullable=True, default="")
    address = db.Column(db.String(250), nullable=False)
    is_active = db.Column(db.Boolean(), default=True, nullable=False)
    role = db.Column(db.String(50), default="User")

    announcements = db.relationship('Announcement', back_populates='user')
    favorite = db.relationship('Favorite', back_populates='user')

    def __init__(self, email, password, name, country, address, phone_number="", photo_profile=None):
        self.email = email
        self.password = password
        self.name = name
        self.country = country
        self.address = address
        self.phone_number = phone_number
        self.photo_profile = photo_profile or self.photo_profile
        self.role

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'country': self.country,
            'address': self.address,
            'photo_profile': self.photo_profile,
            'phone_number': self.phone_number,
            'announcements': [announcement.serialize() for announcement in self.announcements],
            'role': self.role
        }


class Announcement(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    images = db.Column(ARRAY(db.String(500)))
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(1000))
    price = db.Column(db.Integer)
    location = db.Column(db.String(250))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    size = db.Column(db.Integer)
    creation_date = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    user = db.relationship('User', back_populates='announcements')
    favorite = db.relationship('Favorite', back_populates='announcement')

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'images': self.images,
            'description': self.description,
            'price': str(self.price),
            'location': self.location,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'size': self.size,
            'creation_date': self.creation_date.isoformat(),
            'images': self.images,
            'user': {
                'id': self.user.id,
                'name': self.user.name,
                'email': self.user.email,
                'country': self.user.country,
                'photo_profile': self.user.photo_profile,
                'phone_number': self.user.phone_number
            }
        }


class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    announcement_id = db.Column(db.Integer, db.ForeignKey(
        'announcement.id'), nullable=False)
    creation_date = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = db.relationship('User', back_populates='favorite')
    announcement = db.relationship('Announcement', back_populates='favorite')

    def __init__(self, user_id, announcement_id):
        self.user_id = user_id  # Creo que esto no es necesario porque viene en el token
        self.announcement_id = announcement_id

    def __repr__(self):
        return '<Favorite %r>' % self.id

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'announcement_id': self.announcement_id,
            'creation_date': self.creation_date.isoformat(),
            'announcement': self.announcement.serialize()
        }
