import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const PaymentSuccess = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const sessionId = queryParams.get("session_id");

        if (sessionId) {
            fetch(`${process.env.BACKEND_URL}/stripeApi/validate-subscription?session_id=${sessionId}`)
                .then(res => res.json())
                .then(data => {
                    setActive(data.active);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [location]);

    if (loading) return <h3 className="text-center mt-5">Verificando tu suscripción...</h3>;

    if (!active) {
        return (
            <div className="container text-center py-5">
                <div className="card shadow-lg p-5 bg-warning text-dark rounded-4">
                    <h1 className="display-5 mb-4">⚠️ Suscripción no encontrada</h1>
                    <p className="lead mb-4">Tu pago fue recibido, pero aún no se activó la suscripción.</p>
                    <Link to="/home" className="btn btn-dark btn-lg">Volver al inicio</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container text-center py-5">
            <div className="card shadow-lg p-5 bg-success text-white rounded-4">
                <h1 className="display-4 mb-4 mt-5">🎉 ¡Suscripción activa! 🎉</h1>
                <p className="lead mb-4">Gracias, ya puedes disfrutar de todas las funciones premium.</p>
                <Link to="/home" className="btn btn-light btn-lg">Volver al inicio</Link>
            </div>
        </div>
    );
};
