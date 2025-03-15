import React, { useContext } from "react";
import { Context } from "../store/appContext";

export const Cart = () => {
  const { store } = useContext(Context);
  const productsInCart = store.cart;
  const total_amount = productsInCart.reduce((count, item) => count + item.price, 0);
  
  return (
    <div className="container text-align-center p-5">
      <div className="row">
        {productsInCart.map(item => (
          <div key={item.id} className="col-md-8 mb-4">
            <div className="card mb-3" tyle={{ width: "540px" }}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img src={item.image} alt={`Imagen de ${item.name}`} className="card-img-top rounded" />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">{item.description}</p>
                    <p className="card-text">{item.category}</p>
                    <p className="card-text">{item.price}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <hr className="custom-line" />
        <div>
          <h3>{total_amount}</h3>
        </div>  
      </div>
    </div>
  );
}