import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import landsImage from '../../img/lands.jpg';
import logoLS from '../../img/LandSquare-small.png';
import formPhoto from '../../img/form-photo.jpg'

const Login = () => {
    const { actions } = useContext(Context)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formStatus, setFormStatus] = useState({ loading: false, ready: false, message: null });
    const navigate = useNavigate()

    const loginUser = async (e) => {
        e.preventDefault();
        setFormStatus({ ...formStatus, loading: true, ready: false });

        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            actions.setToken(data.token)
            if (response.ok) {
                setFormStatus({ loading: false, ready: true, message: "successful credentials!" });
            } else {
                setFormStatus({ loading: false, ready: false, message: data.message || "Error creating user" });
            }
        } catch (error) {
            console.error("Error creating user:", error);
            setFormStatus({ loading: false, message: "Server error. Please try again later." });
        }
    };

    useEffect(() => {
        if (formStatus.ready === true) {
            navigate("/Profile")

        }
    }, [formStatus.ready])

    return (
        <main className="imageformLogin d-flex flex-column gap-3 vh-100 align-items-center justify-content-center"
            style={{ backgroundImage: `url(${formPhoto}` }}>
            <form onSubmit={loginUser}>
                <div className="box-log">
                    <div className="left-form">
                        <img src={logoLS} />
                        <h1>Log in</h1>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                                id="exampleInputPassword1"
                            />
                            <Link to="/signup" className="p-1">
                                <p>Don't have an account yet? Register</p>
                            </Link>
                        </div>
                        {formStatus.loading ? (
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            <button type="submit" className="login-button btn btn-primary">Submit</button>
                        )}
                        {formStatus.message && (
                            <div
                                className={`alert mt-3 ${formStatus.message.includes("successfully") ? "alert-success" : "alert-danger"}`}
                                role="alert"
                            >
                                {formStatus.message}
                            </div>
                        )}
                    </div>
                    <div className="landsimage-container">
                        <img className="landsimage" src={landsImage} alt="lands" />
                    </div>
                </div>
            </form>
        </main>
    );
};

export default Login;