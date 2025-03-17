import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Cart = () => {
  const { store, actions } = useContext(Context);
  const productsInCart = store.cart;
  const total_amount = productsInCart.reduce((count, item) => count + item.price, 0);
  store.totalAmount = total_amount;

  return (
    <div className="container p-5">
      <div className="row">
        {productsInCart.map(item => (
          <div key={item.id} className="col-md-12 mb-4">
            <div className="card mb-3 m-auto justify-content-center" tyle={{ width: "540px" }}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img src={item.image_url} alt={`Imagen de ${item.name}`} className="card-img-top rounded" style={{ height: "200px", objectFit: "cover", width: "100%" }} />
                </div>
                <div className="col-md-6">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">Descripcion: {item.description}</p>
                    <p className="card-text">Categoría: {item.category}</p>
                    <p className="card-text">Precio: {item.price}€</p>
                  </div>
                </div>
                <div className="col-md-2">
                  <button className="btn btn-outline-danger" onClick={() => actions.removeFromCart(item.id)}>
                    <i className="fas fa-trash text-end"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <hr className="custom-line" />
        <div className="d-flex justify-content-between">
          <h4 className="text-primary">Total a pagar: {total_amount}€</h4>
          <Link to={'/payment'}>
            <button className="btn btn-success" type="text">Proceder al pago</button>
          </Link>
        </div>  
      </div>
    </div>
  );
}