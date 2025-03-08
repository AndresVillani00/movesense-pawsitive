import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import { Dropdown } from "react-bootstrap";

export const Navbar = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getUserProfile();
    }, []);

    const [user, setUser] = useState({
        name: " Usuario",
        profilePic: "https://i.imgur.com/24t1SYU.jpeg"
    });

    return (
        <nav className="navbar navbar-expand-lg shadow-sm" style={{
            background: "#FFFFFF",
            borderBottom: "2px solid #DDD",
            padding: "10px 20px"
        }}>
            <div className="container">
                {/* Logo */}
                <Link to="/home" className="navbar-brand fw-bold" style={{ color: "#1E1E50", fontSize: "1.5rem" }}>
                    Art Vibes
                </Link>
                {/* Botón de menú en móviles */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                {/* Links de navegación */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <Link className="nav-link text-dark mx-2 fs-5 fw-medium" to="/home">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-dark mx-2 fs-5 fw-medium" to="/explore">Explore</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-dark mx-2 fs-5 fw-medium" to="/artists">Artists</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-dark mx-2 fs-5 fw-medium" to="/product">Product</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-dark mx-2 fs-5 fw-medium" to="/blogs">Events</Link>
                        </li>
                    </ul>
                    {/* Ícono del carrito */}
                    <div className="d-flex align-items-center">
                        <Link to="/cart" className="position-relative me-3">
                            <i className="fas fa-shopping-bag fs-4" style={{ color: "#1E1E50" }}></i>
                            {store.cart && store.cart.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {store.cart.length}
                                    <span className="visually-hidden">items in cart</span>
                                </span>
                            )}
                        </Link>
                        {/* Botones de Login y Signup */}
                        {store.isLogged ? (
                            <div className="d-flex ms-3">
                                <Dropdown className="ms-3">
                                    <Dropdown.Toggle variant="light" id="dropdown-user" className="d-flex align-items-center border-0">
                                        <img src={user.profilePic} alt="Profile" className="rounded-circle m-1" width="30" height="30" />
                                        <span className="fw-bold text-dark">{store.usuario.username}</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu align="end">
                                        <Dropdown.Item as={Link} to="/user-profile">Perfil</Dropdown.Item>
                                        {store.isBuyer ? (
                                            <Dropdown.Item as={Link} to="/purchases">Mis Compras</Dropdown.Item>
                                        ) : (
                                            <>
                                                <Dropdown.Item as={Link} to="/sales">Mis Ventas</Dropdown.Item>
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
                            </div>
                        ) : (
                            <div className="d-flex ms-3">
                                <Link to={'/login'}>
                                    <button className="btn btn-outline-primary me-2 fw-bold p-2">
                                        Log In
                                    </button>
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
