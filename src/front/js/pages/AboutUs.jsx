import React from "react";

export const AboutUs = () => {
    return (
        <div className="container py-5">
            <h2 className="text-center mb-4" style={{ color: "#1E1E50" }}>
                Sobre Nosotros
            </h2>
            <div className="row">
                <div className="col-md-6">
                    <h3 style={{ color: "#1E1E50" }}>¿Por qué este proyecto?</h3>
                    <p className="lead">
                        Este proyecto nace de la pasión por el arte y la necesidad de conectar a artistas y amantes del arte en un solo lugar. Queremos ofrecer una plataforma donde los artistas puedan mostrar sus obras y los compradores puedan descubrir piezas únicas.
                    </p>
                </div>
                <div className="col-md-6">
                    <h3 style={{ color: "#1E1E50" }}>Nuestro Equipo</h3>
                    <ul className="list-unstyled">
                        <li className="mb-3">
                            <strong>Nombre del Integrante 1</strong> - Rol en el proyecto.
                        </li>
                        <li className="mb-3">
                            <strong>Nombre del Integrante 2</strong> - Rol en el proyecto.
                        </li>
                        <li className="mb-3">
                            <strong>Nombre del Integrante 3</strong> - Rol en el proyecto.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};