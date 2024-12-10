"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from email_validator import validate_email, EmailNotValidError

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/user', methods=['POST'])
def create_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    country = data.get('country')
    address = data.get('address')

    try:
        validate_email(email)
    except EmailNotValidError as e:
        return jsonify({"message": "Invalid email format", "error": str(e)}), 400
    
    if '' in [email, password, name, country]:
        return jsonify({
            'message: ': 'Sin vacíos!!!'
        }), 400

    if None in [email, password, name, country]:
        return jsonify({
            'message: ': 'Email and Password required'
        }), 400
    email_exist = db.session.execute(db.select(User).filter_by(email=email)).one_or_none()
    if email_exist:
        return jsonify({
            'message: ': 'Unable to create user... try again'
        }), 400
    password_hash = generate_password_hash(password)    
    new_user = User(email, password_hash, name, country, address)
    print(new_user.serialize())    
    print(f"User created with ID: {new_user.id}")
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as error:
        db.session.rollback()  # Rollback the session in case of error
        print(f"Error creating user: {error}")  # Log the specific error
        return jsonify({
            'message': f'Database error: {str(error)}'
        }), 500

    return jsonify({
            'user: ': new_user.serialize()
        }), 200