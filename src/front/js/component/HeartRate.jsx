import React, { useEffect, useState, useRef, useContext, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Context } from "../store/appContext";
import { Alert } from "./Alert.jsx";

export const HeartRate = () => {
    const { store, actions } = useContext(Context);

    const [showModal, setShowModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [date, setDate] = useState('');
    const [daysRange, setDaysRange] = useState(5);
    const [itemCheck, setItemCheck] = useState([]);

    const [value, setValue] = useState('');
    const [note, setNote] = useState('');
    
    const modalRef = useRef(null);
    const bsModal = useRef(null);

    const modalAlertRef = useRef(null);
    const bsAlertModal = useRef(null);
    
    const metricasHeartRate = store.metricas != null ? store.metricas.filter(metricas => metricas.tipo_metrica_id === 'heart_rate' && metricas.mascota_metrica_id === store.idParam) : null;
    
    useEffect(() => {
        // Cargar modal de Bootstrap solo una vez
        if (modalRef.current) {
            bsModal.current = new window.bootstrap.Modal(modalRef.current, {
                backdrop: 'static',
                keyboard: false,
            });
        }

        if (modalAlertRef.current) {
            bsAlertModal.current = new window.bootstrap.Modal(modalAlertRef.current, {
                backdrop: 'static',
                keyboard: false,
            });
        }
    }, []);
    
    useEffect(() => {
        if (bsModal.current) {
            showModal ? bsModal.current.show() : bsModal.current.hide();
        }

        if (bsAlertModal.current) {
            showAlertModal ? bsAlertModal.current.show() : bsAlertModal.current.hide();
        }
    }, [showModal, showAlertModal]);

    const filteredData = [...metricasHeartRate].sort(
        (a, b) => new Date(a.ts_init) - new Date(b.ts_init)
    );

    const values = filteredData.map(d => d.valor_diario);
    const min = Math.floor(Math.min(...values) / 5) * 5;
    const max = Math.ceil(Math.max(...values) / 5) * 5;

    const ticks = [];
    for (let i = min; i <= max; i += 5) {
        ticks.push(i);
    }

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
    
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const startDate = formatDateTime(date);
    
        const dataToSend = {
            valor_diario: value,
            note,
            ts_init: startDate,
            mascota_metrica_id: store.idParam,
            tipo_metrica_id: 'heart_rate'
        }
        await actions.postMetrica(dataToSend);
        setShowModal(false);

        const result_pulso = store.alertas.result_pulso;
        const alertasRojas = result_pulso != null ? result_pulso.filter(rojas => rojas.Alarma === "Rojo" ) : null;
        const rangoPulsoRojo = alertasRojas[0].RangoPulso;
        if(value <= rangoPulsoRojo.MenorQue || value >= rangoPulsoRojo.MayorQue){
            setShowAlertModal(true);
        }
    };

    const handleAlertSubmit = async (event) => {
        event.preventDefault();

        const dataToSend = {
            type: 'Heart Rate',
            danger_value: value,
            source: 'Automatic',
            description: note,
            traffic_light: 'rojo',
            status_read: 'noleido',
            mascota_alerts_id: store.idParam
        }
        await actions.postAlert(dataToSend);
        setShowAlertModal(false);
    };

    const handleDelete = async (event) => {
        event.preventDefault();

        for(var i = 0; i < itemCheck.length; i++){
            actions.deleteMetrica(itemCheck[i]);
        }

        setItemCheck([]); // Limpiar selección
    };

    const handleCancel = () => {
        setShowModal(false); 
        store.alert = { text: "", background: "primary", visible: false }
    }

    return (
        <section className="col-md-12 p-5">
            <h3>Historico del Pulso</h3>
            <br></br>
            <div className="card p-2 border-0" style={{ borderRadius: "12px" }}>
                <div className="d-flex justify-content-end p-2">
                    <div className="mx-3">
                        <button className="btn btn-outline-secondary" onClick={() => setShowModal(true)}>Introducir valor manualmente</button>
                    </div>
                    <button className="btn btn-outline-danger" onClick={(event) => handleDelete(event)} hidden={itemCheck.length === 0}>Eliminar</button>
                </div>
                <div className="modal fade" tabIndex="-1" ref={modalRef} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="container modal-content">
                            <div className="modal-header row">
                                <div className="d-flex justify-content-between">
                                    <h1 className="modal-title fs-4 col-md-8">Registrar Pulso</h1>
                                    <button type="button" className="btn-close col-md-4" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleCancel()}></button>
                                </div>
                                <p className="col-md-12">Introduce los detalles del pulso de tu mascota</p>
                                <Alert />
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit} className="row g-3">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Pulso (bpm)</label>
                                        <input type="text" name="weight" className="form-control" value={value} onChange={(event) => setValue(event.target.value)} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Fecha de Inicio</label>
                                        <input type="datetime-local" name="date" className="form-control" value={date} onChange={(event) => setDate(event.target.value)} required />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label fw-semibold">Nota (Opcional)</label>
                                        <input type="text" name="note" className="form-control" value={note} onChange={(event) => setNote(event.target.value)} />
                                    </div>
                                    <div className="row my-3">
                                        <div className="d-flex justify-content-between">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                                                onClick={() => handleCancel()} style={{
                                                    borderRadius: "30px", padding: "10px 20px"
                                                }}>Cancelar</button>
                                            <button type="submit" className="btn btn-primary" style={{
                                                color: "white",
                                                background: "#ff6100",
                                                border: "#ff6100",
                                                borderRadius: "30px",
                                                padding: "10px 20px"
                                            }}>Enviar</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" tabIndex="-1" ref={modalAlertRef} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="container modal-content">
                            <div className="modal-header row">
                                <div className="d-flex justify-content-between">
                                    <h1 className="modal-title fs-4 col-md-8">Alerta</h1>
                                    <button type="button" className="btn-close col-md-4" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowAlertModal(false)}></button>
                                </div>
                            </div>
                            <div className="modal-body">
                                <p className="col-md-12">El valor que acabas de introducir se encuentra en el rango 'Peligro', desea informar a un Veterinario ?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                                    onClick={() => setShowAlertModal(false)} style={{
                                        borderRadius: "30px", padding: "10px 20px"
                                    }}>Cancel</button>
                                <button type="button" onClick={(event) => handleAlertSubmit(event)} className="btn btn-primary" style={{
                                    color: "white",
                                    background: "#ff6100",
                                    border: "#ff6100",
                                    borderRadius: "30px",
                                    padding: "10px 20px"
                                }}>Enviar</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={filteredData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ts_init" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                            <YAxis unit="bpm" domain={['auto', 'auto']} ticks={ticks} tickFormatter={(v) => `${v}`} />
                            <Tooltip formatter={(v) => `${v} bpm`} />
                            <Line
                                type="monotone"
                                dataKey="valor_diario"
                                stroke="#00b3b3"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-3 d-flex gap-2 justify-content-end">
                        {[1, 5, 30, 90].map((d) => (
                            <button
                                key={d}
                                className={`btn btn-sm ${daysRange === d ? "btn-primary" : "btn-outline-secondary"}`}
                                onClick={() => setDaysRange(d)}
                            >
                                {d}d
                            </button>
                        ))}
                    </div>
                </div>
                <table className="table table-striped" >
                    <thead style={{ color: "secondary" }}>
                        <tr className="text-center">
                            <th scope="col-md-2"></th>
                            <th scope="col-md-2">Fecha</th>
                            <th scope="col-md-2">Pulso</th>
                            <th scope="col-md-2">Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metricasHeartRate.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td>
                                    <input
                                    type="checkbox"
                                    checked={itemCheck.includes(item.id)}
                                    onChange={() => toggleChecks(item.id)}
                                    />
                                </td>
                                <td>{item.ts_init != null ? formatDateTime(item.ts_init) : '-'}</td>
                                <td>{item.valor_diario != null ? item.valor_diario + " bpm" : '-'}</td>
                                <td>{item.note != null ? item.note : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
