import React from "react";

export const Login = () => {
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
                <h2 className="text-center mb-4" style={{ fontWeight: "bold", color: "#1E3A5F" }}>Welcome Back</h2>
                <p className="text-center text-muted">Log in to continue</p>

                <form>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control border-0 shadow-sm" placeholder="Enter your email" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control border-0 shadow-sm" placeholder="Enter your password" required />
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="rememberMe" />
                            <label className="form-check-label text-muted" htmlFor="rememberMe">Remember me</label>
                        </div>
                        <a href="#" className="text-decoration-none" style={{ color: "#5A189A" }}>Forgot password?</a>
                    </div>

                    <button className="btn w-100 mt-4" style={{
                        background: "linear-gradient(135deg, #1E3A5F, #4A69BB, #8FAADC)", // Azul oscuro + Morado elegante
                        color: "#fff",
                        fontWeight: "bold",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "none",
                        transition: "0.3s"
                    }}>Sign In</button>

                    <div className="text-center mt-3">
                        <p className="text-muted">Don't have an account? <a href="#" className="text-decoration-none" style={{ color: "#1E1E50" }}>Sign Up</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};
