import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top p-2"  style={{
			background: "linear-gradient(135deg, #5A189A, #E03E94)",
			fontFamily: "'Poppins', sans-serif"
		}}>
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold text-light fs-2" to="/">
                    ArtVibe
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link text-light fw-bold" to="/product">Products</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link btn btn-outline-light text-light rounded-pill px-3 mx-2" to="/login">
                                Log In
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};