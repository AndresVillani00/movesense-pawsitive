import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav
            className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top p-2"
            style={{
                background: "linear-gradient(135deg, #5A189A, #E03E94)",
                fontFamily: "'Poppins', sans-serif"}}>
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold text-light fs-2 ms-5" to="/">
                    ArtVibe
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto"> 
                        <li className="nav-item">
                            <Link className="nav-link text-light  mx-2 fs-5" to="/home">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-light  mx-2 fs-5" to="/explore">
                                Explore
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-light mx-2 fs-5 " to="/artists">
                                Artists
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-light  mx-2 fs-5" to="/product">
                            Product
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-light  mx-2 fs-5" to="/blogs">
                                Blogs
                            </Link>
                        </li>
                    </ul>
                    <div className="d-flex me-3">
                        <Link className="btn btn-outline-light text-light rounded-pill px-3 mx-2" to="/login">
                            Log In
                        </Link>
                        <Link className="btn btn-outline-light text-light rounded-pill px-3 mx-2" to="/sign-up" >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};