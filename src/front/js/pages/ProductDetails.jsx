import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { Button, Modal } from "react-bootstrap";

export const ProductDetail = () => {
    const { store } = useContext(Context);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const foundProduct = store.products.find(p => p.id === Number(id));
        setProduct(foundProduct);
    }, [id, store.products]);

    const parseCharacteristics = (characteristics) => {
        if (!characteristics) return [];
        return characteristics.split(",").map((item) => {
            const [key, value] = item.split(":");
            return { key: key.trim(), value: value.trim() };
        });
    };

    const handleAddToCart = () => {
        if (!store.isLogged || store.usuario.is_seller) {
            setShowModal(true);
        } else {
            alert("Producto añadido al carrito");
        }
    };

    if (!product) return <h2 className="text-center mt-5">Cargando...</h2>;

    const characteristics = parseCharacteristics(product.characteristics);

    return (
        <div className="bg-light" style={{ background: "#f8f9fa" }}>
            <div className="container mt-5 p-4 bg-white rounded-4 shadow">
                <div className="row">
                    {/* Imagen del producto */}
                    <div className="col-md-6 d-flex justify-content-center align-items-center">
                        <img 
                            src={product.image_url} 
                            className="img-fluid rounded-4" 
                            alt={product.name} 
                            style={{ maxHeight: "550px", objectFit: "cover" }} 
                        />
                    </div>

                    {/* Detalles del producto */}
                    <div className="col-md-6 d-flex flex-column">
                        <h2 className="fw-bold text-dark mb-3">{product.name}</h2>

                        {/* Vendedor */}
                        <div className="d-flex align-items-center mb-3">
                            <img
                                src={product.seller_to?.image_url || "https://i.imgur.com/24t1SYU.jpeg"}
                                className="rounded-circle"
                                alt="Vendedor"
                                style={{ width: "40px", height: "40px", objectFit: "cover", border: "2px solid #1E1E50" }}
                            />
                            <span className="ms-2 text-muted">
                                Creado por: <strong className="text-dark">@{product.seller_to?.username || "Desconocido"}</strong>
                            </span>
                        </div>

                        {/* Características */}
                        <h5 className="text-primary mt-3">Características</h5>
                        <ul className="list-unstyled">
                            {characteristics.map((item, index) => (
                                <li key={index} className="mt-2">
                                    <strong>{item.key}:</strong> {item.value}
                                </li>
                            ))}
                        </ul>

                        {/* Descripción */}
                        <h5 className="text-primary mt-3">Descripción</h5>
                        <p className="text-muted">{product.description}</p>

                        {/* Precio */}
                        <div className="d-flex align-items-center mt-3">
                            <h3 className="fw-bold text-danger me-3 mb-0">€ {product.price}</h3>
                        </div>

                        {/* Botón de Añadir al carrito */}
                        <Button 
                            variant="success" 
                            className="mt-4 py-2 fs-5 fw-bold" 
                            onClick={handleAddToCart}
                        >
                            🛒 Añadir al carrito
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal de Login / Sign Up */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Regístrate o inicia sesión</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Para comprar esta obra de arte, por favor inicia sesión o regístrate.</p>
                    <div className="d-flex justify-content-around">
                        <Link to="/login">
                            <Button variant="primary">Iniciar sesión</Button>
                        </Link>
                        <Link to="/sign-up">
                            <Button variant="secondary">Registrarse</Button>
                        </Link>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};
