import React, { useState, useEffect, useContext } from "react";
import GoogleMaps from "../component/GoogleMaps.jsx";
import LandCard from "../component/LandCard.jsx";


const Lands = () => {
    const [lands, setLands] = useState([]);
    return (
        <main className="fav-section d-flex h-100 gap-3">
            <GoogleMaps />
            <div className="app" style={{ width: "70%" }}>
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
            </div>
        </main>
    );
};

export default Lands;
