import React, { useState, useEffect, useContext } from "react";
import GoogleMaps from "../component/GoogleMaps.jsx";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import LandCard from "../component/LandCard.jsx";
import { Footer } from "../component/footer.js";
import Filters from "../component/Filters.jsx";

const Favorites = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState([]);
    const [favAnnouncements, setFavAnnouncements] = useState([]);
    const [filteredFavAnnouncements, setFilteredFavAnnouncements] = useState([]);

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
            const favAnnouncements = data.favorites.map(favorite => favorite.announcement)
            setFavAnnouncements(favAnnouncements)
            setFilteredFavAnnouncements(favAnnouncements)
            setFavorites(data.favorites);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (store.token === undefined && localStorage.getItem('token') == undefined) {
            navigate('/login')
            return;
        } if (store.token) {
            fetchFavorites()
        }
    }, [store.token, navigate])

    const updateFavorites = async (favoriteId) => {
        const updatedFavorites = favorites.filter((fav) => fav.id !== favoriteId)
        setFavorites(updatedFavorites)
        const favAnnouncements = updatedFavorites.map(favorite => favorite.announcement)
        setFilteredFavAnnouncements(favAnnouncements)
    };

    return (
        <main className="fav-section d-flex flex-column h-100 overflow-hidden" style={{ maxHeight: "100vh" }}>
            <div>
                <Filters announcements={favAnnouncements} setFilteredAnnouncements={setFilteredFavAnnouncements} />
            </div>
            <div className="d-flex h-100 overflow-hidden">
                <GoogleMaps markers={filteredFavAnnouncements} />
                <div className="app p-3" style={{ width: "90%", overflowY: "auto" }}>
                    <h1>Mis Favoritos</h1>
                    <div className="favorites-list d-flex flex-column gap-3">
                        {filteredFavAnnouncements.length > 0 ? (
                            filteredFavAnnouncements
                                .map(land => (
                                    <LandCard
                                        key={land.id}
                                        land={land}
                                        updateFavorites={updateFavorites}
                                    />
                                ))
                        ) : (
                            <p>No tienes terrenos favoritos.</p>
                        )}
                    </div>
                    <Footer overrideHide={true} />
                </div>
            </div>
        </main>
    );
};

export default Favorites;
