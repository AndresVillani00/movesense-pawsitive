import React, { useEffect, useState, useRef, useContext } from "react";
import { Context } from "../store/appContext.js";
import { Alert } from "../component/Alert.jsx";

export const IncidenciasButton = () => {
    const { store, actions } = useContext(Context);

    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState('');

    const [status, setStatus] = useState('Bad');
    const [initialDate, setInitialDate] = useState('');
    const [finalDate, setFinalDate] = useState('');
    const [description, setDescription] = useState('');

    const modalRef = useRef(null);
    const bsModal = useRef(null);

    const checkform = ['Vómito', 'Diarrea', 'Problema de la piel', 'Pelea', 'Otro']

    useEffect(() => {
        // Cargar modal de Bootstrap solo una vez
        if (modalRef.current) {
            bsModal.current = new window.bootstrap.Modal(modalRef.current, {
                backdrop: 'static',
                keyboard: false,
            });
        }
    }, []);

    useEffect(() => {
        if (bsModal.current) {
            showModal ? bsModal.current.show() : bsModal.current.hide();
        }
    }, [showModal]);

    const handleCheckboxChange = (value) => {
        setSelected((prev) => (prev === value ? '' : value));
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

        const startDate = formatDateTime(initialDate);
        const endDate = formatDateTime(finalDate);

        const dataToSend = {
            title: selected,
            initial_date: startDate,
            final_date: endDate,
            description,
            alertStatus: status,
            foto_incidencia: store.fotoJsonIncidencia != null ? store.fotoJsonIncidencia.foto : null,
            mascota_incidencia_id: store.idParam
        }

        if (!selected) {
            store.alert = { text: "Debe seleccionar una opcion", background: "danger", visible: true };
            return;
        }


        store.alert = { text: "", background: "primary", visible: false };

        await actions.postIncidencia(dataToSend);

        if (store.fotoJsonIncidencia != null) {
            setShowModal(false);
        }
    };

    const handleCapture = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;
            actions.setFotoJsonIncidencia({ foto: base64 });
        };
        reader.readAsDataURL(file);
    };

    const handleCancel = () => {
        actions.setFotoJsonIncidencia('')
        setInitialDate('');
        setFinalDate('');   
        setDescription('');
        setShowModal(false);
        store.alert = { text: "", background: "primary", visible: false }
    }

    return (
        <div>
            <div className="d-flex justify-content-end p-2">
                <div>
                    <button className="btn border-0 bg-transparent p-0" onClick={() => setShowModal(true)}><i className="fa-solid fa-plus text-primary"></i></button>
                </div>
            </div>
            <div className="modal fade" tabIndex="-1" ref={modalRef} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" style={{ marginBottom: "180px" }}>
                    <div className="container modal-content">
                        <div className="modal-header row">
                            <div className="d-flex justify-content-between">
                                <h1 className="modal-title fs-4 col-md-8">Registrar Incidencia</h1>
                                <button type="button" className="btn-close col-md-4" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleCancel()}></button>
                            </div>
                            <p className="col-md-12">Introduce los detalles de la Incidencia de tu mascota.</p>
                            <Alert />
                        </div>
                        <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                            <form onSubmit={handleSubmit} className="row g-3">
                                <div className="col-md-12">
                                    {store.fotoJsonIncidencia && (
                                        <div className="text-center p-2 mb-3">
                                            <img src={store.fotoJsonIncidencia.foto} alt="Captura" className="img-fluid rounded" style={{ maxWidth: '200px' }} />
                                        </div>
                                    )}
                                    <div className="text-center p-2 mb-3">
                                        <label htmlFor="selectFotoIncidencia" className="btn btn-primary" style={{ color: "white", background: "#ff6100", border: "#ff6100" }}>Introduce foto del Incidente</label>
                                        <input id="selectFotoIncidencia" type="file" accept="image/*" className="d-none" capture="environment" onChange={handleCapture} style={{ display: 'none' }} />
                                    </div>
                                </div>
                                <div className="row">
                                    {checkform.map((opt) => (
                                        <div className="col-md-6 mb-2" key={opt}>
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id={opt} checked={selected === opt} onChange={() => handleCheckboxChange(opt)} />
                                                <label className="form-check-label" htmlFor="is_mix">{opt}</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Fecha de Inicio</label>
                                    <input type="datetime-local" name="initialDate" className="form-control" value={initialDate} onChange={(event) => setInitialDate(event.target.value)} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Fecha de Fin (Opcional)</label>
                                    <input type="datetime-local" name="finalDate" className="form-control" value={finalDate} onChange={(event) => setFinalDate(event.target.value)} />
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label className="form-label fw-semibold">Descripción (Opcional)</label>
                                    <textarea className="form-control" id="descriptionID" rows="3" value={description} onChange={(event) => setDescription(event.target.value)}></textarea>
                                </div>
                                <div className="row">
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
        </div>
    )
}
