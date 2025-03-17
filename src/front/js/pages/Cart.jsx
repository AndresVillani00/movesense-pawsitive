import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Cart = () => {
  const { store, actions } = useContext(Context);
  const productsInCart = store.cart;
  const total_amount = productsInCart.reduce((count, item) => count + item.price, 0);

  return (
    <div className="container p-5">
      <div className="row">
        {productsInCart.map((item) => (
          <div key={item.id} className="col-md-12 mb-4">
            <div className="card mb-3 shadow-lg rounded-4" style={{ width: "100%", border: "none" }}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={item.image_url}
                    alt={`Imagen de ${item.name}`}
                    className="img-fluid rounded-start"
                    style={{ height: "200px", objectFit: "cover", width: "100%" }}
                  />
                </div>
                <div className="col-md-6 d-flex align-items-center">
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-dark">{item.name}</h5>
                    <p className="card-text text-muted">Descripción: {item.description}</p>
                    <p className="card-text text-muted">Categoría: {item.category}</p>
                    <p className="card-text text-success fw-bold">Precio: {item.price}€</p>
                  </div>
                </div>
                <div className="col-md-2 d-flex align-items-center justify-content-center">
                  <button
                    className="btn btn-outline-danger rounded-circle p-2"
                    onClick={() => actions.removeFromCart(item.id)}
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <hr className="custom-line my-4" />
        <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 shadow-sm">
          <h4 className="text-primary fw-bold mb-0">Total a pagar: {total_amount}€</h4>
          <Link to={"/payment"}>
            <button className="btn btn-success fw-bold px-4 py-2">Proceder al pago</button>
          </Link>
        </div>
      </div>
    </div>
  );
};