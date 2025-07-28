import React, { useEffect, useState, useRef, useContext } from "react";
import { Context } from "../store/appContext";

export const Incidencias = () => {
    const { store, actions } = useContext(Context);

    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState('');
    const [status, setStatus] = useState('Bad');
    const [initialDate, setInitialDate] = useState('');
    const [finalDate, setFinalDate] = useState('');
    const [description, setDescription] = useState('');
    
    const modalRef = useRef(null);
    const bsModal = useRef(null);
    
    const checkform = ['Vomit', 'Diarrhea', 'Skin Issue', 'Fight', 'Inside Home', 'Outside Home', 'Others']
    
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
            alertStatus: status
        }
    
        if (!selected) {
            store.alert = { text: "Debe seleccionar una opcion", background: "danger", visible: true };
            return;
        }
    
        store.alert = { text: "", background: "primary", visible: false };
    
        await actions.postIncidencia(dataToSend);
        setShowModal(false);
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

    return (
        <section className="col-md-12 p-5">
            <h3>Incidents History</h3>
            <br></br>
            <div className="card p-2 border-0" style={{ borderRadius: "12px" }}>
                <div className="text-end p-2">
                    <button className="btn btn-outline-secondary" onClick={() => setShowModal(true)}>Add Manual Entry</button>
                </div>
                <div className="modal fade" tabIndex="-1" ref={modalRef} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="container modal-content">
                            <div className="modal-header row">
                                <div className="d-flex justify-content-between">
                                    <h1 className="modal-title fs-4 col-md-8">Record New Incident</h1>
                                    <button type="button" className="btn-close col-md-4" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <p className="col-md-12">Enter the details of the incident you want to record for your pet.</p>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit} className="row g-3">
                                    <div className="col-md-12">
                                        {store.fotoJsonIncidencia && (
                                            <div className="text-center p-2 mb-3">
                                                <img src={store.fotoJsonIncidencia.foto} alt="Captura" className="img-fluid rounded" style={{ maxWidth: '200px' }} />
                                            </div>
                                        )}
                                        <div className="text-center p-2 mb-3">
                                            <label htmlFor="selectFoto" className="btn btn-primary" style={{ color: "white", background: "#ff6100", border: "#ff6100" }}>Upload a photo of the incident</label>
                                            <input id="selectFoto" type="file" accept="image/*" className="d-none" capture="environment" onChange={handleCapture} style={{ display: 'none' }} />
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
                                        <label className="form-label fw-semibold">Start Time</label>
                                        <input type="datetime-local" name="initialDate" className="form-control" value={initialDate} onChange={(event) => setInitialDate(event.target.value)} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">End Time (Optional)</label>
                                        <input type="datetime-local" name="finalDate" className="form-control" value={finalDate} onChange={(event) => setFinalDate(event.target.value)} required />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label fw-semibold">Description (Optional)</label>
                                        <textarea className="form-control" id="descriptionID" rows="3" value={description} onChange={(event) => setDescription(event.target.value)}></textarea>
                                    </div>
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" id="checkNativeSwitch" onChange={(event) => setStatus(event.target.checked ? 'Good' : 'Bad')} />
                                        <label className="form-check-label" htmlFor="checkNativeSwitch">
                                            This is a positive incident
                                        </label>
                                    </div>
                                    <div className="modal-footer row">
                                        <div className="d-flex justify-content-between">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                                                onClick={() => setShowModal(false)} style={{
                                                    borderRadius: "30px", padding: "10px 20px"
                                                }}>Cancel</button>
                                            <button type="submit" className="btn btn-primary" style={{
                                                color: "white",
                                                background: "#ff6100",
                                                border: "#ff6100",
                                                borderRadius: "30px",
                                                padding: "10px 20px"
                                            }}>Save Incident</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <table className="table table-striped" >
                    <thead style={{ color: "secondary" }}>
                        <tr className="text-center">
                            <th scope="col-md-2"></th>
                            <th scope="col-md-2">Type</th>
                            <th scope="col-md-2">Start Time</th>
                            <th scope="col-md-2">End Time</th>
                            <th scope="col-md-2">Description</th>
                            <th scope="col-md-2">Good/Bad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.incidencias.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td></td>
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