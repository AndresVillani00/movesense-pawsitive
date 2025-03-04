import React from "react";
import { Table } from "react-bootstrap";

export const Purchases = () => {
    // Simulación de compras del usuario
    const purchases = [
        { id: 1, product: "Pintura Abstracta", price: "€120", date: "2024-02-20", status: "Entregado" },
        { id: 2, product: "Escultura en Mármol", price: "€350", date: "2024-02-15", status: "En tránsito" },
        { id: 3, product: "Lienzo Paisaje", price: "€90", date: "2024-02-10", status: "Entregado" }
    ];

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Mis Compras</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.map((purchase) => (
                        <tr key={purchase.id}>
                            <td>{purchase.product}</td>
                            <td>{purchase.price}</td>
                            <td>{purchase.date}</td>
                            <td>{purchase.status}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
