import React, { useState, useEffect, useContext } from "react";
import GoogleMaps from "../component/GoogleMaps.jsx";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import LandCard from "../component/LandCard.jsx";

const Favorites = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState([]);

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
            console.log(data)
            setFavorites(data.favorites);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        if (store.token) {
            fetchFavorites();
        } else {
            navigate("/login");
        }
    }, [store.token, navigate]);

    const toggleFavorite = async (announcementId, isFavorite) => {
        try {
            const method = isFavorite ? "DELETE" : "POST";
            const url = isFavorite
                ? `/api/favorites/${announcementId}`
                : "/api/favorites";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${store.token}`,
                },
                body: isFavorite ? null : JSON.stringify({ announcement_id: announcementId }),
            });

            if (!response.ok) {
                console.error(`Error al ${isFavorite ? "eliminar" : "crear"} favorito`);
                return;
            }

            setFavorites(prev =>
                isFavorite
                    ? prev.filter(id => id !== announcementId)
                    : [...prev, announcementId]
            );
        } catch (error) {
            console.error("Error en toggleFavorite:", error);
        }
    };

    return (
        <main className="fav-section d-flex h-100 gap-3">
            <GoogleMaps />
            <div className="app" style={{ width: "70%" }}>
                <h2>Mis Favoritos</h2>
                <div className="favorites-list">
                    {favorites.length > 0 ? (
                        favorites
                            .map(land => (
                                <LandCard
                                    key={land.id}
                                    land={land.announcement}
                                    toggleFavorite={toggleFavorite}
                                    isFavorite={true}
                                />
                            ))
                    ) : (
                        <p>No tienes terrenos favoritos.</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Favorites;
