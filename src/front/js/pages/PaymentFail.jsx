import React from "react";
import { Link } from "react-router-dom";

export const PaymentFail = () => {
    return (
        <div className="container text-center py-5">
            <div className="card shadow-lg p-5 bg-danger text-white rounded-4">
                <h1 className="display-4 mb-4">❌ ¡Pago Fallido! ❌</h1>
                <p className="lead mb-4">
                    Lo sentimos, hubo un problema al procesar tu pago.
                </p>
                <p className="mb-4">
                    Por favor, verifica los detalles de tu método de pago e intenta nuevamente.
                </p>
                <div className="d-flex justify-content-center gap-3">
                    <Link to="/home" className="btn btn-light btn-lg">
                        Volver al inicio
                    </Link>
                    <Link to="/carrito" className="btn btn-outline-light btn-lg">
                        Reintentar pago
                    </Link>
                </div>
            </div>
        </div>
    );
};