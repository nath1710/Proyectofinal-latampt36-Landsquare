import React, { useState, useEffect, useContext } from "react";
import GoogleMaps from "../component/GoogleMaps.jsx";
import LandCard from "../component/LandCard.jsx";
import { Footer } from "../component/footer.js";
import { useNavigate } from "react-router-dom";
import Filters from "../component/Filters.jsx";



const Lands = () => {
    const [lands, setLands] = useState([]);
    const navigate = useNavigate();

    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);

    const fetchLands = async () => {
        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/lands");

            if (!response.ok) throw new Error("Error al cargar terrenos");

            const data = await response.json();
            console.log(data);
            setLands(data.announcements);
            setFilteredAnnouncements(data.announcements)
        } catch (error) {
            console.error(error.message);
        }
    }

    // Llamada inicial para cargar los terrenos
    useEffect(() => {
        fetchLands();
    }, []);

    // Función para manejar la adición/eliminación de favoritos
    const toggleFavorite = async (announcementId, isFavorite) => {
        try {
            // Solo verificar el token cuando el usuario intenta modificar los favoritos
            const token = localStorage.getItem("token");

            // Si no hay token, redirigir al login solo cuando se intente modificar favoritos
            if (!token) {
                console.error("Please register/login to access your favorites.");
                navigate("/login");
                return;
            }

            const method = isFavorite ? "DELETE" : "POST";
            const url = `${process.env.BACKEND_URL}/api/favorites${isFavorite ? `/${announcementId}` : ""}`;

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: isFavorite ? null : JSON.stringify({ announcement_id: announcementId }),
            });

            if (response.status === 401) {
                console.error("Please log in to manage your favorites.");
                navigate("/login");
                return;
            }

            if (!response.ok) {
                const errorDetails = await response.json();
                console.error("Detalles del error:", errorDetails);

                if (errorDetails.redirect) {
                    navigate(errorDetails.redirect);
                }

                throw new Error(`Error al ${isFavorite ? "eliminar" : "agregar"} favorito`);
            }
        } catch (error) {
            console.error("Favorite Toggle Error: ", error.message);
        }
    };

    return (
        <main className="land-section d-flex flex-column h-100 overflow-hidden" style={{ maxHeight: "100vh" }}>
            <div>
                <Filters announcements={lands} setFilteredAnnouncements={setFilteredAnnouncements} />
            </div>
            <div className="d-flex h-100 overflow-hidden">
                <GoogleMaps markers={filteredAnnouncements} />
                <div className="app p-3" style={{ width: "90%", overflowY: "auto" }}>
                    <h1>Lista de Terrenos</h1>
                    <div className="land-list d-flex flex-column gap-3">
                        {filteredAnnouncements.map(land => (
                            <LandCard
                                key={land.id}
                                land={land}
                                isFavorite={false}
                                toggleFavorite={toggleFavorite}
                            />
                        ))}
                    </div>
                    <Footer overrideHide={true} />
                </div>
            </div>
        </main>
    );
};


export default Lands;
