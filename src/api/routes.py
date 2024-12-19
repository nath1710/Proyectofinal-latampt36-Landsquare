"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from sqlalchemy.exc import SQLAlchemyError
from api.models import db, User, Announcement
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from email_validator import validate_email, EmailNotValidError
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

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
        return jsonify({'message': 'Invalid email format', 'error': str(e)}), 400

    if '' in [email, password, name, country]:
        return jsonify({
            'message:': 'No value can be empty'
        }), 400

    if None in [email, password, name, country]:
        return jsonify({
            'message:': 'Email and Password required'
        }), 400
    email_exist = db.session.execute(
        db.select(User).filter_by(email=email)).one_or_none()
    if email_exist:
        return jsonify({
            'message:': 'Unable to create user... try again'
        }), 400
    password_hash = generate_password_hash(password)
    new_user = User(email, password_hash, name, country, address)
    print(new_user.serialize())
    print(f"User created with ID: {new_user.id}")
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as error:
        db.session.rollback()  # Rollback en case of error
        print(f"Error creating user: {error}")  # Imprime el error específico
        return jsonify({
            'message': f'Database error: {str(error)}'
        }), 500

    return jsonify({
        'user: ': new_user.serialize()
    }), 200


@api.route('/token', methods=['POST'])
def login():
    # Validación de datos de entrada
    if not request.is_json:
        return jsonify({'message': 'Invalid request. JSON required'}), 400

    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Validación de campos requeridos
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    try:
        # Búsqueda de usuario
        email_exists = db.session.execute(
            db.select(User).filter_by(email=email)).first()

        # Validación de existencia de usuario
        if not email_exists:
            return jsonify({'message': 'Invalid email or password'}), 401

        # Extracción del usuario
        user = email_exists[0]

        # Verificación de contraseña
        if not check_password_hash(user.password, password):
            return jsonify({'message': 'Invalid email or password'}), 401

        # Generación de token
        token = create_access_token(identity=user.email)

        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name
            }
        }), 200
    except SQLAlchemyError as db_error:
        print(f"Database error: {str(db_error)}")
        return jsonify({'message': 'Database error occurred', 'error': str(db_error)}), 500

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred', 'error': str(e)}), 500


@api.route('/lands-post', methods=['POST'])
@jwt_required()
def create_announcement():
    current_user_email = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(
        email=current_user_email)).scalar_one_or_none()
    if not user:
        return jsonify({"error": "User not found"}), 404
    try:
        data = request.json

        required_fields = ['title', 'images',
                           'description', 'price', 'location', 'size']
        missing_fields = [
            field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({"error": f"Required fields are missing: {', '.join(missing_fields)}"}), 400

        title = data.get('title')
        images = data.get('images')
        description = data.get('description')
        price = data.get('price')
        location = data.get('location')
        size = data.get('size')

        if len(images) > 5:
            return jsonify({"error": "The number of images cannot exceed 5"}), 400

        if price is None or not isinstance(price, (int, float)) or price <= 0:
            return jsonify({"error": "Price must be a number greater than 0"}), 400

        if size is None or not isinstance(size, (int, float)) or size <= 0:
            return jsonify({"error": "Size must be a number greater than 0"}), 400

        new_announcement = Announcement(
            user_id=user.id,
            images=images,
            title=title,
            description=description,
            price=price,
            location=location,
            size=size
        )

        db.session.add(new_announcement)
        db.session.commit()

        return jsonify({
            "message": "Anuncio creado exitosamente",
            "announcement": {
                "id": new_announcement.id,
                "images": new_announcement.images,
                "title": new_announcement.title,
                "description": new_announcement.description,
                "price": new_announcement.price,
                "location": new_announcement.location,
                "size": new_announcement.size,
                "creation_date": new_announcement.creation_date.isoformat()
            }
        }), 201
    except SQLAlchemyError as db_error:
        db.session.rollback()
        print(f"Database error: {str(db_error)}")
        return jsonify({'message': 'Database error occurred', 'error': str(db_error)}), 500

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred', 'error': str(e)}), 500


@api.route('/settings/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    current_user_email = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    if user.email != current_user_email:
        return jsonify({"message": "You are not authorized to update this user's information"}), 403

    data = request.json

    try:
        phone_number = data.get('phone_number', user.phone_number)
        if phone_number and not phone_number.isdigit():
            raise ValueError("The phone number can only contain digits.")

        user.name = data.get('name', user.name)
        user.photo_profile = data.get('photo_profile', user.photo_profile)
        user.country = data.get('country', user.country)
        user.phone_number = phone_number
        user.address = data.get('address', user.address)

        db.session.commit()

        return jsonify(user.serialize()), 200

    except ValueError as e:
        return jsonify({"message": str(e)}), 400
