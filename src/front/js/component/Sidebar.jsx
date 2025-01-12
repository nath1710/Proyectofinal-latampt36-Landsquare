import React from "react";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill,
    BsListCheck, BsMenuButtonWideFill, BsFillGearFill
} from "react-icons/bs";
import "../../styles/Panel.css";
import logoLSwhite from '../../img/LandSquare-small-white.png';

const Sidebar = ({ openSidebarToggle, OpenSidebar }) => {
    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
            <div className="sidebar-title">
                <div className="sidebar-brand">
                    <img className="logo" src={logoLSwhite} alt="Logo" />
                </div>
                <span className="icon close_icon" onClick={OpenSidebar}><FontAwesomeIcon icon={faXmark} /></span>
            </div>
            <ul className="sidebar-list">
                <li className="sidebar-list-item">
                    <a href="">
                        <BsGrid1X2Fill className="icon" /> Panel de control
                    </a>
                </li>
                <li className="sidebar-list-item">
                    <a href="">
                        <BsFillArchiveFill className="icon" /> Productos
                    </a>
                </li>
                <li className="sidebar-list-item">
                    <a href="">
                        <BsFillGrid3X3GapFill className="icon" /> Categorías
                    </a>
                </li>
                <li className="sidebar-list-item">
                    <a href="">
                        <BsPeopleFill className="icon" /> Clientes
                    </a>
                </li>
                <li className="sidebar-list-item">
                    <a href="">
                        <BsListCheck className="icon" /> Inventario
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
    )
}

export default Sidebar;