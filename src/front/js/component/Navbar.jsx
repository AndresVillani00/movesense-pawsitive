import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import { Dropdown } from "react-bootstrap";

export const Navbar = () => {
    const { store, actions } = useContext(Context);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div className="container">
                {/* Logo */}
                <Link to="/home" className="navbar-brand fw-bold" style={{ color: "#1E1E50", fontSize: "1.5rem" }}>
                    Art Vibes
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
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto text-center">
                        {["Home", "Explore", "Artists", "Events"].map((item, index) => (
                            <li className="nav-item" key={index}>
                                <Link className="nav-link text-dark mx-2 fw-medium" to={`/${item.toLowerCase()}`}>
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Sección de usuario y carrito */}
                    <div className="d-flex align-items-center">
                        {/* Carrito */}
                        {store.isLogged && store.isBuyer && (
                            <Link to="/cart" className="position-relative me-3">
                                <i className="fas fa-shopping-bag fs-2" style={{ color: "#1E1E50" }}></i>
                                {store.cart?.length > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {store.cart.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Dropdown de usuario */}
                        {store.isLogged ? (
                            <Dropdown className="ms-3">
                                <Dropdown.Toggle variant="light" className="d-flex align-items-center border-0">
                                    <img src={store.usuario.image_url == null ? "https://i.imgur.com/24t1SYU.jpeg" : store.usuario.image_url} alt="Profile" className="rounded-circle m-1" width="30" height="30" />
                                    <span className="fw-bold text-dark ms-2">{store.usuario.username}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                    <Dropdown.Item as={Link} to="/user-profile">Perfil</Dropdown.Item>
                                    {store.isBuyer ? (
                                        <Dropdown.Item as={Link} to="/purchases">Mis Compras</Dropdown.Item>
                                    ) : (
                                        <>
                                            <Dropdown.Item as={Link} to="/selling">Productos en Venta</Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/post-product">Publicar un producto</Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/new-blog-post">Publicar un evento</Dropdown.Item>
                                        </>
                                    )}
                                    <Dropdown.Divider />
                                    <Dropdown.Item as={Link} to="/home" onClick={() => actions.logout()} className="text-danger">
                                        Cerrar Sesión
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <div className="d-flex ms-3">
                                <Link to="/login">
                                    <button className="btn btn-outline-primary me-2 fw-bold">Log In</button>
                                </Link>
                                <Link to="/sign-up">
                                    <button className="btn text-white fw-bold" style={{
                                        background: "linear-gradient(135deg, #1E3A5F, #4A69BB, #8FAADC)",
                                        borderRadius: "8px",
                                        padding: "8px 16px"
                                    }}>
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
