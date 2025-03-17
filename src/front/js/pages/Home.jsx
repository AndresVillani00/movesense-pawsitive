import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Home = () => {
  const { store, actions } = useContext(Context);

  // Obtener productos y artistas al cargar el componente
  useEffect(() => {
    actions.getProducts();
    actions.getArtists();
  }, []);

  // Función para obtener productos aleatorios
  const getRandomProducts = () => {
    if (store.products.length > 0) {
      const shuffledProducts = [...store.products].sort(() => 0.5 - Math.random());
      return shuffledProducts.slice(0, 4); // Mostrar 4 productos aleatorios
    }
    return [];
  };

  // Función para obtener artistas aleatorios
  const getRandomArtists = () => {
    if (store.artists.length > 0) {
      const shuffledArtists = [...store.artists].sort(() => 0.5 - Math.random());
      return shuffledArtists.slice(0, 3); // Mostrar 3 artistas aleatorios
    }
    return [];
  };

  return (
    <div className="bg-light" style={{ background: "#e9ecef" }}>
      {/* Hero Section */}
      <section
        className="text-white d-flex align-items-center justify-content-center"
        style={{
          height: "80vh",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Video de fondo */}
        <video
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "translate(-50%, -50%)",
            zIndex: 0
          }}
        >
          <source src="https://i.imgur.com/zxdohU1.mp4" type="video/webm" />
        </video>

        {/* Overlay para suavizar el video */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 1
          }}
        ></div>

        <div
          className="hero-content text-center"
          style={{ position: "relative", zIndex: 2 }}
        >
          <h1 className="display-4 fw-bold">Descubre el Mundo del Arte</h1>
          <p className="lead">Compra, explora y vive experiencias únicas</p>
          <Link to="/explore" className="btn btn-light btn-lg fw-bold mt-3">
            Explorar
          </Link>
        </div>
      </section>

      {/* Sección de Categorías */}
      <section className="container py-5">
        <h2 className="text-center mb-4" style={{ color: "#1E1E50" }}>
          Categorías
        </h2>
        <div className="row g-4">
          {[
            { name: "Pinturas", img: "https://i.imgur.com/gsLEtHk.png" },
            { name: "Ropa", img: "https://i.imgur.com/RsOMMT2.png" },
            { name: "Ilustración Digital", img: "https://i.imgur.com/QDAxKlP.png" },
            { name: "Eventos", img: "https://i.imgur.com/On8IJAC.png" }
          ].map((category, index) => (
            <div key={index} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <img
                  src={category.img}
                  alt={category.name}
                  className="card-img-top"
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title" style={{ color: "#1E1E50" }}>
                    {category.name}
                  </h5>
                  <Link
                    to={`/explore?category=${category.name.toLowerCase().replace(/\s/g, "-")}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Ver
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección: ¿Qué Hacer? (Actividades y Eventos) */}
      <section className="container py-5">
        <h2 className="text-center mb-4" style={{ color: "#1E1E50" }}>
          ¿Qué Hacer?
        </h2>
        <div className="row g-4">
          {[
            { title: "Visitar Exposiciones", img: "https://i.imgur.com/IWIFGC3.png" },
            { title: "Participar en Talleres", img: "https://i.imgur.com/FA549tp.png" },
            { title: "Conocer Artistas", img: "https://i.imgur.com/C8bIO8m.png" },
            { title: "Unirse a Comunidades", img: "https://i.imgur.com/mC016Ss.png" }
          ].map((activity, index) => (
            <div key={index} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <img
                  src={activity.img}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title" style={{ color: "#1E1E50" }}>
                    {activity.title}
                  </h5>
                  <Link to="/events" className="btn btn-outline-primary btn-sm">
                    Más Info
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de Productos Destacados */}
      <section className="container py-5">
        <h2 className="text-center mb-4" style={{ color: "#1E1E50" }}>
          Productos Destacados
        </h2>
        <div className="row g-4">
          {getRandomProducts().map((product) => (
            <div key={product.id} className="col-sm-6 col-md-3">
              <div className="card shadow-sm h-100">
                <img
                  src={product.image_url}
                  alt={`Producto ${product.name}`}
                  className="card-img-top"
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title" style={{ color: "#1E1E50" }}>
                    {product.name}
                  </h5>
                  <p className="card-text">{product.category}</p>
                  <Link to={`/product-details/${product.id}`} className="btn btn-dark">
                    Ver Detalle
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de Artistas Destacados */}
      <section className="container py-5">
        <h2 className="text-center mb-4" style={{ color: "#1E1E50" }}>
          Artistas Destacados
        </h2>
        <div className="row g-4">
          {getRandomArtists().map((artist) => (
            <div key={artist.id} className="col-md-4">
              <div className="card shadow-sm text-center h-100" style={{ borderRadius: "15px" }}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  <img
                   src={artist.image_url || "https://i.imgur.com/24t1SYU.jpeg"}
                    alt={`Artista ${artist.username}`}
                    className="rounded-circle mb-3"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      border: "4px solid #fff"
                    }}
                  />
                  <h5 className="card-title fw-bold mb-3" style={{ color: "#1E1E50" }}>
                    {artist.username}
                  </h5>
                  <Link to={`/artist/${artist.id}`} className="btn btn-outline-primary btn-sm">
                    Ver Perfil
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};