import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
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
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Links de navegación */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <Link className="nav-link text-dark mx-2 fs-5 fw-medium" to="/home">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-dark mx-2 fs-5 fw-medium" to="/explore">
                                Explore
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-dark mx-2 fs-5 fw-medium" to="/artists">
                                Artists
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-dark mx-2 fs-5 fw-medium" to="/product">
                                Product
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-dark mx-2 fs-5 fw-medium" to="/blogs">
                                Blogs
                            </Link>
                        </li>
                    </ul>

                    {/* Botones de Login y Signup */}
                    <div className="d-flex ms-3">
                    <Link to="/new-blog-post">
                        <button className="btn btn-outline-primary me-2 fw-bold p-2">New Post </button> 
                        </Link>
                        <Link to="/login">
                            <button className="btn btn-outline-primary me-2 fw-bold p-2">Log In</button>
                        </Link>
                        <Link to="/sign-up">
                            <button className="btn text-white fw-bold" style={{
                                background: "linear-gradient(135deg, #1E3A5F, #4A69BB, #8FAADC)",
                                borderRadius: "8px",
                                padding: "8px 16px"
                            }}>Sign Up</button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};