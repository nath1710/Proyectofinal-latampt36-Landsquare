import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

import hImage from '../../img/heroImage-blur-bright.png';
import logoLS from '../../img/LandSquare-large.png';

const imgStyle = {
    backgroundImage: `url(${hImage})`,
    //filter: 'brightness(0.5) contrast(1.2)'
}

const HeroImage = () => {

    return (
        <div
            className="d-flex flex-column gap-3 align-items-center justify-content-center"
            style={{
                backgroundImage: `url(${hImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: 'calc(100vh - 56px)', // Altura total menos el tamaño del navbar (56px)
                position: 'relative', // Para que los elementos estén por encima
                zIndex: 1
            }}
        >

            <div className="text-center text-light">
                <img src={logoLS} />
                <h2 className='text-center text-light'>The place where your dreams find their land</h2>
            </div>

        </div >
    );
};

export default HeroImage;