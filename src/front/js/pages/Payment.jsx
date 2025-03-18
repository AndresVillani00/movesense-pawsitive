import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

export const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const productsInCart = store.cart;
  const total_amount = productsInCart.reduce((count, item) => count + item.price, 0);

  useEffect(() => {
    const paymentIntent = () => {
      const uri = `${process.env.BACKEND_URL}/stripeApi/payment-checkout`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: total_amount, currency: "usd" }),
      };
      fetch(uri, options)
        .then((respuesta) => respuesta.json())
        .then((datos) => setClientSecret(datos.clientSecret));
    };
    paymentIntent();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (clientSecret) {
      const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (paymentIntent.status === "succeeded") {
        navigate("/success");
      } else {
        setModalMessage("El pago no se pudo procesar. Inténtalo de nuevo.");
        setShowModal(true);
      }
    } else {
      setModalMessage("Error al procesar el pago. Inténtalo de nuevo.");
      setShowModal(true);
    }
  };

  return (
    <div className="container mt-5">
      <div className="p-4 bg-light rounded">
        {/* Header */}
        <div className="text-center my-4">
          <h1 className="fw-bold text-dark">Proceso de Pago</h1>
          <p className="text-muted">Completa los detalles de tu tarjeta para finalizar la compra.</p>
        </div>

        {/* Formulario de pago */}
        <div className="row justify-content-center">
          <div className="col-md-6"> 
            <div className="card shadow-sm bg-white rounded">
              <div
                className="card-header text-white text-center py-3 rounded-top"
                style={{
                  background: "linear-gradient(135deg, #1E3A5F, #4A69BB, #8FAADC)",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                <h4 className="fw-bold mb-0">Total a pagar: ${total_amount.toFixed(2)}</h4>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Detalles de la tarjeta</label>
                    <div className="border p-4 rounded-3" style={{ backgroundColor: "#f8f9fa" }}> 
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#424770",
                              "::placeholder": {
                                color: "#aab7c4",
                              },
                              iconColor: "#1E3A5F", 
                            },
                            invalid: {
                              color: "#9e2146",
                            },
                          },
                          hidePostalCode: true, 
                        }}
                      />
                    </div>
                  </div>
                  <div className="d-grid">
                    <button
                      className="btn btn-success btn-lg fw-bold py-2"
                      type="submit"
                      disabled={!stripe}
                      style={{ backgroundColor: "#28a745", border: "none" }} 
                    >
                      Pagar 
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para errores de pago */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#1E1E50", color: "#fff" }}>
          <Modal.Title>Error en el Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Reintentar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};