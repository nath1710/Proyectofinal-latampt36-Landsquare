import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoLS from '../../img/LandSquare-small.png';
import { Context } from "../store/appContext";


export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const location = useLocation();

	const shouldShowSignOutButton = store.token && location.pathname === "/";

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<img src={logoLS} alt="Logo" />
				</Link>
				<div className="ml-auto">
					{!store.token && (
						<button onClick={() => navigate("/login")} className="btn btn-primary">
							Log in
						</button>
					)}
					{shouldShowSignOutButton && (
						<button onClick={() => { actions.clearToken(); navigate("/login"); }} className="btn btn-danger">
							Sign out
						</button>
					)}
				</div>
			</div>
		</nav>
	);
};