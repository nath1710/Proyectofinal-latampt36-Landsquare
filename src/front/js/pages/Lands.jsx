import React, { useState, useEffect, useContext } from "react";
import GoogleMaps from "../component/GoogleMaps.jsx";
import LandCard from "../component/LandCard.jsx";


const Lands = () => {
    const [lands, setLands] = useState([]);

    const fetchLands = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Usuario no autenticado");

            const response = await fetch(process.env.BACKEND_URL + "/api/lands");

            if (!response.ok) throw new Error("Error al cargar terrenos");

            const data = await response.json();
            console.log(data)
            setLands(data.announcements);
            console.log(data.announcements)
        } catch (error) {
            console.error(error.message);
        }
    }
    useEffect(() => {
        fetchLands()
    }, []);

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
                        />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Lands;
