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

        {/* Columna derecha: Pinturas en venta y detalles adicionales */}
        <div className="col-md-8">
          <div className="mb-5">
            <h3 style={{ color: "#1E3A5F" }}>Pinturas en venta</h3>
            {artist.products && artist.products.length > 0 ? (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {artist.products.map((product) => (
                  <div key={product.id} className="col">
                    <div className="card h-100 shadow-sm">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text text-muted">
                          {product.description || "Sin descripción disponible."}
                        </p>
                        <p className="card-text">
                          <strong>Precio:</strong> €{product.price}
                        </p>
                        <p className="card-text">
                          <strong>Disponibilidad:</strong> {product.availability}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">Actualmente no hay pinturas en venta.</p>
            )}
          </div>

          <div className="mb-5">
            <h3 style={{ color: "#1E3A5F" }}>Técnicas y estilos</h3>
            <p className="text-muted">
              {artist.techniques || "Este artista no ha especificado sus técnicas o estilos."}
            </p>
          </div>

          <div className="mb-5">
            <h3 style={{ color: "#1E3A5F" }}>Exposiciones y logros</h3>
            <p className="text-muted">
              {artist.achievements || "Este artista no ha compartido sus exposiciones o logros."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};