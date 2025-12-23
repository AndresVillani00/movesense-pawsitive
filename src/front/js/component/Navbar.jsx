import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import logo from '../../img/LogoPawsitive.png';
import { Dropdown } from "react-bootstrap";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-light bg-white sticky-top shadow-sm">
            {/* Usamos container-fluid para aprovechar todo el ancho en móvil, o container si prefieres márgenes */}
            <div className="container-fluid container-lg d-flex align-items-center justify-content-between flex-nowrap">
                
                {/* 1. LOGO */}
                <Link to="/home" className="navbar-brand me-2">
                    <img src={logo} alt="Logo" width="50" height="50" className="d-inline-block align-text-top" style={{ objectFit: 'contain' }} />
                </Link>

                {/* 2. MENÚ CENTRAL (Iconos de navegación) */}
                {/* flex-grow-1 ayuda a distribuir el espacio si fuera necesario, pero aquí mantenemos el grupo unido */}
                <div className="d-flex gap-2 gap-md-4">
                    <button className="btn btn-link p-1 border-0" style={{ color: "#1B365D" }} onClick={() => navigate('/home')} title="Inicio">
                        <i className="fa-solid fa-house fa-lg"></i>
                    </button>
                    <button className="btn btn-link p-1 border-0" style={{ color: "#1B365D" }} onClick={() => navigate('/incidencias')} title="Incidencias">
                        <i className="fa-solid fa-paw fa-lg"></i>
                    </button>
                    <button className="btn btn-link p-1 border-0" style={{ color: "#1B365D" }} onClick={() => navigate('/about-us')} title="Sobre Nosotros">
                        <i className="fa-solid fa-users-rectangle fa-lg"></i>
                    </button>
                </div>

                {/* 3. SECCIÓN DE USUARIO (Derecha) */}
                <div className="d-flex align-items-center ms-2 gap-2">
                    
                    {store.isLogged ? (
                        <>
                            {/* Botón Premium: Icono en móvil, Texto en PC */}
                            <Link to="/payment" className="text-decoration-none">
                                <button className="btn fw-bold d-flex align-items-center justify-content-center" 
                                    style={{ 
                                        color: "white", 
                                        background: "#ff6100", 
                                        border: "none", 
                                        borderRadius: "8px",
                                        padding: "8px 12px"
                                    }}>
                                    <i className="fa-solid fa-crown"></i>
                                    {/* d-none d-md-block oculta el texto en pantallas pequeñas */}
                                    <span className="ms-2 d-none d-md-block">Hazte Premium</span>
                                </button>
                            </Link>

                            {/* Dropdown de Usuario */}
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="light" className="d-flex align-items-center border-0 p-1" style={{ color: "#F5EFDE", background: "#1B365D", borderRadius: "50px" }}>
                                    {/* Usamos un icono de usuario genérico o la inicial para ahorrar espacio en móvil */}
                                    <div className="d-flex align-items-center justify-content-center" style={{width: "30px", height: "30px"}}>
                                        <i className="fa-solid fa-user"></i>
                                    </div>
                                    <span className="fw-bold ms-2 d-none d-md-block pe-2">{store.usuario.username}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to="/user-profile">Perfil</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/home" onClick={() => actions.setActiveKey('register')}>Registrar Mascota</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/home" onClick={() => actions.setActiveKey('existing')}>Mis Mascotas</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item as={Link} to="/home" onClick={() => actions.logout()} className="text-danger">Cerrar Sesión</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </>
                    ) : (
                        <>
                            {/* Botones Logged Out: Iconos en móvil, Texto en PC */}
                            <Link to="/login" className="text-decoration-none">
                                <button className="btn fw-bold d-flex align-items-center" 
                                    style={{ color: "#F5EFDE", background: "#1B365D", borderRadius: "8px" }}
                                    onClick={() => store.alert = { text: "", background: "primary", visible: false }}>
                                    <i className="fa-solid fa-right-to-bracket"></i>
                                    <span className="ms-2 d-none d-md-block">Inicia Sesión</span>
                                </button>
                            </Link>
                            
                            <Link to="/sign-up" className="text-decoration-none">
                                <button className="btn fw-bold d-flex align-items-center" 
                                    style={{ color: "#F5EFDE", background: "#1B365D", borderRadius: "8px" }}
                                    onClick={() => store.alert = { text: "", background: "primary", visible: false }}>
                                    <i className="fa-solid fa-user-plus"></i>
                                    <span className="ms-2 d-none d-md-block">Regístrate</span>
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
