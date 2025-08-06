import React, { useEffect, useState, useRef, useContext } from "react";
import { Context } from "../store/appContext";

export const Analysis = () => {
    const { store, actions } = useContext(Context);

    const [showModal, setShowModal] = useState(false);
    const [date, setDate] = useState('');
    const [itemCheck, setItemCheck] = useState([]);

    const [blood, setBlood] = useState('');
    const [bilirubin, setBilirubin] = useState('');
    const [urobiling, setUrobiling] = useState('');
    const [ketones, setKetones] = useState('');
    const [glucose, setGlucose] = useState('');
    const [protein, setProtein] = useState('');
    const [nitrite, setNitrite] = useState('');
    const [leukocytes, setLeukocytes] = useState('');
    const [ph, setPh] = useState('');
    
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
        actions.getAnalysis(store.idParam);
    }, [])

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
            blood,
            bilirubin,
            urobiling,
            ketones,
            glucose,
            protein,
            nitrite,
            leukocytes,
            ph,
            ts_init: startDate,
            mascota_analysis_id: store.idParam
        }
        await actions.postAnalysis(dataToSend);
        setShowModal(false);
    };
    
    const handleCapture = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;
            actions.setFotoJsonAnalysis({ foto: base64 });
        };
        reader.readAsDataURL(file);
    };

    const handleDelete = async (event) => {
        event.preventDefault();

        for(var i = 0; i < itemCheck.length; i++){
            actions.deleteAnalysis(itemCheck[i]);
        }

        setItemCheck([]); // Limpiar selección
    };

    return (
        <section className="col-md-12 p-5">
            <h3>Anlysis History</h3>
            <br></br>
            <div className="card p-2 border-0" style={{ borderRadius: "12px" }}>
                <div className="d-flex justify-content-end p-2">
                    <div className="mx-3">
                        <button className="btn btn-outline-secondary" onClick={() => setShowModal(true)}>Add Manual Entry</button>
                    </div>
                    <button className="btn btn-outline-danger" onClick={(event) => handleDelete(event)} hidden={itemCheck.length === 0}>Delete</button>
                </div>
                <div className="modal fade" tabIndex="-1" ref={modalRef} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="container modal-content">
                            <div className="modal-header row">
                                <div className="d-flex justify-content-between">
                                    <h1 className="modal-title fs-4 col-md-8">Record New Analysis</h1>
                                    <button type="button" className="btn-close col-md-4" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <p className="col-md-12">Enter the details of the urine analysis you want to record for your pet.</p>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit} className="row g-3">
                                    <div className="col-md-12">
                                        {store.fotoJsonAnalysis && (
                                            <div className="text-center p-2 mb-3">
                                                <img src={store.fotoJsonAnalysis.foto} alt="Captura" className="img-fluid rounded" style={{ maxWidth: '200px' }} />
                                            </div>
                                        )}
                                        <div className="text-center p-2 mb-3">
                                            <label htmlFor="selectFoto" className="btn btn-primary" style={{ color: "white", background: "#ff6100", border: "#ff6100" }}>Upload a photo of the Urine</label>
                                            <input id="selectFoto" type="file" accept="image/*" className="d-none" capture="environment" onChange={handleCapture} style={{ display: 'none' }} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Blood</label>
                                            <input type="text" name="blood" className="form-control" value={blood} onChange={(event) => setBlood(event.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Bilirubin</label>
                                            <input type="text" name="bilirubin" className="form-control" value={bilirubin} onChange={(event) => setBilirubin(event.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Urobiling</label>
                                            <input type="text" name="urobiling" className="form-control" value={urobiling} onChange={(event) => setUrobiling(event.target.value)} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Ketones</label>
                                            <input type="text" name="ketones" className="form-control" value={ketones} onChange={(event) => setKetones(event.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Glucose</label>
                                            <input type="text" name="glucose" className="form-control" value={glucose} onChange={(event) => setGlucose(event.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Protein</label>
                                            <input type="text" name="protein" className="form-control" value={protein} onChange={(event) => setProtein(event.target.value)} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Nitrite</label>
                                            <input type="text" name="nitrite" className="form-control" value={nitrite} onChange={(event) => setNitrite(event.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Leukocytes</label>
                                            <input type="text" name="leukocytes" className="form-control" value={leukocytes} onChange={(event) => setLeukocytes(event.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">PH</label>
                                            <input type="text" name="ph" className="form-control" value={ph} onChange={(event) => setPh(event.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Creation Time</label>
                                        <input type="datetime-local" name="date" className="form-control" value={date} onChange={(event) => setDate(event.target.value)} required />
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
                            <th scope="col-md-2">Blood</th>
                            <th scope="col-md-2">Bilirubin</th>
                            <th scope="col-md-2">Urobiling</th>
                            <th scope="col-md-2">Ketones</th>
                            <th scope="col-md-2">Glucose</th>
                            <th scope="col-md-2">Protein</th>
                            <th scope="col-md-2">Nitrite</th>
                            <th scope="col-md-2">Leukocytes</th>
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