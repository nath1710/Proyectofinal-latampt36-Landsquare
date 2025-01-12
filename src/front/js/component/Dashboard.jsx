import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/Panel.css";
import {
    BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill,
    BsFilePostFill
} from "react-icons/bs";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BiSolidDashboard } from "react-icons/bi";

const Dashboard = () => {
    const data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];

    const { store } = useContext(Context);

    const [lands, setLands] = useState([]);
    const [users, setUsers] = useState([]);

    const fetchLands = async () => {
        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/lands");

            if (!response.ok) throw new Error("Error al cargar terrenos");

            const data = await response.json();
            setLands(data.announcements);
        } catch (error) {
            console.error(error.message);
        }
    }

    const fetchUsers = async () => {
        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/users");

            if (!response.ok) throw new Error("Error al cargar usuarios");

            const data = await response.json();
            console.log(data);
            setUsers(data.users);
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        fetchLands();
        fetchUsers();
    }, []);

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
                    <h1> {lands.length}</h1>
                </div>

                <div className="box">
                    <div className="card-inner">
                        <h3>CATEGORIAS</h3>
                        <BsFillGrid3X3GapFill className="card_icon" />
                    </div>
                    <h1> 12</h1>
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
                    <h1> 42</h1>
                </div>
            </div>
            <div className="charts">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
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
                        <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                        <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                    </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={500}
                        height={300}
                        data={data}
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
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </main >
    )
}

export default Dashboard;