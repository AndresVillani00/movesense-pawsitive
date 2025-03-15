import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";

export const ProductDetail = () => {
    const { store } = useContext(Context);
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const foundProduct = store.products.find(p => p.id === Number(id)); 
        setProduct(foundProduct);
    }, [id, store.products]);

    if (!product) return <h2>Cargando...</h2>;

    return (
        <div className="container mt-5 p-4 bg-light rounded shadow-lg">
            <div className="row mb-5 p-4 bg-white rounded shadow-sm">
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <img src={product.image_url} className="img-fluid rounded" alt={product.name} />
                </div>
                <div className="col-md-6 d-flex flex-column">
                    <h2 className="fw-bold text-center">{product.name}</h2>
                    <div className="mt-3 d-flex align-items-center">
                        <img
                            src="https://i.imgur.com/24t1SYU.jpeg"
                            className="rounded-circle img-fluid"
                            alt="Owner"
                            style={{ width: "40px", height: "40px" }}
                        />
                        <span className="ms-2 text-muted">By <strong>@{product.owner}</strong></span>
                    </div>
                    <h4 className="mt-4 text-primary">🖼️ Detalles del producto:</h4>
                    <ul className="list-unstyled">
                        <li className="mt-2">🎨 {product.material}</li>
                        <li className="mt-2">✨ {product.features}</li>
                        <li className="mt-2">🏆 {product.uniqueness}</li>
                        <li className="mt-2">🚚 {product.shipping}</li>
                    </ul>
                    <h4 className="mt-3">📖 Descripción</h4>
                    <p className="text-muted mt-2">{product.description}</p>
                    <h3 className="text-danger fw-bold mt-2">🔹 {product.availability}</h3>
                    <div className="d-flex align-items-center mt-3">
                        <h4 className="fw-bold text-dark">€ {product.price}</h4>
                        <p className="ms-3 text-muted"><em>{product.extraInfo}</em></p>
                    </div>
                    <button className="btn btn-success mt-3">Añadir al carrito</button>
                </div>
            </div>

            <h3 className="text-center mb-4 fw-bold text-dark">🎨 Explora otros productos</h3>
            <div className="row">
                {store.products.slice(0, 3).map((item) => (
                    <div key={item.id} className="col-md-4 mb-4">
                        <div className="card border-0 shadow-sm">
                            <img src={item.image_url} className="card-img-top" alt={item.name} />
                            <div className="card-body text-center">
                                <div className="d-flex justify-content-end">
                                    <span className="text-danger">❤️ {item.likes}</span>
                                </div>
                                <h5 className="mt-2">{item.name}</h5>
                                <p className="text-muted">By: <span className="text-primary">@{item.owner}</span></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
