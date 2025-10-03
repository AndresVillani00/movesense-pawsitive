import React, { useContext } from "react";
import { Context } from "../store/appContext.js";

export const Payment = () => {
  const { store, actions } = useContext(Context);

  const handleSubscribe = async () => {
    const dataToSend = {
      user_id: store.usuario.id
    }

    actions.paymentIntent(dataToSend);
  };

  return (
    <section>
      {store.isLogged ?
        <div className="container mt-5 text-center">
          <h1 className="fw-bold">Premium Subscription</h1>
          <p className="text-muted">Accede a todas las utilidades con tu suscripción mensual.</p>
          <button
            className="btn btn-lg fw-bold"
            style={{
              color: "white", 
              background:"#ff6100", 
              border: "#ff6100",
            }}
            onClick={handleSubscribe}
          >
            Subscribe for $7.99 / month
          </button>
        </div>
        :
        <div></div>
      }
    </section>
  );
};
