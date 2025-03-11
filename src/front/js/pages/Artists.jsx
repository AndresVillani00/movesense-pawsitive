import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Artists = () => {
    const { store } = useContext(Context);
    const [search, setSearch] = useState("");
    const imagenes = [
        'https://randomuser.me/api/portraits/lego/0.jpg',
        'https://randomuser.me/api/portraits/lego/1.jpg',
        'https://randomuser.me/api/portraits/lego/2.jpg',
        'https://randomuser.me/api/portraits/lego/3.jpg',
        'https://randomuser.me/api/portraits/lego/4.jpg',
        'https://randomuser.me/api/portraits/lego/5.jpg',
        'https://randomuser.me/api/portraits/lego/7.jpg',
        'https://randomuser.me/api/portraits/lego/8.jpg'
    ];
    const aleatorio = Math.floor(Math.random() * imagenes.length);
    const randomImg = imagenes[aleatorio];

    // Filtrar artistas basado en la búsqueda
    const filteredArtists = store.artists.filter(artist =>
        artist.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mt-5">
            {/* Encabezado */}
            <h2 className="text-center mb-4">Descubre a Nuestros Artistas</h2>
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar artista..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ borderRadius: "20px", padding: "10px 20px" }}
                />
            </div>

            {/* Sección central con fondo ligeramente más oscuro */}
            <div className="p-4 bg-light rounded">
                {/* Tarjetas de artistas filtrados */}
                <div className="row g-3">
                    {filteredArtists.length > 0 ? (
                        filteredArtists.map((item, index) => (
                            <div key={item.id || index} className="col-sm-6 col-md-4 col-lg-3">
                                <div
                                    className="card h-100 border-0 shadow-sm"
                                    style={{
                                        borderRadius: "15px",
                                        overflow: "hidden",
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.05)";
                                        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                                    }}
                                >
                                    {/* Imagen de perfil circular */}
                                    <div className="text-center p-4">
                                        <img
                                            src={randomImg}
                                            alt={item.username}
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                                borderRadius: "50%",
                                                border: "4px solid white",
                                                objectFit: "cover",
                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                                            }}
                                        />
                                    </div>
                                    {/* Cuerpo de la tarjeta */}
                                    <div className="card-body text-center">
                                        <h5 className="fw-bold mb-2" style={{ color: "#1E3A5F" }}>
                                            {item.username}
                                        </h5>
                                        <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
                                            Artista
                                        </p>
                                        <Link
                                            to={`/artist/${item.id}`}
                                            className="btn btn-primary btn-sm"
                                            style={{
                                                background: "#1E3A5F",
                                                border: "none",
                                                borderRadius: "20px",
                                                padding: "8px 20px",
                                                fontSize: "0.9rem",
                                                fontWeight: "500"
                                            }}
                                        >
                                            Ver Perfil
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No se encontraron artistas.</p>
                    )}
                </div>
            </div>

            {/* Sección de exploración de artistas */}
            <div className="p-4 bg-light rounded mt-4">
                {/* Header */}
                <div className="text-center my-4">
                    <h1 className="fw-bold text-dark">Explora Artistas que ya venden Obras de Arte</h1>
                    <p className="text-muted">Descubre los distintos artistas talentosos de nuestra web.</p>
                </div>

                {/* Grid de productos */}
                <div className="row g-3">
                    {store.artists.map(item => (
                        <div key={item.id} className="col-sm-6 col-md-4 col-lg-3">
                            <div
                                className="card h-100 border-0 shadow-sm"
                                style={{
                                    borderRadius: "15px",
                                    overflow: "hidden",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.05)";
                                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                                }}
                            >
                                <img
                                    src={randomImg}
                                    className="card-img-top"
                                    alt={item.username}
                                    style={{
                                        height: "200px",
                                        objectFit: "cover",
                                        width: "100%"
                                    }}
                                />
                                <div className="card-body text-center">
                                    <h5 className="fw-bold" style={{ color: "#1E3A5F" }}>
                                        {item.username}
                                    </h5>
                                    <p className="text-muted">Artista</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};