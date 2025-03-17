import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState, useContext } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";

export const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { store, actions } = useContext(Context)
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState(false);

  const handleSubmit = async(event) => {
    event.preventDefault();
    actions.usePayment(store.totalAmount, 'usd');

    if(!stripe || !elements){
      return
    }
    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      store.secretClient,{
        payment_method:{
          card: elements.getElement(CardElement)
        }
      }
    );
    setLoading(false);

    if(error){
      store.alert = { text: error, background: "danger", visible: true };
    } else if(paymentIntent.status == "succeeded") {
      navigate('/success')
    } else {
      store.alert = { text: "Error inesperado", background: "danger", visible: true };
    }
  }

  return (
    <div className="container p-5">
      <div className="row">
        <form onSubmit={handleSubmit}>
          <CardElement />
          <div className="p-5">
            <button className="btn btn-success" type="submit" disabled={!stripe || loading}>Pagar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
