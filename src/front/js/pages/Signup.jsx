import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";



const Signup = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [formStatus, setFormStatus] = useState({ loading: false, ready: false, message: null });
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadedCountries = actions.getCountries();
        setCountries(loadedCountries);
    }, [actions]);

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
        <main className=" auth-background d-flex flex-column gap-3 vh-100 align-items-center justify-content-center">
            <h1>Sign up</h1>
            <form onSubmit={registerUser}>
                <div className="box-form">
                    <div className="cd1">
                        <p style={{ color: "rgba(178,35,35,255)", fontWeight: "bold" }}>Fields marked with an * are mandatory</p>
                        <div className="mb-3">
                            <label htmlFor="InputEmail1" className="form-label">Email address &nbsp;
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
                            <label htmlFor="InputPassword1" className="form-label">Password &nbsp;
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
                            <label htmlFor="InputName" className="form-label">Name &nbsp;
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
                            <label htmlFor="countries" className="form-label">Country &nbsp;
                                <span style={{ color: "rgba(178,35,35,255)", fontWeight: "bold" }} >*</span> </label>
                            <select
                                id="countries"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="form-select"
                            >
                                <option value="">Select a country</option>
                                {countries.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="InputAddress" className="form-label">Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="form-control"
                                id="exampleInputAddress1"
                            />
                        </div>
                        {formStatus.loading ? (
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            <button type="submit" className="signup-button btn btn-primary">Submit</button>
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
                </div>
            </form>
        </main >
    );
};

export default Signup;
