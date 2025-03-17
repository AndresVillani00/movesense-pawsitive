import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";

export const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { store } = useContext(Context)
  const navigate = useNavigate();
  const [ clientSecret, setClientSecret ] = useState(false);
  const productsInCart = store.cart;
  const total_amount = productsInCart.reduce((count, item) => count + item.price, 0);

  useEffect(() => {
    const paymentIntent = () => {
      const uri = `${process.env.BACKEND_URL}/stripeApi/payment-checkout`;
			const options = {
				method:'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ amount:total_amount, currency:'usd' })
			};
			fetch(uri, options).then((respuesta) => respuesta.json()).then((datos) => setClientSecret(datos.clientSecret));
      
    }
    paymentIntent()
  }, [])

  const handleSubmit = async(event) => {
    event.preventDefault();


    if(!stripe || !elements){
      return
    }

    
    if(clientSecret){
      const { paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,{
          payment_method:{
            card: elements.getElement(CardElement)
          }
        }
      );

      if(paymentIntent.status == "succeeded") {
        navigate('/success')
      }
    } else {
      navigate('/fail')
    }
  }

  return (
    <div className="container p-5">
      <div className="row">
        <form onSubmit={handleSubmit}>
          <CardElement />
          <div className="p-5">
            <button className="btn btn-success" type="submit" disabled={!stripe}>Pagar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
