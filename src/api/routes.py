"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint, make_response
from sqlalchemy.exc import SQLAlchemyError
from api.models import db, User, Announcement, Favorite
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from email_validator import validate_email, EmailNotValidError
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.sql import func
from io import BytesIO
import pandas as pd
from flask import send_file

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api, resources={r"/*": {"origins": "*"}})


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response


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
        additional_claims = {"role": user.role}
        token = create_access_token(
            identity=user.email, additional_claims=additional_claims)

        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role
            }
        }), 200
    except SQLAlchemyError as db_error:
        print(f"Database error: {str(db_error)}")
        return jsonify({'message': 'Database error occurred', 'error': str(db_error)}), 500

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred', 'error': str(e)}), 500


@api.route('/user', methods=['GET'])
@jwt_required()
def get_private_data():
    user_mail = get_jwt_identity()
    user = db.session.execute(
        db.select(User).filter_by(email=user_mail)).scalar_one()
    return jsonify(user.serialize()), 200


@api.route('/users', methods=['GET'])
def get_users_data():
    users = db.session.execute(
        db.select(User)).scalars().all()

    users_data = [user.serialize() for user in users]

    return jsonify({"users": users_data}), 200


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
            return jsonify({"error": "Required fields are missing: {', '.join(missing_fields)}"}), 400

        title = data.get('title')
        images = data.get('images')
        description = data.get('description')
        price = data.get('price')
        location = data.get('location')
        latitude = data.get('latitude')
        longitude = data.get('longitude')
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
            latitude=latitude,
            longitude=longitude,
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
                "latitude": new_announcement.latitude,
                "longitude": new_announcement.longitude,
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


@api.route('/userlands', methods=['GET'])
@jwt_required()
def get_user_announcements():
    current_user_email = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(
        email=current_user_email)).scalar_one_or_none()
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        announcements = db.session.execute(
            db.select(Announcement).filter_by(user_id=user.id)
        ).scalars().all()

        announcements_data = [
            {
                "id": announcement.id,
                "images": announcement.images,
                "title": announcement.title,
                "description": announcement.description,
                "price": announcement.price,
                "location": announcement.location,
                "size": announcement.size,
                "creation_date": announcement.creation_date.isoformat()
            }
            for announcement in announcements
        ]

        return jsonify({"announcements": announcements_data}), 200

    except SQLAlchemyError as db_error:
        print(f"Database error: {str(db_error)}")
        return jsonify({'message': 'Database error occurred', 'error': str(db_error)}), 500

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred', 'error': str(e)}), 500


@api.route('/lands', methods=['GET'])
def get_announcements():
    try:
        announcements = db.session.execute(
            db.select(Announcement).join(Announcement.user)).scalars().all()

        announcements_data = [
            {
                "id": announcement.id,
                "user_id": announcement.user_id,
                "images": announcement.images,
                "title": announcement.title,
                "description": announcement.description,
                "price": announcement.price,
                "location": announcement.location,
                "latitude": announcement.latitude,
                "longitude": announcement.longitude,
                "size": announcement.size,
                "creation_date": announcement.creation_date.isoformat(),
                "owner": announcement.user.name,
                "ownerImg": announcement.user.photo_profile
            }
            for announcement in announcements
        ]

        return jsonify({"announcements": announcements_data}), 200

    except SQLAlchemyError as db_error:
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

    if request.method == "OPTIONS":  # CORS preflight
        return _build_cors_preflight_response()

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


@api.route('/favorites', methods=['POST'])
@jwt_required()
def create_favorite():
    current_user_email = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(
        email=current_user_email)).scalar_one_or_none()

    if not user:
        return jsonify({"error": "User not found", "redirect": "/signup"}), 404

    try:
        data = request.json
        announcement_id = data.get('announcement_id')

        if not announcement_id:
            return jsonify({"error": "announcement_id is required"}), 400

        # Verifica si el anuncio existe
        announcement = db.session.execute(db.select(Announcement).filter_by(
            id=announcement_id)).scalar_one_or_none()

        if not announcement:
            return jsonify({"error": "Announcement not found"}), 404

        # Verifica si ya existe el favorito
        existing_favorite = db.session.execute(db.select(Favorite).filter_by(
            user_id=user.id,
            announcement_id=announcement_id
        )).scalar_one_or_none()

        if existing_favorite:
            return jsonify({"error": "Announcement already in favorites"}), 400

        new_favorite = Favorite(
            user_id=user.id,
            announcement_id=announcement_id
        )

        db.session.add(new_favorite)
        db.session.commit()

        return jsonify({
            "message": "Favorite created successfully",
            "favorite": new_favorite.serialize()
        }), 201

    except SQLAlchemyError as db_error:
        db.session.rollback()
        print(f"Database error: {str(db_error)}")
        return jsonify({'message': 'Database error occurred', 'error': str(db_error)}), 500

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred', 'error': str(e)}), 500


