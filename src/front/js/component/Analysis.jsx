import React, { useEffect, useState, useRef, useContext } from "react";
import { Context } from "../store/appContext";
import { Alert } from "./Alert.jsx";
import AnalisisFoto from '../../img/Analisis.jpeg';

export const Analysis = () => {
    const { store } = useContext(Context);

    const [itemCheck, setItemCheck] = useState([]);

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
            <div className="card p-2 border-0" style={{ borderRadius: "12px" }}>
                <table className="table table-striped" >
                    <thead style={{ color: "secondary" }}>
                        <tr className="text-center">
                            <th scope="col-md-2"></th>
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
            </div>
        </section>
    );

};