import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate, Link } from "react-router-dom";
import { Alert } from "./Alert.jsx";


export const Login = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSend = { username, password, remember }
        await actions.login(dataToSend);
        
        if(store.isVeterinario){
            actions.setActiveKey('alerts')
        } else if(store.userMascotas.length < 1) {
            actions.setActiveKey('register')
        } else {
            actions.setActiveKey('existing')
        }

        if (store.isLogged) {
            navigate('/home');
        }
    }

    const validatePassword = (value) => {
        const isValid = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if(!isValid.test(value)){
            setError(true)
        } else{
            setError(false)
        }
        setPassword(value)
    }

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{
            background: "#F5EFDE", // Fondo claro y limpio
            color: "#333" // Texto oscuro para contraste
        }}>
            <div className="card p-5 shadow-lg border-0" style={{
                maxWidth: "420px",
                width: "100%",
                background: "#FFFFFF", // Card blanca para elegancia
                borderRadius: "12px",
                border: "1px solid #DDD" // Borde sutil
            }}>
                <Link to="/home" className="text-decoration-none mb-3" style={{ color: "#1B365D" }}>  <i className="fas fa-arrow-left"></i> go back home</Link>
                <h2 className="text-center mb-4" style={{ fontWeight: "bold", color: "#1B365D" }}>Welcome Back</h2>
                <p className="text-center" style={{ color: "#1B365D" }}>Log in to continue</p>
                <Alert />
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input onChange={(event) => setUsername(event.target.value)} value={username} type="text" className="form-control border-0 shadow-sm" placeholder="Enter your Username or Email" required />
                    </div>
                    <div className="mb-3 input-group">
                        <label className="form-label col-12">Password</label>
                        <input onChange={(event) => validatePassword(event.target.value)} value={password} type={showPassword ? "text" : "password"} className={`form-control ${error ? "is-invalid" : "is-valid"} border-0 shadow-sm`} placeholder="Enter your password" required />
                        <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                            {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                        </span>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="rememberMe" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                        <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn w-50 mt-4 fw-bold" style={{ color: "white", 
                            background:"#ff6100", 
                            border: "#ff6100",
                            borderRadius: "8px",
                            padding: "10px"
                        }}>Log In</button>
                    </div>
                    <div className="text-center mt-3">
                        <p className="text-muted">Don't have an account? <Link to={"/sign-up"} className="text-decoration-none" onClick={() => store.alert = { text: "", background: "primary", visible: false }} style={{ color: "#1E1E50" }}>Sign Up</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};