@api.route('/favorites/<int:favorite_id>', methods=['GET'])
@jwt_required()
def get_favorite(favorite_id):
    current_user_email = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(
        email=current_user_email)).scalar_one_or_none()

    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        favorite = db.session.execute(db.select(Favorite).filter_by(
            id=favorite_id,
            user_id=user.id
        )).scalar_one_or_none()

        if not favorite:
            return jsonify({"error": "Favorite not found"}), 404

        return jsonify(favorite.serialize()), 200

    except SQLAlchemyError as db_error:
        print(f"Database error: {str(db_error)}")
        return jsonify({'message': 'Database error occurred', 'error': str(db_error)}), 500

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred', 'error': str(e)}), 500


@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_user_favorites():
    current_user_email = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(
        email=current_user_email)).scalar_one_or_none()

    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        favorites = db.session.execute(db.select(Favorite)
                                       .filter_by(user_id=user.id)
                                       .order_by(Favorite.creation_date.desc())
                                       ).scalars().all()

        favorites_data = [
            {
                "announcement": {
                    "id": favorite.announcement.id,
                    "user_id": favorite.announcement.user_id,
                    "images": favorite.announcement.images,
                    "title": favorite.announcement.title,
                    "description": favorite.announcement.description,
                    "price": favorite.announcement.price,
                    "location": favorite.announcement.location,
                    "latitude": favorite.announcement.latitude,
                    "longitude": favorite.announcement.longitude,
                    "size": favorite.announcement.size,
                    "creation_date": favorite.announcement.creation_date.isoformat(),
                    "owner": favorite.announcement.user.name,
                    "ownerImg": favorite.announcement.user.photo_profile
                },
                "announcement_id": favorite.announcement_id,
                "creation_date": favorite.creation_date.isoformat(),
                "id": favorite.id,
                "user_id": favorite.user_id,
            }
            for favorite in favorites
        ]

        return jsonify({
            "favorites": favorites_data
        }), 200

    except SQLAlchemyError as db_error:
        print(f"Database error: {str(db_error)}")
        return jsonify({'message': 'Database error occurred', 'error': str(db_error)}), 500

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred', 'error': str(e)}), 500


@api.route('/favorites/<int:favorite_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(favorite_id):
    current_user_email = get_jwt_identity()
    user = db.session.execute(db.select(User).filter_by(
        email=current_user_email)).scalar_one_or_none()

    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        favorite = db.session.execute(
            db.select(Favorite).filter_by(
                id=favorite_id,
                user_id=user.id
            )).scalar_one_or_none()

        if not favorite:
            return jsonify({"error": "Favorite not found or unauthorized"}), 404

        db.session.delete(favorite)
        db.session.commit()

        return jsonify({
            "message": "Favorite deleted successfully",
            "deleted_favorite_id": favorite_id
        }), 200

    except SQLAlchemyError as db_error:
        db.session.rollback()
        print(f"Database error: {str(db_error)}")
        return jsonify({'message': 'Database error occurred', 'error': str(db_error)}), 500

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred', 'error': str(e)}), 500


@api.route('/random-announcements', methods=['GET'])
def get_random_announcements():
    try:
        # Usando func.random() de SQLAlchemy para obtener registros aleatorios
        # Incluimos un join con User para asegurar que cargamos los datos del usuario
        random_announcements = db.session.execute(
            db.select(Announcement)
            # Aseguramos que se carguen los datos del usuario
            .join(Announcement.user)
            .order_by(func.random())
            .limit(10)
        ).scalars().all()

        if not random_announcements:
            return jsonify({
                'message': 'No announcements found in the database',
                'announcements': []
            }), 200

        # El serialize actualizado ya incluirá la información del usuario
        announcements_data = [announcement.serialize()
                              for announcement in random_announcements]

        return jsonify({
            'message': 'Random announcements retrieved successfully',
            'total': len(announcements_data),
            'announcements': announcements_data
        }), 200

    except SQLAlchemyError as db_error:
        print(f'Database error: {str(db_error)}')
        return jsonify({
            'message': 'Database error occurred',
            'error': str(db_error)
        }), 500

    except Exception as e:
        print(f'Unexpected error: {str(e)}')
        return jsonify({
            'message': 'An unexpected error occurred',
            'error': str(e)
        }), 500


@api.route('/user/<int:user_id>/announcements', methods=['GET'])
def get_user_announcements_profile(user_id):
    try:
        # Verificar si el usuario existe
        user = db.session.execute(
            db.select(User).filter_by(id=user_id)
        ).scalar_one_or_none()

        if not user:
            return jsonify({
                "error": "User not found"
            }), 404

        # Obtener todos los anuncios del usuario
        announcements = db.session.execute(
            db.select(Announcement)
            .filter_by(user_id=user_id)
            # Ordenados por fecha de creación, más recientes primero
            .order_by(Announcement.creation_date.desc())
        ).scalars().all()

        return jsonify({
            "message": "User announcements retrieved successfully",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "country": user.country,
                "photo_profile": user.photo_profile
            },
            "total_announcements": len(announcements),
            "announcements": [announcement.serialize() for announcement in announcements]
        }), 200

    except SQLAlchemyError as db_error:
        print(f"Database error: {str(db_error)}")
        return jsonify({
            'message': 'Database error occurred',
            'error': str(db_error)
        }), 500

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({
            'message': 'An unexpected error occurred',
            'error': str(e)
        }), 500


