import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UsersAdmin = () => {
    const [users, setUsers] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(process.env.BACKEND_URL + "/api/users");
                const data = await response.json();

                if (Array.isArray(data.users)) {
                    setUsers(data.users);
                    prepareChartData(data.users);
                } else {
                    console.error("La respuesta de la API no tiene un array de usuarios válido");
                }
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            }
        };

        fetchUsers();
    }, []);

    const prepareChartData = (users) => {
        const userCategories = users.reduce((acc, user) => {
            const category = user.role || "Sin Rol";
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        const data = Object.keys(userCategories).map(key => ({
            name: key,
            users: userCategories[key],
        }));

        setChartData(data);
    };

    // Calcular usuarios a mostrar en la página actual
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Cambiar de página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Crear botones de paginación
    const totalPages = Math.ceil(users.length / usersPerPage);
    const paginationButtons = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div className="users-admin-container d-flex p-5 align-items-center">
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Activo</th>
                            <th>Nombre</th>
                            <th>País</th>
                            <th>Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>{user.is_active ? "Sí" : "No"}</td>
                                <td>{user.name}</td>
                                <td>{user.country}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    {paginationButtons.map(pageNumber => (
                        <button
                            key={pageNumber}
                            className={`btn ${pageNumber === currentPage ? "btn-primary" : "btn-secondary"}`}
                            onClick={() => handlePageChange(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    ))}
                </div>
            </div>

            <div className="chart-container" style={{ minWidth: "100%" }}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
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
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UsersAdmin;
