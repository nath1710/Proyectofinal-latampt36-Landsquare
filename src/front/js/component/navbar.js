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
	const [isAdmin, setIsAdmin] = useState(false)

	const shouldShowPrivateButtons = store.token;

	const shouldBeAbsolute = location.pathname != "/";

	const fetchIsAdmin = async () => {
		try {
			const response = await fetch(`${process.env.BACKEND_URL}/api/user`, {
				headers: {
					Authorization: `Bearer ${store.token}`
				},
			});
			if (!response.ok) throw new Error("Error al cargar usuario");
			const data = await response.json();
			setIsAdmin(data.role === "Admin");
		} catch (error) {
			console.error("Error al cargar los usuario:", error);
		}
	};

	useEffect(() => {
		if (store.token) fetchIsAdmin()
	}, [store.token])

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
						{isAdmin ?
							(<Link className="nav-link rounded" to="/private">Admin dashboard </Link>)
							: (<><Link className="nav-link rounded" to="/lands">Buy Land </Link>
								<Link className="nav-link rounded" to="/">Find an Agent</Link>
								<Link className="nav-link rounded" to="/aboutUs">About us</Link></>)}

						{!store.token && (
							<Link className="nav-link" to="/login">
								Log in
							</Link>
						)}
						{!store.token && ("")}
						{shouldShowPrivateButtons && (
							<div className="dropdown w-25">
								<button
									className="btn dropdown-toggle border-0 nav-link"
									type="button"
									id="accountDropdown"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									Account
								</button>
								<ul className="dropdown-menu" aria-labelledby="accountDropdown">
									{shouldShowPrivateButtons && (
										<>
											<li>
												<Link className="dropdown-item" to="/profile">
													Profile
												</Link>
											</li>
											<li>
												<Link className="dropdown-item" to="/publish-land">
													Post
												</Link>
											</li>
											<li>
												<Link className="dropdown-item" to="/favorites">
													Favorites
												</Link>
											</li>
											<li>
												<hr className="dropdown-divider" />
											</li>
											<li>
												<button
													className="dropdown-item"
													onClick={() => {
														actions.clearToken();
														setIsAdmin(false)
														navigate("/");
													}}
												>
													Sign out
												</button>
											</li>
										</>
									)}
								</ul>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav >
	);
};