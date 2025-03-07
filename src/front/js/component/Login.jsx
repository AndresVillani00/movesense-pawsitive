
import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate, Link } from "react-router-dom";
export const Login = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSend = { username, password }
        await actions.login(dataToSend);
        store.alert = { text: "", background: "primary", visible: false } ;
        if (store.isLogged) {
            navigate('/home')
        }
    }
    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{
            background: "#F4F4F7", // Fondo claro y limpio
            color: "#333" // Texto oscuro para contraste
        }}>
            <div className="card p-5 shadow-lg border-0" style={{
                maxWidth: "420px",
                width: "100%",
                background: "#FFFFFF", // Card blanca para elegancia
                borderRadius: "12px",
                border: "1px solid #DDD" // Borde sutil
            }}>
                 <Link to="/home" className="text-decoration-none text-muted mb-3">  <i className="fas fa-arrow-left"></i> go back home</Link>
                <h2 className="text-center mb-4" style={{ fontWeight: "bold", color: "#1E3A5F" }}>Welcome Back</h2>
                <p className="text-center text-muted">Log in to continue</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input onChange={(event) => setUsername(event.target.value)} value={username} type="text" className="form-control border-0 shadow-sm" placeholder="Enter your username" required />
                    </div>
                    <div className="mb-3 input-group">
                        <label className="form-label col-12">Password</label>
                        <input onChange={(event) => setPassword(event.target.value)} value={password} type={showPassword ? "text" : "password"} className="form-control border-0 shadow-sm" placeholder="Enter your password" required />
                        <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                            {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                        </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="rememberMe" />
                            <label className="form-check-label text-muted" htmlFor="rememberMe">Remember me</label>
                        </div>
                        <Link to="/home" className="text-decoration-none" style={{ color: "#5A189A" }}>Forgot password?</Link>
                    </div>
                    <div className="d-flex">
                        <button type="submit" className="btn w-100 mt-4" style={{
                            background: "linear-gradient(135deg, #1E3A5F, #4A69BB, #8FAADC)", // Azul oscuro + Morado elegante
                            color: "#fff",
                            fontWeight: "bold",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "none",
                            transition: "0.3s"
                        }}>Log In</button>
                        {/*<button type="reset" onClick={() => navigate('/home')} className="btn w-50 mt-4" style={{
                            background: "linear-gradient(135deg,rgb(55, 56, 56),rgb(93, 100, 119),rgb(204, 213, 231))",
                            color: "#fff",
                            fontWeight: "bold",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "none",
                            transition: "0.3s"
                        }}>Go Back</button>*/}
                    </div>
                    <div className="text-center mt-3">
                        <p className="text-muted">Don't have an account? <Link to={"/sign-up"} className="text-decoration-none" style={{ color: "#1E1E50" }}>Sign Up</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};