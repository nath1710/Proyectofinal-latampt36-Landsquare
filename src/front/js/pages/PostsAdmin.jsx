import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
} from "recharts";

const PostsAdmin = () => {
    const [posts, setPosts] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    const fetchPosts = async () => {
        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/lands");
            const data = await response.json();
            console.log(data)

            if (Array.isArray(data.announcements)) {
                setPosts(data.announcements);
                prepareChartData(data.announcements);
            } else {
                console.error(
                    "La respuesta de la API no tiene un array de publicaciones válido"
                );
            }
        } catch (error) {
            console.error("Error al obtener publicaciones:", error);
        }
    };
    useEffect(() => {
        fetchPosts();
    }, []);

    const prepareChartData = (posts) => {
        const postSizes = posts.reduce((acc, post) => {
            const size = post.size || "Desconocido";
            acc[size] = (acc[size] || 0) + 1;
            return acc;
        }, {});

        const data = Object.keys(postSizes).map((key) => ({
            name: key,
            posts: postSizes[key],
        }));

        setChartData(data);
    };

    // Calcular publicaciones a mostrar en la página actual
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    // Cambiar de página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Crear botones de paginación
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const paginationButtons = Array.from(
        { length: totalPages },
        (_, index) => index + 1
    );

    return (
        <div className="posts-admin-container d-flex p-5 align-items-center">
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Post ID</th>
                            <th>User ID</th>
                            <th>Cantidad de Imágenes</th>
                            <th>Título</th>
                            <th>Precio</th>
                            <th>Tamaño</th>
                            <th>Fecha de Creación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td>{post.user_id}</td>
                                <td>{post.images.length}</td>
                                <td>{post.title}</td>
                                <td>${post.price}</td>
                                <td>{post.size}</td>
                                <td>{new Date(post.creation_date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    {paginationButtons.map((pageNumber) => (
                        <button
                            key={pageNumber}
                            className={`btn ${pageNumber === currentPage ? "btn-primary" : "btn-secondary"
                                }`}
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
                        <YAxis><Label
                            style={{
                                textAnchor: "middle",
                                fontSize: "130%",
                                fill: "white",
                            }}
                            angle={270}
                            value={"Price"} />
                        </YAxis>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="posts" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PostsAdmin;
