import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import logo from '../../img/LogoPawsitive.png';
import { Dropdown } from "react-bootstrap";

export const Navbar = () => {
    const { store, actions } = useContext(Context);

    return (
        <nav className="navbar navbar-expand-lg navbar-light shadow-sm sticky-top" style={{ background: "#1B365D" }}>
            <div className="container">
                {/* Logo */}
                <Link to="/home" className="navbar-brand fw-bold" style={{ color: "#F5EFDE", fontSize: "1.5rem" }}>
                    <img src={logo} className="m-auto" width="70" height="70"></img>
                </Link>

                {/* Botón de menú en móviles */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Menú colapsable */}
                <div className="collapse navbar-collapse" id="navbarNav" >
                    <ul className="navbar-nav mx-auto text-center">
                        {["Home", "Mis Mascotas", "Incidencias", "About Us"].map((item, index) => (
                            <li className="nav-item" key={index}>
                                <Link className="nav-link mx-2 fw-medium" style={{ color:"#F5EFDE" }} to={`/${item.toLowerCase()}`}>
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Sección de usuario */}
                    <div className="row g-3">

                        {/* Dropdown de usuario */}
                        {store.isLogged ? (
                            <div className="d-flex justify-content-center">
                                <Link to="/payment">
                                    <button className="btn fw-bold" style={{
                                        color: "white", 
                                        background:"#ff6100", 
                                        border: "#ff6100",
                                        borderRadius: "8px",
                                        padding: "8px 16px"
                                    }}>
                                        Subscribe
                                    </button>
                                </Link>
                                <Dropdown className="ms-3">
                                    <Dropdown.Toggle variant="light" className="d-flex align-items-center border-0">
                                        <span className="fw-bold text-dark ms-2">{store.usuario.username}</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu align="end">
                                        <Dropdown.Item as={Link} to="/user-profile">Perfil</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item as={Link} to="/home" onClick={() => actions.logout()} className="text-danger">
                                            Cerrar Sesión
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        ) : (
                            <div className="d-flex ms-3">
                                <Link to="/login">
                                    <button className="btn me-2 fw-bold" style={{
                                        color: "#1B365D",
                                        background: "#F5EFDE",
                                        borderRadius: "8px",
                                        padding: "8px 16px"
                                    }}>
                                        Log In</button>
                                </Link>
                                {<Link to="/sign-up">
                                    <button className="btn fw-bold" style={{
                                        color: "#1B365D",
                                        background: "#F5EFDE",
                                        borderRadius: "8px",
                                        padding: "8px 16px"
                                    }}>
                                        Sign Up
                                    </button>
                                </Link>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
