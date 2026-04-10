import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

export const Incidencias = () => {
    const { store, actions } = useContext(Context);
    const [itemCheck, setItemCheck] = useState([]);
    const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

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
            <div className="card p-2 border-0 w-100" style={{ borderRadius: "12px", overflow: "hidden", overflowX: "auto" }}>
                <div className="d-flex justify-content-end p-2">
                    <button className="btn btn-outline-danger" onClick={(event) => handleDelete(event)} hidden={itemCheck.length === 0}>Eliminar</button>
                </div>
                <table className="table table-responsive" >
                    <thead style={{ color: "secondary" }}>
                        <tr className="text-center">
                            <th scope="col-md-2"></th>
                            <th scope="col-md-2">Imagen</th>
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
                                <td className="text-center">
                                    {/* Solo mostramos el botón si el item tiene foto */}
                                    {item.foto_incidencia != " " && item.foto_incidencia != null ? (
                                        <button 
                                            className="btn btn-outline-primary btn-sm" 
                                            style={{ borderRadius: "10px" }}
                                            data-bs-toggle="modal" 
                                            data-bs-target="#modalVerFoto" // Apunta al ID del modal de abajo
                                            onClick={() => setImagenSeleccionada(item.foto_incidencia)}
                                        >
                                            <i className="fa-solid fa-eye"></i>
                                        </button>
                                    ) : (
                                        <span className="text-muted small">Sin foto</span>
                                    )}
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
                <div className="modal fade" id="modalVerFoto" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg"> {/* modal-lg para que sea grandecito */}
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Foto del Incidente</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    data-bs-dismiss="modal" 
                                    aria-label="Close"
                                    onClick={() => setImagenSeleccionada(null)} // Limpiamos al cerrar
                                ></button>
                            </div>
                            <div className="modal-body text-center p-4">
                                {/* Mostramos la imagen solo si hay algo en el estado */}
                                {imagenSeleccionada ? (
                                    <img 
                                        // Añadimos la cabecera por defecto y luego concatenamos tu variable
                                        src={imagenSeleccionada.includes('data:image') ? imagenSeleccionada : `data:image/jpeg;base64,${imagenSeleccionada}`} 
                                        alt="Evidencia" 
                                        className="img-fluid rounded shadow-sm" 
                                        style={{ maxHeight: '70vh', objectFit: 'contain' }} 
                                    />
                                ) : (
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer d-flex justify-content-center border-0">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    data-bs-dismiss="modal" 
                                    style={{ borderRadius: "30px", padding: "8px 20px" }}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};