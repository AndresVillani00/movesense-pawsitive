import React, { useEffect, useState, useRef, useContext } from "react";
import { Context } from "../store/appContext.js";
import { Alert } from "../component/Alert.jsx";

export const PesoButton = () => {
    const { store, actions } = useContext(Context);

    const [showModal, setShowModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [date, setDate] = useState('');

    const [value, setValue] = useState('');
    const [note, setNote] = useState('');

    const modalRef = useRef(null);
    const bsModal = useRef(null);

    const modalAlertRef = useRef(null);
    const bsAlertModal = useRef(null);

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
            tipo_metrica_id: 'weight'
        }
        await actions.postMetrica(dataToSend);
        setShowModal(false);

        const result_peso = store.alertas.result_peso;
        const alertasRojas = result_peso != null ? result_peso.filter(rojas => rojas.Alarma === "Rojo") : null;
        console.log(alertasRojas)
        const rangoPesoRojo = alertasRojas[0].RangoPeso;
        if (value <= rangoPesoRojo.MenorQue || value >= rangoPesoRojo.MayorQue) {
            setShowAlertModal(true);
        }
    };

    const handleAlertSubmit = async (event) => {
        event.preventDefault();

        const dataToSend = {
            type: 'Weight',
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

    const handleCancel = () => {
        setShowModal(false);
        store.alert = { text: "", background: "primary", visible: false }
    }

    return (
        <div>
            <div className="d-flex justify-content-end p-2">
                <div className="mx-3">
                    <button className="btn btn-outline-secondary" onClick={() => setShowModal(true)}><i className="fa-solid fa-plus"></i></button>
                </div>
            </div>
            <div className="modal fade" tabIndex="-1" ref={modalRef} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="container modal-content">
                        <div className="modal-header row">
                            <div className="d-flex justify-content-between">
                                <h1 className="modal-title fs-4 col-md-8">Registrar Peso</h1>
                                <button type="button" className="btn-close col-md-4" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleCancel()}></button>
                            </div>
                            <p className="col-md-12">Introduce los detalles del peso de tu mascota.</p>
                            <Alert />
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit} className="row g-3">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Valor del Peso (kg)</label>
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
                                }}>Cancelar</button>
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
        </div>
    )
}
