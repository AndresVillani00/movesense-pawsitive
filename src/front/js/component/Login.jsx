import React from "react";

export const Login = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100"
            style={{
                background: "linear-gradient(135deg, #5A189A, #E03E94)",
                fontFamily: "'Poppins', sans-serif"
            }}>
            <div className="card p-5 shadow-lg text-center"
                style={{
                    width: "350px",
                    backdropFilter: "blur(10px)",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "15px",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "white"
                }}>

                <h2 className="fw-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Welcome Back!</h2>
                <p className="mb-4">Log in to your account</p>

                <form>
                    <div className="mb-3 text-start">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-control"
                            placeholder="Enter your email"
                            style={{
                                background: "rgba(255, 255, 255, 0.3)",
                                border: "none",
                                color: "white"
                            }} />
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control"
                            placeholder="Enter your password"
                            style={{
                                background: "rgba(255, 255, 255, 0.3)",
                                border: "none",
                                color: "white"
                            }} />
                    </div>

                    <button className="btn btn-light w-100 fw-bold mt-3"
                        style={{
                            borderRadius: "50px",
                            fontFamily: "'Montserrat', sans-serif",
                            transition: "0.3s"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#ffdde1"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "white"}>
                        Login
                    </button>

                    <button className="btn btn-outline-light w-100 mt-3 d-flex justify-content-center align-items-center"
                        style={{ borderRadius: '50px' }}>
                        <i className="fab fa-google me-2"></i>
                        Or sign in with Google
                    </button>
                </form>

                <p className="mt-3">
                    Don't have an account? <a href="/sign-up" className="text-white fw-bold">Sign up</a>
                </p>
            </div>
        </div>
    );
};
