import React, { Component, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faSquareGithub } from '@fortawesome/free-brands-svg-icons'
import { Link, useLocation } from "react-router-dom";

export const Footer = ({ overrideHide }) => {

	const [shouldShowFooter, setShouldShowFooter] = useState(true);

	const location = useLocation();

	useEffect(() => {
		setShouldShowFooter(location.pathname === "/lands" || location.pathname === "/favorites" ? false : true);
	}, [location.pathname])

	return (
		<>
			{(shouldShowFooter || overrideHide) && <footer className="footer mt-auto py-3 text-center">
				<hr />
				<h5>
					Made by
				</h5>
				<div className="d-flex justify-content-center align-item-center gap-5">
					<div className="d-flex justify-content-center gap-1">
						<span>Yarom Vargas</span>
						<a href="" className="icons" style={{ textDecoration: "none", color: "white" }}> <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: "25px" }} /> </a>
						<a href="https://github.com/yaromvp" className="icons" style={{ textDecoration: "none", color: "white" }}> <FontAwesomeIcon icon={faSquareGithub} style={{ fontSize: "25px" }} /> </a>

					</div>
					<div className="d-flex justify-content-center gap-1">
						<span>Nataly Hernandez</span>
						<a href="https://github.com/nath1710" style={{ textDecoration: "none", color: "white" }}> <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: "25px" }} /> </a>
						<a href="https://www.linkedin.com/in/nath1710/" style={{ textDecoration: "none", color: "white" }}> <FontAwesomeIcon icon={faSquareGithub} style={{ fontSize: "25px" }} /> </a>
					</div>
				</div>
			</footer >}
		</>
	);
};
