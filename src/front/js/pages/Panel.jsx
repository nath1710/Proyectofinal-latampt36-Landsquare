import React, { useState } from "react";
import "../../styles/Panel.css";
import Sidebar from "../component/Sidebar.jsx";
import Dashboard from "../component/Dashboard.jsx";
import UsersAdmin from "./UsersAdmin.jsx";
import PostsAdmin from "./PostsAdmin.jsx";

const Panel = () => {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
    const [showUsersTable, setShowUsersTable] = useState(false);
    const [showPostsTable, setShowPostsTable] = useState(false);

    // Define la función OpenSidebar
    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle);
    };

    const handleUsersClick = () => {
        setShowUsersTable(true);
        setShowPostsTable(false); // Ocultar PostsAdmin si se muestra UsersAdmin
    };

    const handlePostsClick = () => {
        setShowPostsTable(true);
        setShowUsersTable(false); // Ocultar UsersAdmin si se muestra PostsAdmin
    };

    return (
        <div
            className="grid-container"
            style={{
                margin: "0",
                padding: "0",
                backgroundColor: "#1d2634",
                color: "#9e9ea4",
                height: "100%",
            }}
        >

            <Sidebar
                openSidebarToggle={openSidebarToggle}
                OpenSidebar={OpenSidebar}
                handleUsersClick={handleUsersClick}
                handlePostsClick={handlePostsClick}
            />

            {showUsersTable ? (
                <UsersAdmin />
            ) : showPostsTable ? (
                <PostsAdmin />
            ) : (
                <Dashboard />
            )}
        </div>
    );
};

export default Panel;
