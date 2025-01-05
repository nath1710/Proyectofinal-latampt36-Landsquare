import React, { useState, useEffect, useContext } from "react";
import GoogleMaps from "../component/GoogleMaps.jsx";
import LandCard from "../component/LandCard.jsx";
import { Footer } from "../component/footer.js";
import { useNavigate } from "react-router-dom";



const Lands = () => {
    const [lands, setLands] = useState([]);
    const navigate = useNavigate();

    const fetchLands = async () => {
        try {
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

    const toggleFavorite = async (announcementId, isFavorite) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Please register/login to access your favorites.");
                navigate("/login");
                return;
            }

            const method = isFavorite ? "DELETE" : "POST";
            const url = `${process.env.BACKEND_URL}/api/favorites${isFavorite ? `/${announcementId}` : ""}`;

            console.log("Método:", method);
            console.log("URL:", url);
            console.log("Cuerpo de la solicitud:", { announcement_id: announcementId });

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: isFavorite ? null : JSON.stringify({ announcement_id: announcementId }),
            });

            if (response.status === 401) {
                console.error("Time to start the session");
                navigate("/login");
                return;
            }

            if (!response.ok) {
                const errorDetails = await response.json();
                console.error("Detalles del error:", errorDetails);

                if (errorDetails.redirect) {
                    navigate(errorDetails.redirect);
                }

                throw new Error(`Error al ${isFavorite ? "delete" : "create"} favorite`);
            }
        } catch (error) {
            console.error("Favorite Toggle Error: ", error.message);
        }
    };


    return (
        <main className="land-section d-flex flex-column h-100 overflow-hidden" style={{ maxHeight: "100vh" }}>
            <div>
                <div><div role="button" tabindex="0" class="_14578" data-qa-searchlocation="true"
                    aria-label="Enter new location">Enter a State, County, City, or ID</div></div>
                <p>Buscador</p>
            </div>
            <div className="d-flex h-100 overflow-hidden">
                <GoogleMaps />
                <div className="app p-3" style={{ width: "90%", overflowY: "auto" }}>
                    <h1>Lista de Terrenos</h1>
                    <div className="land-list d-flex flex-column gap-3">
                        {lands.map(land => (
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
