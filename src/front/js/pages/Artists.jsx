import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Artists = () => {
  const { store, actions } = useContext(Context);
  const [search, setSearch] = useState("");

  // Filtrar artistas por nombre
  const filteredArtists = store.artists.filter((artist) =>
    artist.username.toLowerCase().includes(search.toLowerCase())
  );

  // Imágenes por defecto para el perfil
  const defaultImages = [
    "https://randomuser.me/api/portraits/lego/0.jpg",
    "https://randomuser.me/api/portraits/lego/1.jpg",
    "https://randomuser.me/api/portraits/lego/2.jpg",
    "https://randomuser.me/api/portraits/lego/3.jpg",
    "https://randomuser.me/api/portraits/lego/4.jpg",
    "https://randomuser.me/api/portraits/lego/5.jpg",
    "https://randomuser.me/api/portraits/lego/7.jpg",
    "https://randomuser.me/api/portraits/lego/8.jpg",
  ];
  const getRandomImage = () =>
    defaultImages[Math.floor(Math.random() * defaultImages.length)];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Descubre a Nuestros Artistas</h2>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar artista..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="row">
        {filteredArtists.length > 0 ? (
          filteredArtists.map((item, index) => (
            <div key={item.id || index} className="col-sm-6 col-md-4 col-lg-3 mb-4">
              <div
                className="card shadow-sm"
                style={{
                  border: "none",
                  borderRadius: "15px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Banda superior para destacar la imagen */}
                <div style={{ background: "#1E1E50", height: "60px" }}></div>
                {/* Imagen del artista, solapada a la banda */}
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <img
                    src={getRandomImage()}
                    alt={item.username}
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      border: "4px solid white",
                      objectFit: "cover",
                    }}
                  />
                </div>
                {/* Cuerpo de la tarjeta */}
                <div className="card-body text-center" style={{ marginTop: "70px" }}>
                  <h5 className="fw-bold" style={{ color: "#1E1E50" }}>
                    {item.username}
                  </h5>
                  <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                    Artista
                  </p>
                  <Link to={`/artist/${item.id}`} className="btn btn-primary btn-sm">
                    Ver Perfil
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center text-muted">No se encontraron artistas.</p>
          </div>
        )}
      </div>
    </div>
  );
};
