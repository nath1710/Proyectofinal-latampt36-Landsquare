import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/AboutUs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faSquareGithub } from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import waves from '../../img/wave.png';
import nataly from '../../img/fotonataly.png';
import yarom from '../../img/fotoyarom.jpg';
import heroImage from '../../img/AboutUs.jpg';
import phone from '../../img/phone.jpg';
import future from '../../img/future.jpg';
import features from '../../img/features.jpg';
import Techstack from '../component/Techstack.jsx';

const AboutUs2 = () => {
    return (
        <div className=''>
            {/* Hero Section */}
            <section>
                <div className='d-flex flex-column gap-3 align-items-center justify-content-center' style={{
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: 'calc(100vh)',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div className='text-center shadow-text'>
                        <h1 className='display-4'>Simplificando la compra y venta<br />de terrenos en Latinoamérica</h1>
                        <h5 className=''>La plataforma que conecta a propietarios y compradores.</h5>
                    </div>
                    <Link to='/lands'>
                        <button type='button' className='login-button btn btn-primary btn-lg mt-3'>¡Explorar!</button>
                    </Link>
                </div>
            </section>

            {/* Introduction Section */}
            <section>
                <div className='' style={{
                    backgroundImage: `url(${phone})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: 'calc(100vh)',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div className='d-flex flex-column justify-content-center'>
                        <h1 className='text-center mt-5'>La idea detrás de Landsquare</h1>
                        <div className='' style={{ height: '28rem' }}></div>
                        <p className='text-center mt-3' style={{ fontSize: 'x-large' }}>¡Las redes sociales no son suficientes!</p>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className='mt-3 d-flex flex-column align-items-center'>
                <h2 className='text-center mb-3'>Nuestro Equipo</h2>
                <div className='d-flex flex-wrap justify-content-evenly gap-3'>
                    <div className='card text-light text-center col-md-3 rounded-5' style={{ height: 'auto' }}>
                        <div className='d-flex justify-content-center align-items-center' style={{ height: '12rem' }}>
                            <div className='profile-card-image' >
                                <img src={nataly} alt='Yarom Vargas' className='card-img-top profile-card-img' />
                            </div>
                        </div>
                        <div className='card-body d-flex flex-column justify-content-center card-info' style={{ backgroundColor: '#164A41' }}>
                            <h5 className='card-title'>Nataly Castañeda</h5>
                            <p className='card-text' style={{ fontSize: '14px' }}>Desarrolladora Full-Stack con formación intensiva en tecnologías modernas, incluyendo HTML5, CSS3, JavaScript, React, Node.js, bases de datos relacionales (MySQL) y herramientas de control de versiones como Git. Experiencia práctica en el diseño e implementación de aplicaciones web dinámicas y funcionales, adquirida a través de proyectos académicos y prácticas supervisadas.</p>
                            <div className='d-flex justify-content-center gap-2'>
                                <a href='https://github.com/nath1710' style={{ textDecoration: 'none' }}> <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: '25px', color: 'white' }} /> </a>
                                <a href='https://www.linkedin.com/in/nath1710/' style={{ textDecoration: 'none' }}> <FontAwesomeIcon icon={faSquareGithub} style={{ fontSize: '25px', color: 'white' }} /> </a>
                                <a href='https://nath1710.github.io/portfolio/' style={{ textDecoration: 'none' }}> <FontAwesomeIcon icon={faGlobe} style={{ fontSize: '23px', color: 'white' }} /> </a>
                            </div>
                        </div>
                    </div>
                    <div className='card text-light text-center col-md-3 rounded-5' style={{ height: 'auto' }}>
                        <div className='d-flex justify-content-center align-items-center' style={{ height: '12rem' }}>
                            <div className='profile-card-image' >
                                <img src={yarom} alt='Yarom Vargas' className='card-img-top profile-card-img' />
                            </div>
                        </div>
                        <div className='card-body d-flex flex-column justify-content-center card-info' style={{ backgroundColor: '#164A41' }}>
                            <h5 className='card-title'>Yarom Vargas</h5>
                            <p className='card-text' style={{ fontSize: '14px' }}>Desarrollador Full-Stack con formación intensiva en tecnologías modernas y experiencia práctica en la creación de aplicaciones web dinámicas. Enfocado en el aprendizaje constante y la mejora continua, me adapto con facilidad a nuevos entornos y desafíos tecnológicos.</p>
                            <div className='d-flex justify-content-center gap-2'>
                                <a href='https://www.linkedin.com/in/yaromvp/' style={{ textDecoration: 'none' }}> <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: '25px', color: 'white' }} /> </a>
                                <a href='https://github.com/yaromvp' style={{ textDecoration: 'none' }}> <FontAwesomeIcon icon={faSquareGithub} style={{ fontSize: '25px', color: 'white' }} /> </a>
                                <a href='' style={{ textDecoration: 'none' }}> <FontAwesomeIcon icon={faGlobe} style={{ fontSize: '23px', color: 'white' }} /> </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-8 text-light text-center my-4 pt-3 px-5 rounded-pill' style={{ backgroundColor: '#164A41' }}>
                    <h5 className='m-0'>Tecnologias y Herramientas utilizadas</h5>
                    <Techstack />
                </div>
            </section>

            {/* Features Section */}
            <section>
                <div className='d-flex flex-column gap-3 align-items-start justify-content-center' style={{
                    backgroundImage: `url(${features})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: 'calc(100vh)',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div className='row'>
                        <div className='col-md-1'>
                        </div>
                        <div className='col-md-5'>
                            <h2 className='mb-3'>¿Qué hace única a Landsquare?</h2>
                            <p className='mb-3' style={{ fontSize: 'x-large' }}>
                                Con Landsquare, puedes publicar y encontrar terrenos en cualquier parte de Latinoamérica
                                de manera fácil y rápida.<br />
                            </p>
                            <p className='mb-3' style={{ fontSize: 'x-large' }}>
                                Nuestra plataforma ofrece:
                                <ul>
                                    <li>Una experiencia de usuario intuitiva.</li>
                                    <li>Integración de Google Maps para una búsqueda más precisa.</li>
                                    <li>Una amplia gama de funcionalidades.</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Future Section */}
            <section>
                <div className='d-flex flex-column gap-3 align-items-center justify-content-center' style={{
                    backgroundImage: `url(${future})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: 'calc(100vh)',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div className='col-md-10 mb-5 shadow-text'>
                        <h2>Nuestro Futuro</h2>
                        <p style={{ fontSize: 'x-large' }}>
                            Planeamos expandir Landsquare para incluir:
                            <ul>
                                <li>Agentes inmobiliarios.</li>
                                <li>Herramientas de Administración.</li>
                                <li>Llegar a nuevos mercados.</li>
                            </ul>
                        </p>
                    </div>
                    <div className='row d-flex justify-content-evenly aling-items-center mt-5 text-center shadow-text'>
                        <div className='col-md-5'>
                            <h4 className=''>¡Únete a nosotros encuentra el terreno ideal!</h4>
                            <Link to='/lands'>
                                <button type='button' className='login-button btn btn-primary btn-lg mt-1'>¡Explora!</button>
                            </Link>
                        </div>
                        <div className='col-md-5'>
                            <h4 className=''>Regístrate ahora y publica tu terreno</h4>
                            <Link to='/signup'>
                                <button type='button' className='login-button btn btn-primary btn-lg mt-1'>¡Regístrate!</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs2;