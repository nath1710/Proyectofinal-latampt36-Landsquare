import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/Panel.css";
import {
    BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill,
    BsFilePostFill
} from "react-icons/bs";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { BiSolidDashboard } from "react-icons/bi";

const Dashboard = () => {
    const { store } = useContext(Context);

    const [lands, setLands] = useState([]);
    const [users, setUsers] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [dailyPostsData, setDailyPostsData] = useState([]);

    // Función para cargar publicaciones (lands)
    const fetchLands = async () => {
        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/lands");
            if (!response.ok) throw new Error("Error al cargar terrenos");

            const data = await response.json();
            setLands(data.announcements);
        } catch (error) {
            console.error(error.message);
        }
    };

    // Función para cargar usuarios
    const fetchUsers = async () => {
        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/users");
            if (!response.ok) throw new Error("Error al cargar usuarios");

            const data = await response.json();
            setUsers(data.users);
        } catch (error) {
            console.error(error.message);
        }
    };

    // Procesar datos para las gráficas principales
    const prepareChartData = () => {
        const userCategories = users.reduce((acc, user) => {
            const category = user.role || "Sin Rol";
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        const announcementCategories = lands.reduce((acc, announcement) => {
            const category = announcement.category || "Sin Categoría";
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        const combinedData = Object.keys(userCategories).map(key => ({
            name: key,
            users: userCategories[key] || 0,
            announcements: announcementCategories[key] || 0,
        }));

        setChartData(combinedData);
    };

    // Función para procesar la fecha y formatearla
    const formatDate = (dateString) => {
        if (!dateString) {
            return "Fecha no disponible";
        }

        const date = new Date(dateString);

        if (isNaN(date)) {
            return "Fecha no válida";
        }

        return date.toLocaleDateString();
    };

    // Función para procesar las publicaciones diarias
    const prepareDailyPostsData = () => {
        const dailyPosts = lands.reduce((acc, announcement) => {
            const date = formatDate(announcement.creation_date);
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const formattedData = Object.keys(dailyPosts).map(date => ({
            date,
            posts: dailyPosts[date],
        }));

        setDailyPostsData(formattedData);
    };

    useEffect(() => {
        fetchLands();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (lands.length && users.length) {
            prepareChartData();
        }
    }, [lands, users]);

    useEffect(() => {
        if (lands.length) {
            prepareDailyPostsData();
        }
    }, [lands]);

    return (
        <main className="main-container">
            <div className="main-title">
                <h3>TABLERO</h3>
            </div>
            <div className="main-cards">
                <div className="box">
                    <div className="card-inner">
                        <h3>ANUNCIOS</h3>
                        <BsFilePostFill className="card_icon" />
                    </div>
                    <h1>{lands.length}</h1>
                </div>

                <div className="box">
                    <div className="card-inner">
                        <h3>USUARIOS</h3>
                        <BsPeopleFill className="card_icon" />
                    </div>
                    <h1>{users.length}</h1>
                </div>
                <div className="box">
                    <div className="card-inner">
                        <h3>ALERTAS</h3>
                        <BsFillBellFill className="card_icon" />
                    </div>
                    <h1>42</h1>
                </div>
            </div>
            <div className="charts">
                {/* Gráfica Users */}
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="users" fill="#8884d8" />
                        <Bar dataKey="announcements" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>

                {/* Gráfica de publicaciones diarias */}
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        width={500}
                        height={300}
                        data={dailyPostsData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="posts" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </main>
    );
};

export default Dashboard;
