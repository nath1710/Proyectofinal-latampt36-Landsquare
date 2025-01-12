import React, { useState } from "react";
import "../../styles/Panel.css";
import Header from "../component/Header.jsx";
import Sidebar from "../component/Sidebar.jsx";
import Dashboard from "../component/Dashboard.jsx";

const Panel = () => {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle)
    }


    return (
        <div className="grid-container" style={{
            margin: "0",
            padding: "0",
            backgroundColor: "#1d2634",
            color: "#9e9ea4"
        }}>
            <Header OpenSidebar={OpenSidebar} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <Dashboard />
        </div>

    )
}

export default Panel;