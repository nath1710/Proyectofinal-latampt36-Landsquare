import React, { useState } from "react";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    BsGrid1X2Fill, BsFillArchiveFill, BsPeopleFill,
    BsListCheck, BsMenuButtonWideFill, BsFillGearFill
} from "react-icons/bs";
import "../../styles/Panel.css";
import logoLSwhite from '../../img/LandSquare-small-white.png';

const Sidebar = ({ openSidebarToggle, OpenSidebar, handleUsersClick, handlePostsClick }) => {
    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
            <div className="sidebar-title">
                <div className="sidebar-brand">
                    <img src={logoLSwhite} alt="Logo" style={{ width: "200px" }} />
                </div>
                <span className="icon close_icon" onClick={OpenSidebar}><FontAwesomeIcon icon={faXmark} /></span>
            </div>
            <ul className="sidebar-list">
                <li className="sidebar-list-item">
                    <a href="">
                        <BsGrid1X2Fill className="icon" /> Panel de control
                    </a>
                </li>
                <li className="sidebar-list-item" onClick={handlePostsClick}>
                    <a href="">
                        <BsFillArchiveFill className="icon" /> Anuncios
                    </a>
                </li>
                <li className="sidebar-list-item" onClick={handleUsersClick}>
                    <a href="">
                        <BsPeopleFill className="icon" /> Usuarios
                    </a>
                </li>
                <li className="sidebar-list-item">
                    <a href="">
                        <BsMenuButtonWideFill className="icon" /> Informes
                    </a>
                </li>
                <li className="sidebar-list-item">
                    <a href="">
                        <BsFillGearFill className="icon" /> Configuración
                    </a>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;
