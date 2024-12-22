import React, { useState, useEffect } from "react";
import GoogleMaps from "../component/GoogleMaps.jsx";

const LandCard = ({ land, toggleFavorite, isFavorite }) => {
    return (
        <div className="land-card">
            <h3>{land.nombre}</h3>
            <p>Precio: {land.precio}</p>
            <p>Ubicación: {land.ubicacion}</p>
            <button
                className={`favorite-btn ${isFavorite ? 'favorite' : ''}`}
                onClick={() => toggleFavorite(land.id)}
            >
                {isFavorite ? '★' : '☆'}
            </button>
        </div>
    );
};

const Favorites = () => {
    const [lands, setLands] = useState([
        { id: 1, nombre: 'Terreno A', precio: '$10,000', ubicacion: 'Ciudad A' },
        { id: 2, nombre: 'Terreno B', precio: '$15,000', ubicacion: 'Ciudad B' },
        { id: 3, nombre: 'Terreno C', precio: '$20,000', ubicacion: 'Ciudad C' },
    ]);

    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem('favorites');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (id) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
        );
    };

    return (
        <main className="d-flex h-100 gap-3">
            <GoogleMaps />
            <div className="app" style={{width:"70%"}}>
                <h1>Lista de Terrenos</h1>
                <div className="land-list">
                    {lands.map(land => (
                        <LandCard
                            key={land.id}
                            land={land}
                            toggleFavorite={toggleFavorite}
                            isFavorite={favorites.includes(land.id)}
                        />
                    ))}
                </div>

                <h2>Mis Favoritos</h2>
                <div className="favorites-list">
                    {favorites.length > 0 ? (
                        lands
                            .filter(land => favorites.includes(land.id))
                            .map(land => (
                                <LandCard
                                    key={land.id}
                                    land={land}
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
