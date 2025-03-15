import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Navigate, useNavigate } from "react-router-dom";

export const Explore = () => {

  const navigate = useNavigate();
  const { store, actions } = useContext(Context);
  const [category, setCategory] = useState("All");

  const products = store.products
  // const products = [
  //   { id: 1, title: "Paisaje en óleo", category: "Pintura", image: "https://i.imgur.com/d8zx32r.png", inCart: false },
  //   { id: 2, title: "Ilustración digital", category: "Ilustración digital", image: "https://i.imgur.com/fS7xClr.png", inCart: false },
  //   { id: 3, title: "Abrigo artística", category: "Ropa", image: "https://i.imgur.com/OVagfHx.png", inCart: false },
  //   { id: 4, title: "Pintura", category: "Pintura", image: "https://i.imgur.com/gsLEtHk.png", inCart: false },
  //   { id: 5, title: "Pintura", category: "Pintura", image: "https://i.imgur.com/c8tpWZs.png", inCart: false },
  //   { id: 6, title: "Pintura", category: "Pintura", image: "https://i.imgur.com/IPMY4NX.png", inCart: false },
  //   { id: 7, title: "Camiseta artística", category: "Ropa", image: "https://i.imgur.com/26iApX3.png", inCart: false },
  //   { id: 8, title: "Abrigo artística", category: "Ropa", image: "https://i.imgur.com/RsOMMT2.png", inCart: false },
  //   { id: 9, title: "Taza artística", category: "Ropa", image: "https://i.imgur.com/W9r9dd6.png", inCart: false },
  //   { id: 12, title: "Ilustración digital", category: "Ilustración digital", image: "https://i.imgur.com/QDAxKlP.png", inCart: false },
  //   { id: 10, title: "Ilustración digital", category: "Ilustración digital", image: "https://i.imgur.com/zYNvbBU.png", inCart: false },
  //   { id: 11, title: "Ilustración digital", category: "Ilustración digital", image: "https://i.imgur.com/IyLHwsC.png", inCart: false },
  // ];

  const filteredProducts = category === "All" ? products : products.filter(p => p.category.toLowerCase() === category.toLowerCase());

  const isProductInCart = (productId) => {
    return store.cart.some((item) => item.id === productId);
  };

  const handleDetails = (product) => {
    // 1. guardar el product en el store 
    actions.setCurrentProduct(product)
    // 2. Navegar al componente productdetail en el path /product/id
    navigate(`/product-details/${product.id}`);
  }

  return (
    <div className="container mt-5">
      <div className="p-4 bg-light rounded">
        {/* Header */}
        <div className="text-center my-4">
          <h1 className="fw-bold text-dark">Explora Obras de Arte</h1>
          <p className="text-muted">Descubre y adquiere obras únicas de artistas talentosos.</p>
        </div>

        {/* Filtros */}
        <div className="d-flex justify-content-center gap-3 mb-4">
          {['All', 'pintura', 'ilustracion digital', 'ropa'].map(cat => (
            <button key={cat} className={`btn ${category === cat ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        <div className="row">
          {filteredProducts.map(product => (
            <div key={product.id} className="col-md-3 mb-4">
              <div className="card shadow-sm bg-white">
                <img src={product.image_url} alt={`Imagen de ${product.name}`} className="card-img-top rounded" style={{ height: "200px", objectFit: "cover", width: "100%" }} />
                <div className="card-body text-center">
                  <h5 className="fw-bold">{product.name}</h5>
                  <p className="text-muted">{product.category}</p>

                  {/* Botón para ver detalles */}
                  <button className="btn btn-outline-dark me-2"
                  onClick={() => handleDetails(product)}
                  >Ver Detalles</button>

                  {/* Botón para añadir al carrito */}
                  {isProductInCart(product.id) ? (
                    <button className="btn btn-outline-danger" onClick={() => actions.removeFromCart(product.id)}>
                      <i className="fas fa-trash text-end"></i>
                    </button>
                  ) : (
                    <button className="btn btn-success" onClick={() => actions.addToCart(product)}>
                      <i className="fas fa-shopping-cart text-end"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};