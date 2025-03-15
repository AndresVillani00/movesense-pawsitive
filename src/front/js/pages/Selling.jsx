import React, { useContext } from "react";
import { Context } from "../store/appContext";

export const Selling = () => {
    const { store, actions } = useContext(Context);
    const productsForSale = store.products || []; 

    const handleRemoveProduct = async (productId) => {
        const success = await actions.removeProduct(productId);
        if (success) {
            alert("Producto eliminado correctamente");
        } else {
            alert("Error al eliminar el producto");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 fw-bold text-primary">Mis Productos en Venta</h2>
            <div className="row g-4">
                {productsForSale.length > 0 ? (
                    productsForSale.map((product) => (
                        <div key={product.id} className="col-md-4">
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
                                    <h6 className="text-success fw-bold">€{product.price}</h6>
                                    <button 
                                        className="btn btn-danger mt-2 fw-bold" 
                                        onClick={() => handleRemoveProduct(product.id)}
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
        </div>
    );
};
