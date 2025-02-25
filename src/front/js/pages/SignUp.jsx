import React from "react";


export const Signup = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sign up, parte Izquierda */}
                <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-white p-5 rounded text-center"
                    style={{
                        background: "linear-gradient(to bottom right, #5A189A, #E03E94)",
                        minHeight: "100vh"
                    }}>

                    {/* login button  */}
                    <div className="position-absolute top-0 start-0 m-3" style={{ zIndex: 1 }}>
                        <a href="/login" className="btn btn-outline-light">
                            Already a member? Log In
                        </a>
                    </div>
                    {/* Resto del texto izquierda  */}
                    <div>
                        <h1 className="fw-bold display-5">¡Convierte tu arte en éxito!</h1>
                        <p className="fs-5 mt-3">
                            Vende tus creaciones, conecta con otros artistas y descubre eventos exclusivos en tu ciudad.
                        </p>
                        <ul className="list-unstyled mt-3">
                            <li> 🎨  Sube y vende tus obras fácilmente</li>
                            <li> 📅  Publica y descubre eventos artísticos</li>
                            <li> 💰  Conéctate con compradores y galerías</li>
                        </ul>
                        <button className="btn btn-lg btn-light text-dark mt-4 px-5 py-3 fw-bold rounded-pill shadow-lg">
                            <em>¡EMPIEZA HOY!</em>
                        </button>
                    </div>
                </div>

                {/* Sección Derecha: Carrusel y Formulario */}
                <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
                    {/* Carrusel */}
                    <div id="carouselExample" className="carousel slide mb-4 w-100" style={{ maxWidth: "400px" }}>
                        <div className="carousel-inner text-center">
                            {/* Primer slide */}
                            <div className="carousel-item active">
                                <img src="https://i.imgur.com/9V0Bs4W.png" className="d-block img-fluid mx-auto" alt="Slide 1" style={{ maxHeight: "200px" }} />
                            </div>

                            {/* Segundo slide */}
                            <div className="carousel-item">
                                <img
                                    src="https://i.imgur.com/BStVloG.png"
                                    className="d-block img-fluid mx-auto"
                                    alt="Slide 2"
                                    style={{ maxHeight: "300px" }}
                                />
                            </div>

                            {/* Tercer slide */}
                            <div className="carousel-item">
                                <img
                                    src="https://i.imgur.com/jDvzxuO.png"
                                    className="d-block img-fluid mx-auto rounded"
                                    alt="Slide 3"
                                    style={{ maxHeight: "300px" }}
                                />
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
                    <div className="card p-4 shadow-lg" style={{ maxWidth: "350px", width: "100%" }}>
                        <h4 className="mb-3 g-3 text-center">SIGN UP</h4>
                        <form className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label text-center">Name</label>
                                <input type="text" className="form-control" placeholder="John" required />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Last name</label>
                                <input type="text" className="form-control" placeholder="Doe" required />
                            </div>

                            {/* <div className="mb-3 col-md-6">
                              <label className="form-label">Username</label>
                              <div className="input-group">
                                  <span className="input-group-text">@</span>
                                  <input type="text" className="form-control" placeholder="Choose a unique username" required />
                              </div>
                          </div> */}

                            <div className="col-md-6">
                                <label className="form-label">Phone Number</label>
                                <input type="phone" className="form-control" placeholder="12345" required />
                            </div>

                            <div class="col-md-6 text-center">
                                <label for="validationCustom04" class="form-label">Choose your role!</label>
                                <select class="form-select" id="validationCustom04" required>
                                    <option selected disabled value="">Choose...</option>
                                    <option>Buyer 🛒</option>
                                    <option>Seller 🎨</option>
                                </select>
                                <div class="invalid-feedback">
                                    Please select a valid state.
                                </div>
                            </div>

                            <div className="">
                                <label className="form-label">Email address</label>
                                <input type="email" className="form-control" placeholder="name@example.com" required />
                            </div>

                            <div className="">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control" placeholder="Enter password" required />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label">Address</label>
                                <input type="text" className="form-control" placeholder="Comercio Street, number 2" required />
                            </div>

                            <div class="col-md-6">
                                <label for="validationCustom04" class="form-label">City</label>
                                <select class="form-select" id="validationCustom04" required>
                                    <option selected disabled value="">Choose...</option>
                                    <option>Madrid</option>
                                    <option>Barcelona</option>
                                    <option>Valencia</option>
                                </select>
                                <div class="invalid-feedback">
                                    Please select a valid state.
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Zip Code</label>
                                <input type="phone" className="form-control" placeholder="12345" required />
                            </div>

                            <div className="form-check mb-3">
                                <input className="form-check-input" type="checkbox" required />
                                <label className="form-check-label">Agree to terms and conditions</label>
                            </div>

                            <button className="btn btn-primary w-100 mt-3" type="submit">
                                Submit
                            </button>
                            <button className="btn btn-outline-danger w-100 mt-3 d-flex justify-content-center align-items-center" style={{ borderRadius: '50px' }} type="button">
                                <i className="fab fa-google me-2"></i>
                                Or sign up with Google
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};