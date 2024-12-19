import React from "react";
import { Link } from "react-router-dom";
import logoLS from '../../img/LandSquare-small.png';

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<img src={logoLS} />
				</Link>
				<div className="ml-auto">
					<Link to="/Login">
						<button className="btn btn-primary">LogIn</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};
