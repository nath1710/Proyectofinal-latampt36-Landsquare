import React from 'react';
import { Link } from 'react-router-dom';
import hImage from '../../img/heroImage-blur-bright.png';
import logoLS from '../../img/LandSquare-large.png';

const HeroImage = () => {
    return (
        <div
            className='d-flex flex-column gap-3 align-items-center justify-content-center'
            style={{
                backgroundImage: `url(${hImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: 'calc(100vh - 56px)',
                position: 'relative',
                zIndex: 1
            }}
        >

            <div className='text-center text-light'>
                <img
                    style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))' }}
                    src={logoLS}
                    alt='Logo'
                />
                <h2 className='text-center text-light'>The place where your dreams find their land</h2>
                <Link to='/lands'>
                    <button type='button' className='login-button btn btn-primary btn-lg mt-3'>¡Explorar!</button>
                </Link>
            </div>

        </div >
    );
};

export default HeroImage;