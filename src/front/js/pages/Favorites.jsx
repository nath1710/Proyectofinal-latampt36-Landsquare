import React from "react";



const Favorites = () => {

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

    const App = () => {
        const [land, setLands] = useState([
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
            if (favorites.includes(id)) {
                setFavorites(favorites.filter(favId => favId !== id));
            } else {
                setFavorites([...favorites, id]);
            }
        };

        return (
            <main className="d-flex flex-column gap-3 vh-100 align-items-center justify-content-center">
                <div className="app">
                    <h1>Lista de Terrenos</h1>
                    <div className="land-list">
                        {land.map(land => (
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
                            land
                                .filter(land => land.includes(land.id))
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
};

export default Favorites;