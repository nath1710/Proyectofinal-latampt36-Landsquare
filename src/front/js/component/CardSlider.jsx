import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";

import Card from "./Card.jsx";

const data = [
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
]

const CardSlider = () => {

    return (
        <div className='d-flex flex-column gap-3 align-items-center justify-content-center bg-light text-dark py-4'>
            <h2 className='mb-3'>Terrenos en venta en Latam</h2>
            <div className='d-flex flex-wrap gap-2 align-items-center justify-content-center'>
                
                {data.map((d) => (
                    <Card imgURL={d.img} price={d.price} size={d.size} address={d.address} imgOwner={d.imgOwner} owner={d.owner} info={d.info} />
                ))}
            </div >                
        </div>
    )
}

export default CardSlider;