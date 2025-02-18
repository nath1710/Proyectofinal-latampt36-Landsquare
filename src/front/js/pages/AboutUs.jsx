import React from "react";
import '../../styles/AboutUs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faSquareGithub } from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import waves from '../../img/wave.png';
import nataly from '../../img/fotonataly.png';
import yarom from '../../img/fotoyarom.jpg';
import Techstack from "../component/Techstack.jsx";


const AboutUs = () => {

    return (
        <main >
            <div >
                <div className="info border"
                    style={{ position: "absolute", zIndex: "3", top: "13%", left: "20%" }}
                >
                    <div className="info-card">
                        <div className="profile-card-wrapper">
                            <div className="profile-card">
                                <div className="image-content">
                                    <span className="overlay"></span>
                                    <div className="profile-card-image">
                                        <img src={nataly} alt="nataly" className="profile-card-img" />
                                    </div>
                                </div>
                            </div>
                            <div className="profile-card-content">
                                <h2 className="name-card">Nataly Castañeda</h2>
                                <p className="description-card">Desarrolladora Full-Stack con formación en tecnologías modernas como JavaScript, React, Node.js, MySQL y Git. Experiencia en diseño e implementación de aplicaciones web dinámicas y funcionales, adquirida a través de proyectos académicos y estudios autodidactas.</p>
                                <div className="d-flex justify-content-center gap-2" >
                                    <a href="https://github.com/nath1710" style={{ textDecoration: "none" }}> <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: "25px", color: "white" }} /> </a>
                                    <a href="https://www.linkedin.com/in/nath1710/" style={{ textDecoration: "none" }}> <FontAwesomeIcon icon={faSquareGithub} style={{ fontSize: "25px", color: "white" }} /> </a>
                                    <a href="https://nath1710.github.io/portfolio/" style={{ textDecoration: "none" }}> <FontAwesomeIcon icon={faGlobe} style={{ fontSize: "23px", color: "white" }} /> </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="info border "
                    style={{ position: "absolute", zIndex: "3", top: "13%", left: "55%" }}
                >
                    <div className="info-card">
                        <div className="profile-card-wrapper">
                            <div className="profile-card">
                                <div className="image-content">
                                    <span className="overlay"></span>
                                    <div className="profile-card-image">
                                        <img src={yarom} alt="nataly" className="profile-card-img" />
                                    </div>
                                </div>
                            </div>
                            <div className="profile-card-content">
                                <h2 className="name-card">Yarom Vargas</h2>
                                <p className="description-card">Desarrollador Full-Stack con formación intensiva en tecnologías modernas y experiencia práctica en la creación de aplicaciones web dinámicas. Enfocado en el aprendizaje constante y la mejora continua, me adapto con facilidad a nuevos entornos y desafíos tecnológicos. Buscando siempre contribuir al desarrollo de proyectos innovadores que generen un impacto positivo.

                                </p>
                                <div className="d-flex justify-content-center gap-2">
                                    <a href="https://www.linkedin.com/in/yaromvp/" style={{ textDecoration: "none" }}> <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: "25px", color: "white" }} /> </a>
                                    <a href="https://github.com/yaromvp" style={{ textDecoration: "none" }}> <FontAwesomeIcon icon={faSquareGithub} style={{ fontSize: "25px", color: "white" }} /> </a>
                                    <a href="https://nath1710.github.io/portfolio/" style={{ textDecoration: "none" }}> <FontAwesomeIcon icon={faGlobe} style={{ fontSize: "23px", color: "white" }} /> </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section">
                <div className="wave wave1" style={{ backgroundImage: `url(${waves})` }}></div>
                <div className="wave wave2" style={{ backgroundImage: `url(${waves})` }}></div>
                <div className="wave wave3" style={{ backgroundImage: `url(${waves})` }}></div>
                <div className="wave wave4" style={{ backgroundImage: `url(${waves})` }}></div>
                <div style={{ background: "white", width: "100%", height: "40%", position: "absolute", bottom: "0px" }}>
                    <div className="text-black w-100 d-flex justify-content-center" style={{ padding: "125px 0px 0px 65px" }}>
                        {/*
                        <div style={{ backgroundImage: "linear-gradient(to right top, rgb(76, 118, 81), rgba(156, 201, 140, 1), rgb(23, 75, 64))", borderRadius: "25px 25px 25px 25px", width: "60%", height: "130px" }}>
                        */}
                        <div style={{ backgroundImage: "linear-gradient(to right top, rgb(76, 118, 81), rgba(156, 201, 140, 1), rgb(23, 75, 64))", borderRadius: "25px 25px 25px 25px", width: "987px", height: "115px" }}>
                            <h4 className="px-4 pt-3 text-white d-flex justify-content-center" >Tecnologias y Herramientas utilizadas</h4>
                            <Techstack />
                        </div>
                    </div>
                </div>
            </div>
        </main >
    );
};

export default AboutUs;