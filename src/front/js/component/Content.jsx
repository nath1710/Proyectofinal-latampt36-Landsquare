import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';



const Content = () => {
    const { actions } = useContext(Context);

    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/lands');
        return;
    }

    useEffect(() => {

    }, []);

    return (
        <div className='d-flex flex-wrap gap-3 align-items-center justify-content-center py-4'>
            <div className='text-light col-5 gap-3'>
                <h2 className='mb-3'>El Principal Mercado <br /> Inmobiliario Rural</h2>
                <p className='mb-3'>Landsquare.com es el principal mercado para descubrir, comprar y vender bienes inmuebles rurales. Cada mes, la red de Squareland.com conecta a muchas personas que buscan terrenos en venta con anuncios de agentes inmobiliarios líderes del sector.</p>
                <p>Tanto si busca fincas en venta como si quiere vender un rancho, Squareland.com es el lugar donde encontrar y vender su terreno.</p>
            </div>
            <div className='d-flex col-5 gap-3 justify-content-center'>
                <div className='card text-bg-dark shadow' style={{ width: '25rem', height: '25rem' }}>
                    <img src='https://picsum.photos/500?blur' className='card-img' style={{ filter: 'brightness(0.5) contrast(1.2)' }} />
                    <div className='card-img-overlay px-4 py-5'>
                        <h5 className='card-title pb-3'>Encuentra el Terreno Ideal</h5>
                        <p className='card-text pb-3'>Comprar y/o vender un terreno es un gran negocio. Comercialice de forma más inteligente con nuestro conjunto de herramientas mejoradas para que su propiedad sea vista y vendida rápidamente. O también permítanos ayudarle a encontrar el terreno perfecto para usted.</p>
                        <button type='button' className='btn btn-outline-light' onClick={handleButtonClick}>¡Explorar!</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Content;