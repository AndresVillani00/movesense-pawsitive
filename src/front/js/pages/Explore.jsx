import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import { Modal, Button } from "react-bootstrap"; 
import { Link } from "react-router-dom";

export const Explore = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [showModal, setShowModal] = useState(false); 
  const [modalMessage, setModalMessage] = useState(""); 

  const handleCart = (product) => {
    if (!store.isLogged) {
      setModalMessage("Debes registrarte para realizar una compra.");
      setShowModal(true);
    } else if (store.usuario.is_seller) {
      setModalMessage("Lo siento, para comprar una obra de arte debes registrarte como comprador.");
      setShowModal(true);
    } else {
      const dataToSend = { ...product, order_id: store.orderId };
      actions.addToCart(product);
      actions.postOrderItem(dataToSend);
    }
  };

  const products = store.products;
  const filteredProducts = category === "All" ? products : products.filter(p => p.category.toLowerCase() === category.toLowerCase());

  const isProductInCart = (productId) => {
    return store.cart.some((item) => item.id === productId);
  };

  const handleDetails = (product) => {
    actions.setCurrentProduct(product);
    navigate(`/product-details/${product.id}`);
  };

  // Calcular los índices de los productos a mostrar
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-5">
      <div className="p-4 bg-light rounded">
        {/* Header */}
        <div className="text-center my-4">
          <h1 className="fw-bold text-dark">Explora Obras de Arte</h1>
          <p className="text-muted">Descubre y adquiere obras únicas de artistas talentosos.</p>
        </div>

        {/* Filtros */}
        <div className="d-flex justify-content-center gap-3 mb-4">
          {['All', 'pintura', 'ilustracion digital', 'ropa'].map(cat => (
            <button key={cat} className={`btn ${category === cat ? "btn-primary" : "btn-outline-primary"}`} onClick={() => { setCategory(cat); setCurrentPage(1); }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        <div className="row">
          {currentProducts.map(product => (
            <div key={product.id} className="col-md-3 mb-4">
              <div className="card shadow-sm bg-white">
                <img src={product.image_url} alt={`Imagen de ${product.name}`} className="card-img-top rounded" style={{ height: "200px", objectFit: "cover", width: "100%" }} />
                <div className="card-body text-center">
                  <h5 className="fw-bold">{product.name}</h5>
                  <p className="text-muted">{product.category}</p>

                  {/* Botón para ver detalles */}
                  <button className="btn btn-outline-dark me-2" onClick={() => handleDetails(product)}>
                    Ver Detalles
                  </button>

                  {/* Botón para añadir al carrito */}
                  {isProductInCart(product.id) ? (
                    <button className="btn btn-outline-danger" onClick={() => actions.removeFromCart(product.id)}>
                      <i className="fas fa-trash text-end"></i>
                    </button>
                  ) : (
                    <button className="btn btn-success" onClick={() => handleCart(product)}>
                      <i className="fas fa-shopping-cart text-end"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="d-flex justify-content-center">
          <Pagination>
            {[...Array(Math.ceil(filteredProducts.length / productsPerPage)).keys()].map(number => (
              <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                {number + 1}
              </Pagination.Item>
            ))}
          </Pagination>
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