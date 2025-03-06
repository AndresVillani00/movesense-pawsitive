import React from "react";
import { Table } from "react-bootstrap";


export const Sales = () => {
    // Simulación de ventas del vendedor
    const sales = [
        { id: 1, product: "Retrato en Acuarela", price: "€250", buyer: "@artLover", date: "2024-02-18" },
        { id: 2, product: "Escultura Moderna", price: "€500", buyer: "@sculptFan", date: "2024-02-12" }
    ];

    const totalIncome = sales.reduce((acc, sale) => acc + parseFloat(sale.price.replace("€", "")), 0);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Mis Ventas</h2>
            <div className="mb-3 text-center">
                <h4>Total Ganancias: <span className="text-success">€{totalIncome}</span></h4>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Comprador</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale) => (
                        <tr key={sale.id}>
                            <td>{sale.product}</td>
                            <td>{sale.price}</td>
                            <td>{sale.buyer}</td>
                            <td>{sale.date}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};