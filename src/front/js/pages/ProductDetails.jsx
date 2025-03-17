import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { Modal, Button } from "react-bootstrap";

export const ProductDetail = () => {
    const { store } = useContext(Context);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);  
    const [modalMessage, setModalMessage] = useState("");

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
        if (!store.isLogged) {
            setModalMessage("Debes registrarte para realizar una compra.");
            setShowModal(true);
        } else if (store.usuario.is_seller) {
            setModalMessage("Lo siento, para comprar una obra de arte debes registrarte como comprador.");
            setShowModal(true);
        } else {
            alert("Producto añadido al carrito");
        }
    };

    if (!product) return <h2 className="text-center mt-5">Cargando...</h2>;

    const characteristics = parseCharacteristics(product.characteristics);

    const characteristicIcons = {
        material: "🎨",
        size: "📏",
        color: "✨",
        style: "🖼️",
        uniqueness: "🏆",
        shipping: "🚚"
    };

    const sellers = store.artists
    const filteredUser = sellers.filter(seller => seller.id === product.seller_id);

    return (
        <div className="bg-light" style={{ background: "#e9ecef" }}>
            {/* Sección Principal del Producto */}
            <div className="container mt-5 p-4 bg-white rounded-4 shadow-lg">
                <div className="row">
                    <div className="col-md-6 d-flex justify-content-center align-items-center">
                        <img 
                            src={product.image_url} 
                            className="img-fluid rounded-4 product-image" 
                            alt={product.name} 
                            style={{ maxHeight: "600px", objectFit: "cover" }} 
                        />
                    </div>
                    <div className="col-md-6 d-flex flex-column">
                        <h2 className="fw-bold text-center text-dark mb-4">{product.name}</h2>
                        <div className="d-flex align-items-center mb-4">
                            <img
                                src={store.usuario.image_url == null ? "https://i.imgur.com/24t1SYU.jpeg" : store.usuario.image_url}
                                className="rounded-circle owner-avatar"
                                alt="Owner"
                                style={{ width: "40px", height: "40px" }}
                            />
                            <span className="ms-2 text-muted">By <strong>@{filteredUser[0].username || "unknown"}</strong></span>
                        </div>
                        <h4 className="text-primary mb-3">🖼️ Detalles del producto:</h4>
                        <ul className="list-unstyled">
                            {characteristics.map((item, index) => (
                                <li key={index} className="mt-2">
                                    <span className="badge bg-primary me-2">
                                        {characteristicIcons[item.key] || "✨"}  {/* Ícono personalizado */}
                                    </span>
                                    <strong>{item.key}:</strong> {item.value}
                                </li>
                            ))}
                        </ul>
                        <h4 className="mt-4 text-primary">📖 Descripción</h4>
                        <p className="text-muted mt-2">{product.description}</p>
                        <h3 className="text-danger fw-bold mt-3">🔹 {product.availability}</h3>
                        <div className="d-flex align-items-center mt-3">
                            <h4 className="fw-bold text-dark">€ {product.price}</h4>
                            <p className="ms-3 text-muted"><em>{product.extraInfo}</em></p>
                        </div>
                        {/* Mostrar el botón "Añadir al carrito" siempre */}
                        {store.isBuyer ?
                        <button 
                            className="btn btn-success mt-4 w-100 py-2 fw-bold"
                            onClick={handleAddToCart}
                        >
                            🛒 Añadir al carrito
                        </button>
                        :
                        <div></div>
                        }
                    </div>
                </div>
            </div>

            {/* Sección de Otros Productos */}
            <div className="container py-5">
                <h2 className="text-center mb-4 fw-bold" style={{ color: "#1E1E50" }}>
                    🎨 Explora otros productos
                </h2>
                <div className="row g-4">
                    {store.products
                        .filter(p => p.id !== product.id)
                        .slice(0, 3)
                        .map((item) => (
                            <div key={item.id} className="col-md-4">
                                <Link to={`/product-details/${item.id}`} className="text-decoration-none">
                                    <div className="card border-0 shadow-sm h-100 product-card">
                                        <img
                                            src={item.image_url}
                                            className="card-img-top product-card-img"
                                            alt={item.name}
                                            style={{ height: "250px", objectFit: "cover" }}
                                        />
                                        <div className="card-body text-center">
                                            <h5 className="fw-bold" style={{ color: "#1E1E50" }}>{item.name}</h5>
                                            <p className="text-muted">By: <span className="text-primary">@{store.artists.filter(seller => seller.id === item.seller_id)[0].username || "unknown"}</span></p>
                                            <p className="text-dark fw-semibold">{item.category}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                </div>
            </div>

            {/* Modal para usuarios no registrados o vendedores */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: "#1E1E50", color: "#fff" }}>
                    <Modal.Title>Registro Requerido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{modalMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" as={Link} to="/sign-up" onClick={() => setShowModal(false)}>
                        Registrarse
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};