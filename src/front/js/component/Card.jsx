import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartEmpty } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartFilled } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Context } from '../store/appContext';
import emailjs from '@emailjs/browser';
import '../../styles/randomStyles.css';

const Card = (props) => {
    const { store, actions } = useContext(Context)
    const [isFavorite, setIsFavorite] = useState(false);
    const [favorites, setFavorites] = useState([]);

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [emailOwner, setEmailOwner] = useState(props.ownerEmail)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [message, setMessage] = useState(`Hola ${props.owner}, he encontrado '${props.title}' en Landsquare.com y me gustaría obtener más información al respecto. Gracias.`)
    const [isLoading, setIsLoading] = useState(false);

    const randomId = crypto.randomUUID()

    const navigate = useNavigate();

    const fetchFavorites = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/favorites`, {
                headers: {
                    Authorization: `Bearer ${store.token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Error al cargar favoritos');
            const data = await response.json();
            setFavorites(data.favorites);
        } catch (error) {
            console.error('Error al cargar los favoritos:', error);
        }
    };

    const addFavorite = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${store.token}`,
                },
                body: JSON.stringify({ announcement_id: props.announcementID }),
            });
            const data = await response.json();
            if (data.favorite) {
                setFavorites((prevFavorites) => [...prevFavorites, data.favorite]);
            }
        } catch (error) {
            console.error('Error al agregar favorito:', error);
        }
    };

    const removeFavorite = async () => {
        try {
            const favorite = favorites.find((fav) => fav.announcement_id === props.announcementID);
            const response = await fetch(`${process.env.BACKEND_URL}/api/favorites/${favorite.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${store.token}`,
                },
            });
            if (response.ok) {
                setFavorites((prevFavorites) =>
                    prevFavorites.filter((fav) => fav.id !== favorite.id)
                );
            }
        } catch (error) {
            console.error('Error al eliminar favorito:', error);
        }
    };

    const handleFavoriteClick = () => {
        if (!store.token) {
            navigate('/login');
            return;
        }

        if (!isFavorite) {
            addFavorite();
        } else {
            removeFavorite();
        }
    };

    const initializeEmailJS = () => {
        // Inicializa EmailJS con tu Public Key
        emailjs.init('Llt4Zze9ol3aIwYLL');
    };

    useEffect(() => {
        initializeEmailJS();
    }, []);

    const handleSendEmail = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!name || !email || !phoneNumber || !message) {
            alert('Por favor, completa todos los campos');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un correo electrónico válido');
            return;
        }

        setIsLoading(true);

        // Prepare template parameters
        const templateParams = {
            to_email: emailOwner,
            to_name: props.owner,
            from_name: name,
            from_email: email,
            phone_number: phoneNumber,
            message: message,
            property_title: props.title,
            property_price: props.price,
            property_address: props.address,
            property_size: props.size,
            url: 'landsquare.com/announcement/id'
        };

        try {
            // Send email using EmailJS
            const result = await emailjs.send(
                'service_wlh848j', // Email service ID from EmailJS
                'template_hb5lgi8', // Email template ID from EmailJS
                templateParams
            );

            if (result.status === 200) {
                alert('Correo enviado exitosamente');

                // Reset form fields
                setName('');
                setEmail('');
                setPhoneNumber('');
                setMessage(`Hola ${props.owner}, he encontrado '${props.title}' en Landsquare.com y me gustaría obtener más información al respecto. Gracias.`);

                // Close modal
                const modalElement = document.getElementById('sendEmailModal');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();
            }
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            alert('Hubo un error al enviar el correo. Por favor, intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (store.token) {
            fetchFavorites();
        }
    }, [store.token, navigate]);

    useEffect(() => {
        const favorite = favorites.find((fav) => fav.announcement_id === props.announcementID);
        setIsFavorite(!!favorite);
    }, [favorites, props.announcementID]);

    return (
        <div className='card border shadow container-card-options' style={{ width: '18rem', height: '21rem' }}>
            <Link to={`/announcement/${props.announcementID}` /*Esto funciona en el home pero no en announcement*/}>
                <img
                    src={props.imgURL}
                    className='card-img-top'
                    alt='...'
                    style={{ height: '12rem', objectFit: 'cover' }}
                />
            </Link>

            <div className='card-body'>
                <div className='d-flex justify-content-between mb-2'>
                    <div className='d-flex flex-column'>
                        <div className='fw-medium'>
                            <span>${props.price}</span>
                            <span> • </span>
                            <span>{props.size} m<sup>2</sup></span>
                        </div>
                        <div>
                            <span className='text-overflow-ellipsis'>{props.address}</span>
                        </div>
                    </div>
                    <span className={`favorite-btn d-flex justify-content-center align-items-center fs-5 ms-2 ${isFavorite ? 'favorite' : ''}`}
                        onClick={handleFavoriteClick}>{isFavorite ? (
                            <FontAwesomeIcon icon={faHeartFilled} />
                        ) : (
                            <FontAwesomeIcon icon={faHeartEmpty} />
                        )}</span>
                </div>
                <div className='d-flex justify-content-between'>
                    <div className='d-flex align-items-center' >
                        <img src={props.imgOwner}
                            style={{ width: '35px', height: '35px' }}
                            className='my-1 me-2'
                        />
                        <div className='d-flex flex-column'>
                            <span className='fw-medium'>{props.owner}</span>
                            <span className='text-overflow-ellipsis'>{props.info}</span>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center fs-5 ms-2'>
                        <i
                            className='fa-regular fa-envelope'
                            data-bs-toggle="modal"
                            data-bs-target={`#sendEmailModal${props.announcementID}`}
                            style={{ cursor: 'pointer' }}
                        >
                        </i>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Card;