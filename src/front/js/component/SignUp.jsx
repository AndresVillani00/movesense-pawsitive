import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";


export const SignUp = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const dataToSend = {
            username,
            email,
            password,
        }
        
        await actions.signup(dataToSend);

        if (store.isLogged && !store.isVeterinario) {
            store.alert = { text: "", background: "primary", visible: false };
            navigate('/home');
        }
    }

    const validatePassword = async (value) => {
        const isValid = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if(!isValid.test(value)){
            setError(true)
        } else{
            setError(false)
        }
        setPassword(value)
    }

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sección Izquierda */}
                <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white p-5 text-center"
                    style={{
                        background: "linear-gradient(135deg, #1B365D, #4A69BB, #F5EFDE)",
                        minHeight: "100vh",
                        fontFamily: "'Poppins', sans-serif"
                    }}>

                    <h1 className="fw-bold display-4" style={{ color: "#F5EFDE" }}>Join our community</h1>
                    <p className="fs-5 mt-3" style={{ color: "#F5EFDE" }}>
                        Pawsitive, the wellness platform for your pets
                    </p>
                </div>

                {/* Sección Derecha - Formulario */}
                <div className="col-md-6 d-flex flex-column justify-content-center align-items-center"
                    style={{ fontFamily: "'Montserrat', sans-serif", background: "#F5EFDE", minHeight: "100vh" }}>

                    {/* Formulario */}
                    <div className="card p-5 shadow-lg border-0" style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}>
                        <h3 className="text-center fw-bold mb-4" style={{ color: "#1B365D" }}>Create your account</h3>
                        <form onSubmit={handleSubmit} className="row g-3">
                            {/* Campo Username */}
                            <div className="col-12">
                                <label className="form-label fw-semibold">Username</label>
                                <div className="input-group">
                                    <span className="input-group-text">@</span>
                                    <input onChange={(event) => setUsername(event.target.value)} value={username} type="text" className="form-control" placeholder="Write your username" required />
                                </div>
                            </div>

                            {/* Campo Email */}
                            <div className="col-12">
                                <label className="form-label fw-semibold">Email</label>
                                <input onChange={(event) => setEmail(event.target.value)} value={email} type="email" className="form-control" placeholder="name@example.com" required />
                            </div>

                            {/* Campo Password */}
                            <div className="col-12">
                                <label className="form-label fw-semibold">Password</label>
                                <div className="input-group">
                                    <input onChange={(event) => validatePassword(event.target.value)} value={password} type={showPassword ? "text" : "password"} className="form-control" required />
                                    <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                                        {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                                    </span>
                                </div>
                            </div>

                            <div className="col-12 text-center">
                                <div className="d-flex justify-content-center gap-3">
                                    <button
                                        className="btn fw-bold" type="submit"
                                        style={{ color: "white", 
                                            background:"#ff6100", 
                                            border: "#ff6100",
                                            borderRadius: "30px",
                                            padding: "10px 20px"
                                        }}>
                                        Sign Up
                                    </button>
                                </div>
                            </div>

                            <button className="btn d-flex justify-content-center align-items-center rounded-pill mt-3" style={{ color: "#1B365D" }} type="button">
                                <i className="fab fa-google me-2" ></i> Sign up with Google
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
