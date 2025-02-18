import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import HeroImage from "../component/HeroImage.jsx";
import CardSlider from "../component/CardSlider.jsx";
import Content from "../component/Content.jsx";


export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div>
			<HeroImage />
			<CardSlider />
			<Content />

		</div>
	);
};
