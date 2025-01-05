import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoLS from '../../img/LandSquare-small.png';
import { Context } from "../store/appContext";
import Search from "../component/Search.jsx";


export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
	const location = useLocation();
	const [isScrolled, setIsScrolled] = useState(false);

	const shouldShowPrivateButtons = store.token;

	const shouldBeAbsolute = location.pathname != "/";

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
		<nav className={`navbar ${isScrolled ? "down" : ""} ${shouldBeAbsolute ? "absolute" : ""}`}>
			<div className="container">
				<Link to="/">
					<img className="logo" src={logoLS} alt="Logo" />
				</Link>
				<div className="ml-auto d-flex justify-content-around align-items-baseline">
					<div className="sections">
						<Link to="/lands">Buy Land </Link>
						<Link to="/">Find an Agent</Link>
						<Link to="/">Contact us</Link>
						{!store.token && ("")}
						{shouldShowPrivateButtons && (
							<Link
								to="/favorites"
							>
								Favorites
							</Link>
						)}
						{!store.token && ("")}
						{shouldShowPrivateButtons && (
							<Link
								to="/publish-land"
							>
								Post
							</Link>
						)}
						{!store.token && ("")}
						{shouldShowPrivateButtons && (
							<Link
								to="/profile"
							>
								Account
							</Link>
						)}
						{!store.token && (
							<Link to="/login">
								Log in
							</Link>
						)}
						{shouldShowPrivateButtons && (
							<Link
								to="/"
								onClick={() => {
									actions.clearToken();
								}}
							>
								Sign out
							</Link>
						)}
					</div>
				</div>
			</div>
		</nav >
	);
};