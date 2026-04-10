import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

export const Analysis = () => {
    const { store } = useContext(Context);

    const [itemCheck, setItemCheck] = useState([]);
    const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

    const toggleChecks = (id) => {
        if (itemCheck.includes(id)) {
            setItemCheck(itemCheck.filter((sid) => sid !== id));
        } else {
            setItemCheck([...itemCheck, id]);
        }
    };

    const handleDelete = async (event) => {
        event.preventDefault();

        for (var i = 0; i < itemCheck.length; i++) {
            actions.deleteAnalysis(itemCheck[i]);
        }

        setItemCheck([]); // Limpiar selección
    };

    return (
        <section className="col-md-12 p-5">
            <h3>Historico de Analisis de Orina</h3>
            <br></br>
            <div className="d-flex justify-content-end p-2">
                <button className="btn btn-outline-danger" onClick={(event) => handleDelete(event)} hidden={itemCheck.length === 0}>Eliminar</button>
            </div>
            <div className="card p-2 border-0 w-100" style={{ borderRadius: "12px", overflow: "hidden", overflowX: "auto" }}>
                <table className="table table-striped" >
                    <thead style={{ color: "secondary" }}>
                        <tr className="text-center">
                            <th scope="col-md-2"></th>
                            <th scope="col-md-2">Imagen</th>
                            <th scope="col-md-2">Sangre (cacells/µl)</th>
                            <th scope="col-md-2">Bilirubina (µmol/l)</th>
                            <th scope="col-md-2">Urobilinógeno (µmol/l)</th>
                            <th scope="col-md-2">Cetonas (mmol/l)</th>
                            <th scope="col-md-2">Glucosa (mmol/l)</th>
                            <th scope="col-md-2">Proteina (g/l)</th>
                            <th scope="col-md-2">Nitritos</th>
                            <th scope="col-md-2">Leucocitos (cacells/µl)</th>
                            <th scope="col-md-2">PH</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.analysis.map((item, index) => (
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
                                    {item.foto_analysis ? (
                                        <button 
                                            className="btn btn-outline-primary btn-sm" 
                                            style={{ borderRadius: "10px" }}
                                            data-bs-toggle="modal" 
                                            data-bs-target="#modalVerFoto" // Apunta al ID del modal de abajo
                                            onClick={() => setImagenSeleccionada(item.foto_analysis)}
                                        >
                                            <i className="fa-solid fa-eye"></i> Ver Foto
                                        </button>
                                    ) : (
                                        <span className="text-muted small">Sin foto</span>
                                    )}
                                </td>
                                <td>{item.blood != null ? item.blood : '-'}</td>
                                <td>{item.bilirubin != null ? item.bilirubin : '-'}</td>
                                <td>{item.urobiling != null ? item.urobiling : '-'}</td>
                                <td>{item.ketones != null ? item.ketones : '-'}</td>
                                <td>{item.glucose != null ? item.glucose : '-'}</td>
                                <td>{item.protein != null ? item.protein : '-'}</td>
                                <td>{item.nitrite != null ? item.nitrite : '-'}</td>
                                <td>{item.leukocytes != null ? item.leukocytes : '-'}</td>
                                <td>{item.ph != null ? item.ph : '-'}</td>
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
                                        src={imagenSeleccionada} 
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