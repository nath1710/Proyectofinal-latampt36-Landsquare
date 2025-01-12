import React, { useState, useEffect } from "react";
import Card from "./Card.jsx";
import Slider from "./Slider.jsx";
/*
const data2 = [
    {
        img: 'https://picsum.photos/400/225?random=1',
        price: '10,000',
        size: '357',
        address: 'Av. Dirección 1 - Ciudad - País',
        imgOwner: 'https://picsum.photos/35?random=9',
        owner: 'Propietario 1',
        info: 'Más información...'
    },
    {
        img: 'https://picsum.photos/400/225?random=2',
        price: '20,132',
        size: '5433',
        address: 'Av. Dirección 2 - Ciudad - País',
        imgOwner: 'https://picsum.photos/35?random=10',
        owner: 'Propietario 2',
        info: 'Más información...'
    },
    {
        img: 'https://picsum.photos/400/225?random=3',
        price: '432',
        size: '98',
        address: 'Av. Dirección 3 - Ciudad - País',
        imgOwner: 'https://picsum.photos/35?random=11',
        owner: 'Propietario 3',
        info: 'Más información...'
    },
    {
        img: 'https://picsum.photos/400/225?random=4',
        price: '10,000',
        size: '357',
        address: 'Av. Dirección 4 - Ciudad - País',
        imgOwner: 'https://picsum.photos/35?random=12',
        owner: 'Propietario 4',
        info: 'Más información...'
    },
    {
        img: 'https://picsum.photos/400/225?random=5',
        price: '10,000',
        size: '357',
        address: 'Av. Dirección 5 - Ciudad - País',
        imgOwner: 'https://picsum.photos/35?random=13',
        owner: 'Propietario 5',
        info: 'Más información...'
    },
    {
        img: 'https://picsum.photos/400/225?random=6',
        price: '10,000',
        size: '357',
        address: 'Av. Dirección 6 - Ciudad - País',
        imgOwner: 'https://picsum.photos/35?random=14',
        owner: 'Propietario 6',
        info: 'Más información...'
    },
    {
        img: 'https://picsum.photos/400/225?random=7',
        price: '10,000',
        size: '357',
        address: 'Av. Dirección 7 - Ciudad - País',
        imgOwner: 'https://picsum.photos/35?random=15',
        owner: 'Propietario 7',
        info: 'Más información...'
    },
    {
        img: 'https://picsum.photos/400/225?random=8',
        price: '10,000',
        size: '357',
        address: 'Av. Dirección 8 - Ciudad - País',
        imgOwner: 'https://picsum.photos/35?random=16',
        owner: 'Propietario 8',
        info: 'Más información...'
    }
]*/

const CardSlider = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getRandomAnnouncements = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(process.env.BACKEND_URL + '/api/random-announcements', {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Error al cargar los anuncios');
            }

            const body = await response.json();
            setData(body.announcements);

        } catch (error) {
            console.error('Error fetching announcements:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getRandomAnnouncements();
    }, []);

    if (isLoading) {
        return (
            <div className="cardslider d-flex justify-content-center align-items-center py-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cardslider d-flex justify-content-center align-items-center py-4">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="cardslider d-flex flex-column gap-3 align-items-center justify-content-center bg-light text-dark py-4">
            <h2 className="mb-3">Terrenos en venta en Latam</h2>
            {/* {data.length === 0 ? (
                <p>No hay anuncios disponibles</p>
            ) : (

                <div className="d-flex flex-wrap gap-2 align-items-center justify-content-center">
                    {data.map((item) => (
                        <Card
                            key={item.id}
                            announcementID={item.id}
                            imgURL={item.images?.[0] || '../../img/placeholder-image.jpg'}
                            price={item.price}
                            size={item.size}
                            address={item.location}
                            imgOwner={item.user?.photo_profile || '../../img/placeholder-profile.jpg'}
                            owner={item.user?.name || 'Usuario'}
                            ownerPhoneNumber={item.user?.phone_number}
                            ownerEmail={item.user?.email}
                            info={item.description}
                            title={item.title}
                        />
                    ))}

                </div>
            )} */}
            {data.length > 0 && <Slider slides={data} />}
        </div>
    );
}

export default CardSlider;