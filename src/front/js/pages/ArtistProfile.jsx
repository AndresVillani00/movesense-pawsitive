import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";

export const ArtistProfile = () => {
  const { store, actions } = useContext(Context);
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtist = async () => {
      const artistData = await actions.getArtistById(id);
      if (artistData) {
        setArtist(artistData);
      }
      setLoading(false);
    };
    fetchArtist();
  }, [id]);

  if (loading) {
    return <div className="container py-5 text-center">Cargando...</div>;
  }

  if (!artist) {
    return (
      <div className="container py-5 text-center">
        <h2>Artista no encontrado</h2>
        <p>El artista con ID {id} no existe.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        {/* Columna izquierda: Información del artista */}
        <div className="col-md-4 text-center">
          <img
            src={artist.image_url || "https://i.imgur.com/24t1SYU.jpeg"}
            alt={`Artista ${artist.username}`}
            className="rounded-circle mb-3"
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
        </div>

        {/* Columna derecha: Pinturas en venta y detalles adicionales */}
        <div className="col-md-8">
          <div className="mb-5">
          <h2 style={{ color: "#1E3A5F" }}>{artist.username}</h2>
          <p className="text-muted">{artist.specialty || "Artista multidisciplinario"}</p>
            <div className="mt-4">
              <h4 style={{ color: "#1E3A5F" }}>Sobre el artista</h4>
              <p className="text-muted">
                {artist.biography || "Este artista no tiene una biografía disponible."}
              </p>
            </div>
            <div className="mt-4">
              <h4 style={{ color: "#1E3A5F" }}>Contacto</h4>
              <p className="text-muted">
                <strong>Email:</strong> {artist.email || "No disponible"}
              </p>
              <p className="text-muted">
                <strong>Redes sociales:</strong>{" "}
                {artist.social_media || "No disponible"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};