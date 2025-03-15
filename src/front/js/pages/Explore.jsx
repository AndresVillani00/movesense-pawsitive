import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

export const Explore = () => {
  const { store, actions } = useContext(Context);
  const [category, setCategory] = useState("All");

  const handleCart = (product) => {
    const dataToSend = { ...product, order_id: store.orderId }
    
    actions.addToCart(product);
    actions.postOrderItem(dataToSend);
  }

  const products = store.products;
  const filteredProducts = category === "All" ? products : products.filter(p => p.category === category);

  const isProductInCart = (productId) => {
    return store.cart.some((item) => item.id === productId);
  };

  const handleDetails = (product) => {
    // 1. guardar el product en el store 
    actions.setCurrentProduct(product)
    // 2. Navegar al componente productdetail en el path /product/id 
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
          {['All', 'pintura', 'ilustración digital', 'ropa'].map(cat => (
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
                <img src={product.image} alt={`Imagen de ${product.title}`} className="card-img-top rounded" style={{ height: "200px", objectFit: "cover", width: "100%" }} />
                <div className="card-body text-center">
                  <h5 className="fw-bold">{product.title}</h5>
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
                    <button className="btn btn-success" onClick={() => handleCart(product)}>
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