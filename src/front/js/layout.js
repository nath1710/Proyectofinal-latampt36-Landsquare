import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import Admin, { Demo } from "./pages/LoginAdmin.jsx";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Private from "./pages/Private.jsx";
import Post from "./pages/Post.jsx";
import Favorites from "./pages/Favorites.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import Lands from "./pages/Lands.jsx";
import Announcement from "./pages/Announcement.jsx";
import EditAnnouncement from "./pages/EditAnnouncement.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import LoginAdmin from "./pages/LoginAdmin.jsx";
import Panel from "./pages/Panel.jsx";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div className="flex-grow-1">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Signup />} path="/signup" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Lands />} path="/lands" />
                        <Route element={<Profile />} path="/profile" />
                        <Route element={<Favorites />} path="/favorites" />
                        <Route element={<EditProfile />} path="/settings" />
                        <Route element={<Post />} path="/publish-land" />
                        <Route element={<Announcement />} path="/announcement/:id" />
                        <Route element={<AboutUs />} path="/aboutUs" />
                        <Route element={<EditAnnouncement />} path="/land-settings/:id" /> {/* pendiente de proteger */}
                        <Route element={<LoginAdmin />} path="/login-admin" />
                        <Route element={<Panel />} path="/panel" />
                        <Route element={<Private />} path="/private" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
