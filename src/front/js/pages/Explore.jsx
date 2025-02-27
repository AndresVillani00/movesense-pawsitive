import React, { useState } from "react";

export const Explore = () => {

    
    const [category, setCategory] = useState("All");
    
    const products = [
        { id: 1, title: "Paisaje en óleo", category: "Pintura", image: "https://i.imgur.com/ZE9DzWg.png" },
        { id: 2, title: "Escultura de mármol", category: "Escultura", image: "https://i.imgur.com/BStVloG.png" },
        { id: 3, title: "Camiseta artística", category: "Ropa", image: "https://i.imgur.com/9V0Bs4W.png" },
        { id: 4, title: "Amanecer Modernista", category: "Pintura", image: "https://i.imgur.com/jDvzxuO.png" },
    ];

    const filteredProducts = category === "All" ? products : products.filter(p => p.category === category);

    return (
        <div className="container mt-5">
            {/* Header */}
            <div className="text-center my-4">
                <h1 className="fw-bold text-dark">Explora Obras de Arte</h1>
                <p className="text-muted">Descubre y adquiere obras únicas de artistas talentosos.</p>
            </div>

            {/* Filtros */}
            <div className="d-flex justify-content-center gap-3 mb-4">
                {['All', 'Pintura', 'Escultura', 'Ropa'].map(cat => (
                    <button
                        key={cat}
                        className={`btn ${category === cat ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid de productos */}
            <div className="row">
                {filteredProducts.map(product => (
                    <div key={product.id} className="col-md-3 mb-4">
                        <div className="card shadow-sm border-0">
                            <img src={product.image} className="card-img-top" alt={product.title} />
                            <div className="card-body text-center">
                                <h5 className="fw-bold">{product.title}</h5>
                                <p className="text-muted">{product.category}</p>
                                <button className="btn btn-outline-dark">Ver Detalles</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
