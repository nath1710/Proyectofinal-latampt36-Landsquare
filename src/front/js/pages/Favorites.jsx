import React, { useState, useEffect, useContext } from "react";
import GoogleMaps from "../component/GoogleMaps.jsx";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import LandCard from "../component/LandCard.jsx";
import { Footer } from "../component/footer.js";

const Favorites = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState([]);
    const [announcements, setAnnouncements] = useState([]);

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
            const favannouncements = data.favorites.map(favorite => favorite.announcement)
            setAnnouncements(favannouncements)
            console.log(favannouncements)
            setFavorites(data.favorites);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (store.token) {
            fetchFavorites();
        } else {
            navigate("/");
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
        <main className="fav-section d-flex h-100 overflow-hidden" style={{ maxHeight: "100vh" }}>
            <GoogleMaps markers={announcements} />
            <div className="app p-3" style={{ width: "90%", overflowY: "auto" }}>
                <h1>Mis Favoritos</h1>
                <div className="favorites-list d-flex flex-column gap-3">
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
                <Footer overrideHide={true} />
            </div>
        </main>
    );
};

export default Favorites;
