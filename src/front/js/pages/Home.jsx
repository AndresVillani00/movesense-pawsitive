import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="bg-light"  style={{ background: "#e9ecef" }}>
      {/* Hero Section */}
      <section
        className="text-white d-flex align-items-center justify-content-center"
        style={{
          background: "#1E1E50 url('https://source.unsplash.com/1600x900/?art') no-repeat center center/cover",
          height: "80vh",
          position: "relative"
        }}
      >
        {/* Overlay para suavizar la imagen */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)"
          }}
        ></div>

        <div
          className="hero-content text-center"
          style={{ position: "relative", zIndex: 1 }}
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
                    to={`/category/${category.name.toLowerCase().replace(/\s/g, "-")}`}
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
                  <Link to="/activities" className="btn btn-outline-primary btn-sm">
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
          {[1, 2, 3, 4].map((product) => (
            <div key={product} className="col-sm-6 col-md-3">
              <div className="card shadow-sm h-100">
                <img
                  src="https://i.imgur.com/c8tpWZs.png"
                  alt={`Producto ${product}`}
                  className="card-img-top"
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title" style={{ color: "#1E1E50" }}>
                    Obra {product}
                  </h5>
                  <p className="card-text">Una pieza excepcional para tu colección.</p>
                  <Link to="/product" className="btn btn-dark">
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
          {[1, 2, 3].map((artist) => (
            <div key={artist} className="col-md-4">
              <div className="card shadow-sm text-center h-100" style={{ borderRadius: "15px" }}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  <img
                    src={`https://randomuser.me/api/portraits/lego/${artist}.jpg`}
                    alt={`Artista ${artist}`}
                    className="rounded-circle mb-3"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      border: "4px solid #fff"
                    }}
                  />
                  <h5 className="card-title fw-bold mb-3" style={{ color: "#1E1E50" }}>
                    ArtLover {artist}
                  </h5>
                  <Link to="/artists" className="btn btn-outline-primary btn-sm">
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
