import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate, Link } from "react-router-dom";
import { Alert } from "./Alert.jsx";


export const Forgot = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSend = { username, password }

        if (password === newPassword){
            const result = await actions.loginNewPassword(dataToSend);
            // Solo si el login fue exitoso procedemos con la lógica
            if (result && result.success) {
                if (result.isVeterinario) {
                    actions.setActiveKey('alerts');
                } else if (result.mascotasCount < 1) {
                    actions.setActiveKey('register');
                } else {
                    actions.setActiveKey('existing');
                }
                // Como tuvimos éxito, redirigimos
                navigate('/home');
            }
        } else {
            store.alert = { text: "Las Contraseñas no coinciden", background: "danger", visible: true };
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

    const validateNewPassword = (value) => {
        const isValid = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if(!isValid.test(value)){
            setError(true)
        } else{
            setError(false)
        }
        setNewPassword(value)
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
                <Link to="/home" className="text-decoration-none mb-3" style={{ color: "#1B365D" }}>  <i className="fas fa-arrow-left"></i> Volver</Link>
                <h2 className="text-center mb-4" style={{ fontWeight: "bold", color: "#1B365D" }}>Recuperar nueva Contraseña</h2>
                <Alert />
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input onChange={(event) => setUsername(event.target.value)} value={username} type="text" className="form-control border-0 shadow-sm" placeholder="Introduce tu Usuario o Email" required />
                    </div>
                    <div className="mb-3 input-group">
                        <label className="form-label col-12">Nueva Contraseña</label>
                        <input onChange={(event) => validatePassword(event.target.value)} value={password} type={showPassword ? "text" : "password"} className={`form-control ${error ? "is-invalid" : "is-valid"} border-0 shadow-sm`} placeholder="Introduce tu Contraseña" required />
                        <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                            {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                        </span>
                    </div>
                    <div className="mb-3 input-group">
                        <label className="form-label col-12">Repite la nueva Contraseña</label>
                        <input onChange={(event) => validateNewPassword(event.target.value)} value={newPassword} type={showPassword ? "text" : "password"} className={`form-control ${error ? "is-invalid" : "is-valid"} border-0 shadow-sm`} placeholder="Introduce tu Contraseña" required />
                        <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                            {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                        </span>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn w-50 mt-4 fw-bold" style={{ color: "white", 
                            background:"#ff6100", 
                            border: "#ff6100",
                            borderRadius: "8px",
                            padding: "10px"
                        }}>Iniciar Sesión</button>
                    </div>
                </form>
            </div>
        </div>
    );
};