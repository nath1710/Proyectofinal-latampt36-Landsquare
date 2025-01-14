import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import landsImage from '../../img/lands.jpg';
import logoLS from '../../img/LandSquare-small.png';
import formPhoto from '../../img/form-photo.jpg'

const Signup = () => {
    const { actions, store } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [formStatus, setFormStatus] = useState({ loading: false, ready: false, message: null });
    const navigate = useNavigate();
    const countries = store.countries || [];

    useEffect(() => {
        actions.getCountries();
    }, []);

    const isFormValid = () => {
        if (!email || !password || !name || !country) {
            setFormStatus({ loading: false, ready: false, message: "All fields are required." });
            return false;
        }
        return true;
    };

    const registerUser = async (e) => {
        e.preventDefault();
        if (!isFormValid()) return;
        setFormStatus({ ...formStatus, loading: true, ready: false });

        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password, name, country, address })
            });

            const data = await response.json();
            if (response.ok) {
                setFormStatus({ loading: false, ready: true, message: "User successfully created! You will be redirected to Log in." });
            } else {
                setFormStatus({ loading: false, ready: false, message: data.message || "Error creating user" });
            }
        } catch (error) {
            console.error("Error creating user:", error);
            setFormStatus({ loading: false, message: "Server error. Please try again later." });
        }
    };

    useEffect(() => {
        if (formStatus.ready) {
            const timer = setTimeout(() => navigate("/login"), 1000);
            return () => clearTimeout(timer);
        }
    }, [formStatus.ready, navigate]);

    return (
        <main className=" imageformSignup d-flex flex-column gap-3 vh-100 align-items-center justify-content-center"
            style={{ backgroundImage: `url(${formPhoto}` }}>
            <form onSubmit={registerUser}>
                <div className="box-register">
                    <div className="left-form">
                        <h1>Regístrate</h1>
                        <p className='text-secondary fw-semibold'>Los campos marcados con <span style={{ color: 'rgba(178,35,35,255)' }}>*</span> son obligatorios</p>
                        <div className="mb-2">
                            <label htmlFor="InputEmail1" className="form-label">Correo Electrónico &nbsp;
                                <span style={{ color: "rgba(178,35,35,255)", fontWeight: "bold" }} >*</span></label>
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
                            <label htmlFor="InputPassword1" className="form-label">Contraseña &nbsp;
                                <span style={{ color: "rgba(178,35,35,255)", fontWeight: "bold" }} >*</span> </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                                id="exampleInputPassword1"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="InputName" className="form-label">Nombre Completo &nbsp;
                                <span style={{ color: "rgba(178,35,35,255)", fontWeight: "bold" }} >*</span> </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-control"
                                id="exampleInputName1"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="countries" className="form-label">País &nbsp;
                                <span style={{ color: "rgba(178,35,35,255)", fontWeight: "bold" }} >*</span> </label>
                            <select
                                id="countries"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="form-select"
                            >
                                <option value="">Selecciona un país</option>
                                {countries.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="InputAddress" className="form-label">Dirección</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="form-control"
                                id="exampleInputAddress1"
                            />
                            <Link to="/login" className="p-0">
                                <p>¿Ya tienes una cuenta? Inicia Sesión</p>
                            </Link>
                        </div>
                        {formStatus.loading ? (
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        ) : (
                            <div className="text-center">
                                <button type="submit" className="signup-button btn btn-primary">Registrarte</button>
                            </div>
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
        </main >
    );
};

export default Signup;