@api.route('/announcement/<int:announcement_id>', methods=['GET'])
def get_announcement(announcement_id):
    try:
        # Obtener el anuncio y asegurar que se carguen los datos del usuario
        announcement = db.session.execute(
            db.select(Announcement)
            .filter_by(id=announcement_id)
            .join(Announcement.user)  # Aseguramos cargar los datos del usuario
        ).scalar_one_or_none()

        if not announcement:
            return jsonify({"error": "Announcement not found"}), 404

        return jsonify(announcement.serialize()), 200

    except SQLAlchemyError as db_error:
        print(f"Database error: {str(db_error)}")
        return jsonify({'message': 'Database error occurred', 'error': str(db_error)}), 500
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred', 'error': str(e)}), 500


@api.route('/announcement/<int:announcement_id>', methods=['DELETE'])
@jwt_required()
def delete_announcement(announcement_id):
    current_user_email = get_jwt_identity()
    user = db.session.execute(
        db.select(User).filter_by(email=current_user_email)
    ).scalar_one_or_none()

    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        # Buscar el anuncio y verificar que pertenezca al usuario
        announcement = db.session.execute(
            db.select(Announcement).filter_by(
                id=announcement_id,
                user_id=user.id
            )
        ).scalar_one_or_none()

        if not announcement:
            return jsonify({"error": "Announcement not found or unauthorized"}), 404

        # Eliminar primero los favoritos asociados al anuncio
        db.session.execute(
            db.delete(Favorite).where(
                Favorite.announcement_id == announcement_id)
        )

        # Eliminar el anuncio
        db.session.delete(announcement)
        db.session.commit()

        return jsonify({
            "message": "Announcement deleted successfully",
            "deleted_announcement_id": announcement_id
        }), 200

    except SQLAlchemyError as db_error:
        db.session.rollback()
        print(f"Database error: {str(db_error)}")
        return jsonify({'message': 'Database error occurred', 'error': str(db_error)}), 500
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred', 'error': str(e)}), 500


@api.route('/land-settings/<int:announcement_id>', methods=['PUT'])
@jwt_required()
def update_announcement(announcement_id):
    # Obtén el email del usuario autenticado desde el token.
    current_user_email = get_jwt_identity()

    # Obtén al usuario autenticado desde la base de datos.
    user = db.session.execute(
        db.select(User).filter_by(email=current_user_email)
    ).scalar_one_or_none()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Buscar el anuncio y asegurarse de que pertenezca al usuario autenticado.
    announcement = db.session.execute(
        db.select(Announcement).filter_by(
            id=announcement_id,
            # Verificar que el user_id coincida con el usuario autenticado.
            user_id=user.id
        )
    ).scalar_one_or_none()

    if not announcement:
        # Cambiar el código a 403 si no es autorizado.
        return jsonify({"error": "Announcement not found or unauthorized"}), 403

    try:
        data = request.get_json()

        # Validaciones de datos
        if data.get('price') is not None and (not isinstance(data['price'], (int, float)) or data['price'] <= 0):
            return jsonify({"error": "Price must be a number greater than 0"}), 400

        if data.get('size') is not None and (not isinstance(data['size'], (int, float)) or data['size'] <= 0):
            return jsonify({"error": "Size must be a number greater than 0"}), 400

        if data.get('images') is not None and len(data['images']) > 5:
            return jsonify({"error": "The number of images cannot exceed 5"}), 400

        if data.get('latitude') is not None and not isinstance(data['latitude'], (int, float)):
            return jsonify({"error": "Latitude must be a number"}), 400

        if data.get('longitude') is not None and not isinstance(data['longitude'], (int, float)):
            return jsonify({"error": "Longitude must be a number"}), 400

        # Actualizar solo los campos que están presentes en la solicitud.
        if 'title' in data:
            announcement.title = data['title']
        if 'images' in data:
            announcement.images = data['images']
        if 'description' in data:
            announcement.description = data['description']
        if 'price' in data:
            announcement.price = data['price']
        if 'location' in data:
            announcement.location = data['location']
        if 'size' in data:
            announcement.size = data['size']
        if 'latitude' in data:
            announcement.latitude = data['latitude']
        if 'longitude' in data:
            announcement.longitude = data['longitude']

        db.session.commit()

        return jsonify({
            "message": "Announcement updated successfully",
            # Asegúrate de tener un método serialize en tu modelo.
            "announcement": announcement.serialize()
        }), 200

    except SQLAlchemyError as db_error:
        db.session.rollback()
        print(f"Database error: {str(db_error)}")
        return jsonify({'error': 'Database error occurred', 'details': str(db_error)}), 500
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500
