import React, { useState } from "react";

export const Explore = () => {
  const [category, setCategory] = useState("All");

  const products = [
    { id: 1, title: "Paisaje en óleo", category: "Pintura", image: "https://i.imgur.com/d8zx32r.png" },
    { id: 2, title: "Ilustración digital", category: "Ilustración digital", image: "https://i.imgur.com/fS7xClr.png" },
    { id: 3, title: "Abrigo artística", category: "Ropa", image: "https://i.imgur.com/OVagfHx.png" },
    { id: 4, title: "Pintura", category: "Pintura", image: "https://i.imgur.com/gsLEtHk.png" },
    { id: 5, title: "Pintura", category: "Pintura", image: "https://i.imgur.com/c8tpWZs.png" },
    { id: 6, title: "Pintura", category: "Pintura", image: "https://i.imgur.com/IPMY4NX.png" },
    { id: 7, title: "Camiseta artística", category: "Ropa", image: "https://i.imgur.com/26iApX3.png" },
    { id: 8, title: "Abrigo artística", category: "Ropa", image: "https://i.imgur.com/RsOMMT2.png" },
    { id: 9, title: "Taza artística", category: "Ropa", image: "https://i.imgur.com/W9r9dd6.png" },
    { id: 12, title: "Ilustración digital", category: "Ilustración digital", image: "https://i.imgur.com/QDAxKlP.png" },
    { id: 10, title: "Ilustración digital", category: "Ilustración digital", image: "https://i.imgur.com/zYNvbBU.png" },
    { id: 11, title: "Ilustración digital", category: "Ilustración digital", image: "https://i.imgur.com/IyLHwsC.png" },
  ];

  const filteredProducts = category === "All" ? products : products.filter(p => p.category === category);

  return (
    <div className="container mt-5">
      {/* Contenedor con fondo claro y padding para separar del fondo general */}
      <div className="p-4 bg-light rounded">
        {/* Header */}
        <div className="text-center my-4">
          <h1 className="fw-bold text-dark">Explora Obras de Arte</h1>
          <p className="text-muted">Descubre y adquiere obras únicas de artistas talentosos.</p>
        </div>

        {/* Filtros */}
        <div className="d-flex justify-content-center gap-3 mb-4">
          {['All', 'Pintura', 'Ilustración digital', 'Ropa'].map(cat => (
            <button
              key={cat}
              className={`btn ${category === cat ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        <div className="row">
          {filteredProducts.map(product => (
            <div key={product.id} className="col-md-3 mb-4">
              <div className="card shadow-sm bg-white">
                <img
                  src={product.image}
                  alt={product.title}
                  className="card-img-top rounded"
                  style={{ height: "200px", objectFit: "cover", width: "100%" }}
                />
                <div className="card-body text-center">
                  <h5 className="fw-bold">{product.title}</h5>
                  <p className="text-muted">{product.category}</p>
                  <button className="btn btn-outline-dark">Ver Detalles</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
