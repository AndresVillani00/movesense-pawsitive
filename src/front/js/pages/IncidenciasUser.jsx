import React, { useState, useEffect, useRef, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import {  Container, Form } from 'react-bootstrap';

export const IncidenciasUser = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState('');
    
    const [mascotNameID, setMascotNameID] = useState('');
    const [status, setStatus] = useState('Bad');
    const [initialDate, setInitialDate] = useState('');
    const [finalDate, setFinalDate] = useState('');
    const [description, setDescription] = useState('');

    const modalRef = useRef(null);
    const bsModal = useRef(null);

    const checkform = ['Vomit', 'Diarrhea', 'Skin Issue', 'Fight', 'Inside Home', 'Outside Home', 'Others']

    useEffect(() => {
      actions.getIncidenciasUser();
      actions.getMascotas();
    }, []);

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
        const mascotID = store.mascotas != null ? store.mascotas.find((m) => m.mascota_name_id == mascotNameID): null;
        
        const dataToSend = {
            title: selected,
            initial_date: startDate,
            final_date: endDate,
            description,
            alertStatus: status,
            foto_incidencia: store.fotoJsonIncidencia != null ? store.fotoJsonIncidencia.foto : null,
            mascota_incidencia_id: mascotID.id
        }

        if (!selected) {
            store.alert = { text: "Debe seleccionar una opcion", background: "danger", visible: true };
            return;
        }

        store.alert = { text: "", background: "primary", visible: false };

        await actions.postIncidencia(dataToSend);
        actions.getIncidenciasUser();
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
      <section>
        {store.isLogged ? 
        <Container className="row justify-content-center mt-4 m-auto">
          <div className="row mb-3 d-flex justify-content-between">
            <div className="col-md-2">
              <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Volver</button>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary" onClick={() => setShowModal(true)}>Add Manual Entry</button>
            </div>
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
                        <label htmlFor="selectFotoIncidencia" className="btn btn-primary" style={{ color: "white", background: "#ff6100", border: "#ff6100" }}>Upload a photo of the incident</label>
                        <input id="selectFotoIncidencia" type="file" accept="image/*" className="d-none" capture="environment" onChange={handleCapture} style={{ display: 'none' }} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Pet Username</label>
                        <input type="text" name="mascotNameID" className="form-control" value={mascotNameID} onChange={(event) => setMascotNameID(event.target.value)} required />
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
                    <div className="form-check form-switch mb-3">
                      <input className="form-check-input" type="checkbox" id="checkNativeSwitch" onChange={(event) => setStatus(event.target.checked ? 'Good' : 'Bad')} />
                      <label className="form-check-label" htmlFor="checkNativeSwitch">
                          This is a positive incident
                      </label>
                    </div>
                    <div className="row">
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
          <div className="border p-4 bg-white mt-3 rounded shadow-sm">
            <table className="table table-striped bg-white">
              <thead>
                <tr className="text-center">
                  <th>Mascot</th>
                  <th>Type</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Description</th>
                  <th>Good/Bad</th>
                </tr>
              </thead>
              <tbody>
                {store.incidenciasUser == null ? <tr></tr> : store.incidenciasUser.map((item, index) => {
                    const mascot = store.mascotas != null ? store.mascotas.find((m) => m.id == item.mascota_incidencia_id): null;
                    return (
                      <tr key={index} className="text-center">
                        <td>{mascot ? mascot.mascota_name_id : "-"}</td>
                        <td>{item.title != null ? item.title : "-"}</td>
                        <td>{item.initial_date != null ? formatDateTime(item.initial_date) : "-"}</td>
                        <td>{item.final_date != null ? formatDateTime(item.final_date) : "-"}</td>
                        <td>{item.description != null ? item.description : "-"}</td>
                        <td>{item.alert_status != null ? item.alert_status : "-"}</td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </Container>
        :
        <Container></Container>
        }
      </section>
    );
};
