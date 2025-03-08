import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate, Link } from "react-router-dom";


export const SignUp = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [selectedRole, setSelectedRole] = useState(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [is_buyer, setBuyer] = useState(false);
    const [is_seller, setSeller] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedRole) {
            store.alert = { text: "Seleccione un rol", background: "danger", visible: true };
            return;
        }

        const dataToSend = {
            username,
            email,
            password,
            is_buyer,
            is_seller
        }
        await actions.signup(dataToSend);
        store.alert = { text: "", background: "primary", visible: false };
        if (store.isLogged) {
            navigate('/home');
        }
    }

    const handleBuyer = (event) => {
        event.preventDefault();
        setSelectedRole("buyer");
        setBuyer(true);
        setSeller(false);
    }

    const handleSeller = (event) => {
        event.preventDefault();
        setSelectedRole("seller");
        setBuyer(false);
        setSeller(true);
    }

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sección Izquierda */}
                <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white p-5 text-center"
                    style={{
                        background: "linear-gradient(135deg, #1E3A5F, #4A69BB, #8FAADC)",
                        minHeight: "100vh",
                        fontFamily: "'Poppins', sans-serif"
                    }}>

                    <h1 className="fw-bold display-4">Únete a la comunidad de arte</h1>
                    <p className="fs-5 mt-3">
                        Vende, descubre y colecciona arte de todo el mundo.
                    </p>
                    <ul className="list-unstyled mt-3">
                        <li> 🎨  Sube y vende tus obras fácilmente</li>
                        <li> 📅  Explora eventos artísticos</li>
                        <li> 💰  Conéctate con compradores y artistas</li>
                    </ul>
                    <button className="btn btn-lg btn-light text-dark mt-4 px-5 py-3 fw-bold rounded-pill shadow-lg">
                        ¡Empieza hoy!
                    </button>
                </div>

                {/* Sección Derecha - Formulario */}
                <div className="col-md-6 d-flex flex-column justify-content-center align-items-center"
                    style={{ fontFamily: "'Montserrat', sans-serif", background: "#F8F9FA", minHeight: "100vh" }}>

                    {/* Formulario */}
                    <div className="card p-5 shadow-lg border-0" style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}>
                        <h3 className="text-center fw-bold mb-4">Crea tu cuenta</h3>
                        <form onSubmit={handleSubmit} className="row g-3">
                            {/* Campo Username */}
                            <div className="col-12">
                                <label className="form-label fw-semibold">Username</label>
                                <div className="input-group">
                                    <span className="input-group-text">@</span>
                                    <input onChange={(event) => setUsername(event.target.value)} value={username} type="text" className="form-control" placeholder="Elige el username más original" required />
                                </div>
                            </div>

                            {/* Campo Email */}
                            <div className="col-12">
                                <label className="form-label fw-semibold">Correo Electrónico</label>
                                <input onChange={(event) => setEmail(event.target.value)} value={email} type="email" className="form-control" placeholder="name@example.com" required />
                            </div>

                            {/* Campo Password */}
                            <div className="col-12">
                                <label className="form-label fw-semibold">Contraseña</label>
                                <div className="input-group">
                                    <input
                                        onChange={(event) => setPassword(event.target.value)}
                                        value={password}
                                        type={showPassword ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Mínimo 8 caracteres"
                                        required
                                    />
                                    <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                                        {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                                    </span>
                                </div>
                            </div>

                            {/* Selección de Rol */}
                            <div className="col-12 text-center">
                                <label className="form-label fw-semibold">Selecciona tu rol</label>
                                <div className="d-flex justify-content-center gap-3">
                                    <button
                                        className={`btn ${selectedRole === "buyer" ? "btn-primary active" : "btn-outline-primary"}`}
                                        style={{
                                            borderRadius: "30px",
                                            padding: "10px 20px",
                                            fontWeight: "bold"
                                        }}
                                        onClick={(event) => handleBuyer(event)}>
                                        🛒 Comprador
                                    </button>
                                    <button
                                        className={`btn ${selectedRole === "seller" ? "btn-primary active" : "btn-outline-primary"}`}
                                        style={{
                                            borderRadius: "30px",
                                            padding: "10px 20px",
                                            fontWeight: "bold"
                                        }}
                                        onClick={(event) => handleSeller(event)}>
                                        🎨 Vendedor
                                    </button>
                                </div>
                            </div>

                            <button className="btn btn-dark mt-3" type="submit">Registrarse</button>
                            <button className="btn btn-outline-danger d-flex justify-content-center align-items-center rounded-pill mt-3" type="button">
                                <i className="fab fa-google me-2"></i> Registrarse con Google
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
