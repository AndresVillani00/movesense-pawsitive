import React from "react";
import { Link } from "react-router-dom";

export const PaymentSuccess = () => {
    return (
        <div className="container text-center py-5">
            <div className="card shadow-lg p-5 bg-success text-white rounded-4">
                <h1 className="display-4 mb-4 mt-5">🎉 ¡Pago Exitoso! 🎉</h1>
                <p className="lead mb-4">
                    Gracias por tu compra. Tu pago se ha procesado correctamente.
                </p>
                <p className="mb-4">
                    Te hemos enviado un correo electrónico con los detalles de tu pedido.
                </p>
                <div className="d-flex justify-content-center gap-3">
                    <Link to="/home" className="btn btn-light btn-lg">
                        Volver al inicio
                    </Link>
                    <Link to="/mis-pedidos" className="btn btn-outline-light btn-lg">
                        Ver mis pedidos
                    </Link>
                </div>
            </div>
        </div>
    );
};