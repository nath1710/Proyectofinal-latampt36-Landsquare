import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom';

const LandCard = ({ land }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const { store } = useContext(Context);
    const navigate = useNavigate();


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
                body: JSON.stringify({ announcement_id: land.id }),
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
            const response = await fetch(`${process.env.BACKEND_URL}/api/favorites/${land.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${store.token}`,
                },
            });
            if (response.ok) {
                setFavorites((prevFavorites) =>
                    prevFavorites.filter((fav) => fav.id !== land.id)
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
        const favorite = favorites.find((fav) => fav.announcement_id === land.id);
        setIsFavorite(!!favorite);
    }, [favorites, land.id]);

    return (
        <div className="land-card">
            <div className="d-flex justify-content-between">
                <h3>{land.title}</h3>
                <span
                    className={`favorite-btn ${isFavorite ? "favorite" : ""}`}
                    onClick={handleFavoriteClick}
                >
                    {isFavorite ? (
                        <FontAwesomeIcon icon={faHeartFilled} />
                    ) : (
                        <FontAwesomeIcon icon={faHeartEmpty} />
                    )}
                </span>
            </div>
            <p>{land.location}</p><div id={`carouselControls${land.id}`} className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {land.images.map((image, idx) => (
                        <div
                            key={`${land.id}-image-${idx}`} // Agregar la propiedad key con un valor único
                            className={`carousel-item ${idx === 0 ? "active" : ""}`} // Usa `idx === 0` para marcar el primer item como activo
                        >
                            <img style={{ height: "400px" }}
                                className="d-block w-100"
                                src={image}
                                alt={`Slide ${idx + 1}`} // Usar un texto alternativo único
                            />
                        </div>
                    ))}
                </div>
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target={`#carouselControls${land.id}`}
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target={`#carouselControls${land.id}`}
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <div className="d-flex justify-content-between pt-2">
                <div className="d-flex flex-column">
                    <div className="text-nowrap">
                        <span>${Number(land.price).toLocaleString('en-US')}</span>
                        <span> • </span>
                        <span>{land.size} m<sup>2</sup></span>
                    </div>
                    <div className="d-flex align-items-center">
                        <img
                            src={land.ownerImg}
                            style={{
                                width: "35px",
                                height: "35px",
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                            className="my-1 me-2"
                        />
                        <div className="d-flex flex-column">
                            <span className="fw-medium">{land.owner}</span>
                        </div>
                    </div>
                </div>
                <div className="vr mx-3"></div>
                <div>{land.description}</div>
            </div>
        </div >
    );
};

export default LandCard;
