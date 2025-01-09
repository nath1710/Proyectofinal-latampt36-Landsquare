import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Context } from '../store/appContext';
import '../../styles/randomStyles.css';

const Card = (props) => {
    const { store, actions } = useContext(Context)
    const [isFavorite, setIsFavorite] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    const handleDelete = () => {
        alert('Closeeee')
    };

    const navToAnnouncement = (id) => {
        //console.log('IDDDDDDDDDD', id)
        //navigate(`/announcement/${id}`)
    }
    const fetchFavorites = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/favorites`, {
                headers: {
                    Authorization: `Bearer ${store.token}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error("Error al cargar favoritos");
            const data = await response.json();
            setFavorites(data.favorites);
        } catch (error) {
            console.error("Error al cargar los favoritos:", error);
        }
    };

    const addFavorite = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/favorites`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${store.token}`,
                },
                body: JSON.stringify({ announcement_id: props.announcementID }),
            });
            const data = await response.json();
            if (data.favorite) {
                setFavorites((prevFavorites) => [...prevFavorites, data.favorite]);
            }
        } catch (error) {
            console.error("Error al agregar favorito:", error);
        }
    };

    const removeFavorite = async () => {
        try {
            const favorite = favorites.find((fav) => fav.announcement_id === props.announcementID);
            const response = await fetch(`${process.env.BACKEND_URL}/api/favorites/${favorite.id}`, {
                method: "DELETE",
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
            console.error("Error al eliminar favorito:", error);
        }
    };

    const handleFavoriteClick = () => {
        if (!store.token) {
            navigate("/login");
            return;
        }

        if (!isFavorite) {
            addFavorite();
        } else {
            removeFavorite();
        }
    };

    useEffect(() => {
        if (store.token) {
            fetchFavorites();
        }
    }, [store.token, navigate]);

    useEffect(() => {
        const favorite = favorites.find((fav) => fav.announcement_id === props.announcementID);
        console.log(favorites)
        setIsFavorite(!!favorite);
    }, [favorites, props.announcementID]);

    return (
        <div className='card border shadow container-card-options' style={{ width: '18rem', height: '21rem' }}>
            <Link to={`/announcement/${props.announcementID}`}> <img
                src={props.imgURL}
                className='card-img-top'
                alt='...'
                style={{ height: '12rem', objectFit: 'cover' }}
            /></Link>

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
                    <span className={`favorite-btn d-flex justify-content-center align-items-center fs-5 ms-2 ${isFavorite ? "favorite" : ""}`}
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
                            onClick={navToAnnouncement(props.announcementID)}
                        />
                        <div className='d-flex flex-column'>
                            <span className='fw-medium'>{props.owner}</span>
                            <span className='text-overflow-ellipsis'>{props.info}</span>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center fs-5 ms-2'><i className='fa-regular fa-envelope'></i></div>
                </div>
            </div>
        </div >
    );
};

export default Card;