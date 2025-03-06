import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <section className="hero text-center text-white d-flex align-items-center justify-content-center" style={{ background: "#1E1E50", height: "400px" }}>
                <div>
                    <h1 className="fw-bold">Discover Unique Artworks</h1>
                    <p className="fs-5">Explore, Buy, and Support Independent Artists</p>
                    <Link to="/explore" className="btn btn-light fw-bold mt-3">Explorar</Link>
                </div>
            </section>

            {/* Categories */}
            <section className="container mt-5">
                <h2 className="text-center">Categorías</h2>
                <div className="row text-center mt-4">
                    {['Pinturas', 'Cuadros', 'Ropa', 'Varios'].map((category, index) => (
                        <div key={index} className="col-md-3">
                            <div className="card p-3 shadow-sm">
                                <h5>{category}</h5>
                                <Link to={`/category/${category.toLowerCase()}`} className="btn btn-primary mt-2">View</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="container mt-5">
                <h2 className="text-center">Featured Products</h2>
                <div className="row mt-4">
                    {[1, 2, 3, 4].map((product) => (
                        <div key={product} className="col-md-3">
                            <div className="card shadow-sm">
                                <img src={`https://i.imgur.com/gsLEtHk.png`} alt="Product" className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title">Artwork {product}</h5>
                                    <p className="card-text">Amazing piece of art.</p>
                                    <Link to="/product" className="btn btn-dark">View</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Artists */}
            <section className="container mt-5">
                <h2 className="text-center">Featured Artists</h2>
                <div className="row mt-4">
                    {[1, 2, 3].map((artist) => (
                        <div key={artist} className="col-md-4">
                            <div className="card text-center p-3 shadow-sm">
                                <h5>ArtLover {artist}</h5>
                                <Link to="/artists" className="btn btn-outline-primary mt-2">View Profile</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
