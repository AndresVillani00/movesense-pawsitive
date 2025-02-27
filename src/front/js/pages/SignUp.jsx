import React from "react";

export const SignUp = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sección Izquierda - Información con Diseño Premium */}
                <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white p-5 text-center"
                    style={{
                        background: "linear-gradient(135deg, #1E3A5F, #4A69BB, #8FAADC)",
                        minHeight: "100vh",
                        fontFamily: "'Poppins', sans-serif"
                    }}>
                    
                    <h1 className="fw-bold display-4">Únete a la comunidad de arte</h1>
                    <p className="fs-5 mt-3">
                        Vende, descubre y colecciona arte de todo el mundo.
                    </p>
                    <ul className="list-unstyled mt-3">
                        <li> 🎨  Sube y vende tus obras fácilmente</li>
                        <li> 📅  Explora eventos artísticos</li>
                        <li> 💰  Conéctate con compradores y artistas</li>
                    </ul>
                    <button className="btn btn-lg btn-light text-dark mt-4 px-5 py-3 fw-bold rounded-pill shadow-lg">
                        ¡Empieza hoy!
                    </button>
                </div>

                {/* Sección Derecha - Carrusel y Formulario */}
                <div className="col-md-6 d-flex flex-column justify-content-center align-items-center"
                    style={{ 
                        fontFamily: "'Montserrat', sans-serif", 
                        background: "linear-gradient(135deg, #F8F9FA, #DEE2E6)", 
                        minHeight: "100vh"
                    }}>
                    
                    {/* Carrusel */}
                    <div id="carouselExample" className="carousel slide mb-4 w-100" style={{ maxWidth: "400px" }}>
                        <div className="carousel-inner text-center">
                            <div className="carousel-item active">
                                <img src="https://i.imgur.com/9V0Bs4W.png" className="d-block img-fluid mx-auto" alt="Slide 1" style={{ maxHeight: "200px" }} />
                            </div>
                            <div className="carousel-item">
                                <img src="https://i.imgur.com/BStVloG.png" className="d-block img-fluid mx-auto" alt="Slide 2" style={{ maxHeight: "300px" }} />
                            </div>
                            <div className="carousel-item">
                                <img src="https://i.imgur.com/jDvzxuO.png" className="d-block img-fluid mx-auto rounded" alt="Slide 3" style={{ maxHeight: "300px" }} />
                            </div>
                        </div>

                        {/* Controles del carrusel */}
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>

                    {/* Formulario */}
                    <div className="card p-4 shadow-lg border-0" style={{ maxWidth: "400px", width: "100%", borderRadius: "12px" }}>
                        <h4 className="text-center mb-3">Crear Cuenta</h4>
                        <form className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Nombre</label>
                                <input type="text" className="form-control" placeholder="John" required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Apellido</label>
                                <input type="text" className="form-control" placeholder="Doe" required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Teléfono</label>
                                <input type="text" className="form-control" placeholder="+34 600 123 456" required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Rol</label>
                                <select className="form-select" required>
                                    <option selected disabled value="">Seleccionar...</option>
                                    <option>Comprador 🛒</option>
                                    <option>Vendedor 🎨</option>
                                </select>
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Username</label>
                                <div className="input-group">
                                    <span className="input-group-text">@</span>
                                    <input type="text" className="form-control" placeholder="Tu usuario único" required />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Correo Electrónico</label>
                                <input type="email" className="form-control" placeholder="name@example.com" required />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Contraseña</label>
                                <input type="password" className="form-control" placeholder="Mínimo 8 caracteres" required />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Dirección</label>
                                <input type="text" className="form-control" placeholder="Calle, número, ciudad" required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Ciudad</label>
                                <select className="form-select" required>
                                    <option selected disabled value="">Seleccionar...</option>
                                    <option>Madrid</option>
                                    <option>Barcelona</option>
                                    <option>Valencia</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Código Postal</label>
                                <input type="text" className="form-control" placeholder="12345" required />
                            </div>
                            <div className="form-check mb-3">
                                <input className="form-check-input" type="checkbox" required />
                                <label className="form-check-label">Acepto los términos y condiciones</label>
                            </div>
                            <button className="btn btn-primary w-100 mt-3">Registrarse</button>
                            <button className="btn btn-outline-danger w-100 mt-3 d-flex justify-content-center align-items-center rounded-pill" type="button">
                                <i className="fab fa-google me-2"></i>
                                Registrarse con Google
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
