import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoLS from '../../img/LandSquare-small.png';
import { Context } from "../store/appContext";
import Search from "../component/Search.jsx";


export const Navbar = () => {
	const [shouldShowNavbar, setShouldShowNavbar] = useState(true);
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const location = useLocation();
	const [isScrolled, setIsScrolled] = useState(false);

	const shouldShowPrivateButtons = store.token;

	const shouldBeAbsolute = location.pathname != "/";

	// useEffect(() => {
	// 	if (store.token) actions.fetchIsAdmin();
	// }, [store.token]);

	useEffect(() => {
		setShouldShowNavbar(location.pathname === "/panel" ? false : true);
	}, [location.pathname])


	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		shouldShowNavbar && (
			<nav className={`navbar ${isScrolled ? "down" : ""} ${shouldBeAbsolute ? "absolute" : ""}`}>
				<div className="container">
					<Link to="/">
						<img className="logo" src={logoLS} alt="Logo" />
					</Link>
					<div className="ml-auto d-flex justify-content-around align-items-baseline">
						<div className="sections">
							{/* // Mostrar estos enlaces solo si no estamos en /LoginAdmin */}
							{location.pathname !== "/LoginAdmin" && (
								<>
									<Link className="nav-link rounded" to="/lands">Terrenos</Link>
									<Link className="nav-link rounded" to="/">Buscar un agente</Link>
									<Link className="nav-link rounded" to="/aboutUs">Quiénes somos</Link>
								</>
							)}

							{/* Mostrar el enlace de login si no hay token y no estamos en /LoginAdmin */}
							{!store.token && location.pathname !== "/LoginAdmin" && (
								<Link className="nav-link" to="/login">Iniciar sesión</Link>
							)}

							{/* Mostrar botones privados si el token está presente */}
							{shouldShowPrivateButtons && (
								<div className="dropdown w-25">
									<button
										className="btn dropdown-toggle border-0 nav-link"
										type="button"
										id="accountDropdown"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										Cuenta
									</button>
									<ul className="dropdown-menu" aria-labelledby="accountDropdown">
										<li>
											<Link className="dropdown-item" to="/profile">Perfil</Link>
										</li>
										<li>
											<Link className="dropdown-item" to="/publish-land">Post</Link>
										</li>
										<li>
											<Link className="dropdown-item" to="/favorites">Favoritos</Link>
										</li>
										<li><hr className="dropdown-divider" /></li>
										<li>
											<button
												className="dropdown-item"
												onClick={() => {
													actions.clearToken();
													setIsAdmin(false);
													navigate("/");
												}}
											>
												Cerrar sesión
											</button>
										</li>
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>
			</nav>
		)
	);
};