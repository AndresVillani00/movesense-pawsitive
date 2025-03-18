import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";  // Importar componentes de Bootstrap

export const Selling = () => {
    const { store, actions } = useContext(Context);
    const products = store.products;
    const productsUser = products.filter(p => p.seller_id === store.usuario.id);
    const productsForSale = productsUser || [];
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const handleRemoveProduct = async (productId) => {
        const success = await actions.removeProduct(productId);
        if (success) {
            store.alert = { text: "Producto eliminado correctamente", background: "primary", visible: true };
        } else {
            store.alert = { text: "Error al eliminar el producto", background: "danger", visible: true };
        }
        setShowDeleteModal(false);
    };

    const confirmDelete = (productId) => {
        setProductToDelete(productId);
        setShowDeleteModal(true);
    };

    return (
        <div className="container mt-5">
            {/* Publicar un nuevo producto */}
            <div className="d-flex justify-content-end mb-4">
                <Link to="/post-product" className="btn btn-primary fw-bold px-4">
                    🛍️ Publicar un Producto
                </Link>
            </div>

            <h2 className="text-center mb-4 fw-bold text-primary">Mis Productos en Venta</h2>
            <div className="row g-4">
                {productsForSale.length > 0 ? (
                    productsForSale.map((product) => (
                        <div key={product.id} className="col-md-3">
                            <div className="card shadow-sm rounded-4 border-0">
                                <img
                                    src={product.image_url}
                                    className="card-img-top rounded-top-4"
                                    alt={product.name}
                                    style={{ height: "250px", objectFit: "cover" }}
                                />
                                <div className="card-body text-center">
                                    <h5 className="card-title fw-bold text-primary">{product.name}</h5>
                                    <p className="card-text text-muted">{product.description}</p>
                                    <h6 className="text-success fw-bold">{product.price}€</h6>
                                    <button
                                        className="btn btn-danger mt-2 fw-bold"
                                        onClick={() => confirmDelete(product.id)}  // Mostrar modal de confirmación
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted">No tienes productos en venta</p>
                )}
            </div>

            {/* Modal de confirmación */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: "#1E1E50", color: "#fff" }}>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Estás seguro de que deseas eliminar este producto?</p>
                </Modal.Body>
                <Modal.Footer className="text-center">
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => handleRemoveProduct(productToDelete)}
                    >
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};