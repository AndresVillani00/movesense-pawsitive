import React, { useEffect, useState, useRef, useContext } from "react";
import { Context } from "../store/appContext";

export const Peso = () => {
    const { store, actions } = useContext(Context);

    const [showModal, setShowModal] = useState(false);
    const [date, setDate] = useState('');

    const [value, setValue] = useState('');
    const [note, setNote] = useState('');
    
    const modalRef = useRef(null);
    const bsModal = useRef(null);
    
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

    useEffect(() => {
        actions.getMetrica(store.idParam);
    }, [])
    
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
    };

    const metricasWeight = store.metrica != null ? store.metrica.filter(metricas => metricas.tipo_metrica_id === 'weight' && metricas.mascota_metrica_id === store.idParam) : null;

    return (
        <section className="col-md-12 p-5">
            <h3>Weight History</h3>
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
                                    <h1 className="modal-title fs-4 col-md-8">Record New Weight</h1>
                                    <button type="button" className="btn-close col-md-4" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <p className="col-md-12">Enter the details of the weight you want to record for your pet.</p>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit} className="row g-3">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Weight Value</label>
                                        <input type="text" name="weight" className="form-control" value={value} onChange={(event) => setValue(event.target.value)} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Creation Time</label>
                                        <input type="datetime-local" name="date" className="form-control" value={date} onChange={(event) => setDate(event.target.value)} required />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label fw-semibold">Note (Optional)</label>
                                        <input type="text" name="note" className="form-control" value={note} onChange={(event) => setNote(event.target.value)} />
                                    </div>
                                    <div className="row my-3">
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
                                            }}>Save Analysis</button>
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
                            <th scope="col-md-2">Time</th>
                            <th scope="col-md-2">Weight</th>
                            <th scope="col-md-2">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metricasWeight.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td></td>
                                <td>{item.ts_init != null ? formatDateTime(item.ts_init) : '-'}</td>
                                <td>{item.valor_diario != null ? item.valor_diario : '-'}</td>
                                <td>{item.note != null ? item.note : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};