import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";
import logo from '../../img/LogoPawsitive.png';
import { Dropdown } from "react-bootstrap";

export const Navbar = () => {
    const { store, actions } = useContext(Context);

    return (
        <nav className="navbar navbar-expand-lg navbar-light shadow-sm sticky-top" style={{ background: "#1B365D" }}>
            <div className="container d-flex justify-content-between">
                {/* Logo */}
                <Link to="/home" className="navbar-brand fw-bold" style={{ color: "#F5EFDE", fontSize: "1.5rem" }}>
                    <img src={logo} className="m-auto" width="70" height="70"></img>
                </Link>

                {/* Menú colapsable */}
                <div className="d-flex justify-content-between" id="navbarNav" >
                    <button className="btn bg-transparent border-0" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Home" style={{ color:"#F5EFDE" }}>
                        <i className="fa-solid fa-house"></i>
                    </button>
                    <button className="btn bg-transparent border-0" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Incidents for pets" style={{ color:"#F5EFDE" }}>
                        <i className="fa-solid fa-paw"></i>
                    </button>
                    <button type="button" className="btn bg-transparent border-0" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="About us" style={{ color:"#F5EFDE" }}>
                        <i className="fa-solid fa-users-rectangle"></i>
                    </button>
                </div>  
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
                                    <Dropdown.Item as={Link} to="/home" onClick={() => actions.setActiveKey('register')}>
                                        Register New Pet
                                    </Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/home" onClick={() => actions.setActiveKey('existing')}>
                                        Existing Pets
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item as={Link} to="/home" onClick={() => actions.logout()} className="text-danger">
                                        Log Out
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
                                }}
                                onClick={() => store.alert = { text: "", background: "primary", visible: false }}>
                                    Log In</button>
                            </Link>
                            {<Link to="/sign-up">
                                <button className="btn fw-bold" style={{
                                    color: "#1B365D",
                                    background: "#F5EFDE",
                                    borderRadius: "8px",
                                    padding: "8px 16px"
                                }}
                                onClick={() => store.alert = { text: "", background: "primary", visible: false }}>
                                    Sign Up
                                </button>
                            </Link>}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
