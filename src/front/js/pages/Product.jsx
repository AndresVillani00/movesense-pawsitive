import React from "react";


export const Product = () => {
    return (
        <div className="container mt-5 p-4 bg-light rounded shadow-lg">
            {/* Destacado */}
            <div className="row mb-5 p-4 bg-white rounded shadow-sm">
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <img src="https://i.imgur.com/5blpkAc.png" className="img-fluid rounded" alt="NFT Featured" />
                </div>
                <div className="col-md-6 d-flex flex-column">
                    <h2 className="fw-bold text-center">Frida y el resplandor modernista, estilo Klimt</h2>

                    <div className="mt-3 d-flex align-items-center">
                        <img
                            src="https://i.imgur.com/24t1SYU.jpeg"
                            className="rounded-circle img-fluid"
                            alt="Owner"
                            style={{ width: "40px", height: "40px" }}
                        />
                        <span className="ms-2 text-muted">By <strong>@nishar</strong></span>
                    </div>
                    <h4 className="mt-4 text-primary">🖼️ Detalles de la obra:</h4>
                    <ul className="list-unstyled">
                        <li className="mt-2">🎨 Óleo sobre lienzo de lino</li>
                        <li className="mt-2">✨ 100% pintado a mano</li>
                        <li className="mt-2">🏆 Pieza única y original</li>
                        <li className="mt-2">🚚 Envío gratis a Madrid, Barcelona y Valencia</li>
                    </ul>
                    <h4 className="mt-3">📖 Descripción</h4>
                    <p className="text-muted mt-2">Un tributo a la fusión del arte y la historia. Esta obra captura la esencia de Frida Kahlo con el brillo dorado y la ornamentación de Gustav Klimt, creando una pieza vibrante y llena de significado.</p>
                    <h3 className="text-danger fw-bold mt-2">🔹 Única pieza disponible. ¡Añádela a tu colección!</h3>
                    <div className="d-flex align-items-center mt-3">
                        <h4 className="fw-bold text-dark">€ 235,00 EUR</h4>
                        <p className="ms-3 text-muted"><em>Envío e IVA incluidos</em></p>
                    </div>
                    <button className="btn btn-success mt-3">Añadir al carrito</button>
                </div>
            </div>

            {/* Top Artworks */}
            <h3 className="text-center mb-4 fw-bold text-dark">🎨 Explora otros artistas</h3>
            <div className="row">
                {[1, 2, 3].map((index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card border-0 shadow-sm">
                            <img src="https://i.imgur.com/ZE9DzWg.png" className="card-img-top" alt="NFT Art" />
                            <div className="card-body text-center">
                                <div className="d-flex justify-content-end">
                                    <span className="text-danger">❤️ 92</span>
                                </div>
                                <h5 className="mt-2">Noche de Madrid, estilo Van Gogh</h5>
                                <p className="text-muted">By: <span className="text-primary">@wizard</span></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
