import React from "react";

export const AboutUs = () => {
    return (
        <div className="container py-5">
            <div className="row">
                <div class="card bg-white p-3">
                    <div class="row justify-content-center">
                        <div class="col-md-8 text-center">
                            <h2 class="fw-bold mb-4" style={{ color: '#1B365D' }}>About Us</h2>
                            <p class="lead" style={{ color: "#333" }}>
                                En <strong>Pawsitive</strong> creemos que cada mascota merece una vida sana, feliz y bien cuidada.
                                Nuestra aplicación está diseñada para ayudarte a <strong>monitorizar, analizar y priorizar </strong>
                                la salud de tu compañero de cuatro patas de una manera sencilla e inteligente.
                            </p>
                            <p style={{ color: "#333" }}>
                                Con nuestras herramientas puedes:
                            </p>
                            <ul class="list-unstyled text-start mx-auto" style={{ maxWidth: "500px", color: "#333" }}>
                                <li>✔️ Registrar y dar seguimiento a la alimentación, actividad y comportamiento.</li>
                                <li>✔️ Detectar cambios o incidentes importantes en su salud.</li>
                                <li>✔️ Generar reportes claros para compartir con tu veterinario.</li>
                            </ul>
                            <p class="mt-4" style={{ color: '#333' }}>
                                Nuestro objetivo es darte la tranquilidad de saber que tu mascota está siempre en las mejores manos:
                                <strong>las tuyas, con el apoyo de nuestra tecnología</strong>.
                            </p>
                            <h3 style={{ color: "#1E1E50" }}>Nuestro Equipo</h3>
                            <ul className="list-unstyled">
                                <li className="mb-3">
                                    <strong>Josue Moreno</strong> - CEO
                                </li>
                                <li className="mb-3">
                                    <strong>Jesus Diez</strong> - CTO
                                </li>
                                <li className="mb-3">
                                    <strong>Andres Villani</strong> - Developer
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};