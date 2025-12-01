import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

export const Incidencias = () => {
    const { store, actions } = useContext(Context);
    const [itemCheck, setItemCheck] = useState([]);

    const toggleChecks = (id) => {
        if (itemCheck.includes(id)) {
            setItemCheck(itemCheck.filter((sid) => sid !== id));
        } else {
            setItemCheck([...itemCheck, id]);
        }
    };

    const formatDateTime = (value) => {
        if (!value) return null;

        const date = new Date(value);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const ss = '00'; // datetime-local no incluye segundos

        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    }

    const handleDelete = async (event) => {
        event.preventDefault();

        for (var i = 0; i < itemCheck.length; i++) {
            actions.deleteIncidencia(itemCheck[i]);
        }

        setItemCheck([]); // Limpiar selección
    };

    return (
        <section className="col-md-12 p-5">
            <h3>Historico de Incidencias</h3>
            <br></br>
            <div className="card p-2 border-0" style={{ borderRadius: "12px" }}>
                <div className="d-flex justify-content-end p-2">
                    <button className="btn btn-outline-danger" onClick={(event) => handleDelete(event)} hidden={itemCheck.length === 0}>Eliminar</button>
                </div>
                <table className="table table-responsive" >
                    <thead style={{ color: "secondary" }}>
                        <tr className="text-center">
                            <th scope="col-md-2"></th>
                            <th scope="col-md-2">Tipo</th>
                            <th scope="col-md-2">Fecha de Inicio</th>
                            <th scope="col-md-2">Fecha de Fin</th>
                            <th scope="col-md-2">Descripción</th>
                            <th scope="col-md-2">Bueno/Malo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.incidencias.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={itemCheck.includes(item.id)}
                                        onChange={() => toggleChecks(item.id)}
                                    />
                                </td>
                                <td>{item.title != null ? item.title : '-'}</td>
                                <td>{item.initial_date != null ? formatDateTime(item.initial_date) : '-'}</td>
                                <td>{item.final_date != null ? formatDateTime(item.final_date) : '-'}</td>
                                <td>{item.description != null ? item.description : '-'}</td>
                                <td>{item.alert_status != null ? item.alert_status : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};