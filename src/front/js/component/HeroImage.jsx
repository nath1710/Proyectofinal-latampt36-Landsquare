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
        <div className='d-flex flex-column gap-3 vh-100 align-items-center justify-content-center' style={imgStyle}>
            
            <div className=''>
                <img src={logoLS}/>
                <h2 className='text-center text-light'>The place where your dreams find their land</h2>
            </div>
            
        </div >
    );
};

export default HeroImage;