import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Tab, Nav } from 'react-bootstrap';

export const Food = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [activeKey, setActiveKey] = useState('profile');

    const [type_food, setTypeFood] = useState('');
    const [marca, setMarca] = useState('');
    const [grasa, setGrasa] = useState('');
    const [proteina, setProteina] = useState('');
    const [fibra, setFibra] = useState('');
    const [food_in_a_day, setFoodInADay] = useState('');

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const dataToSend = {
            type_food,
            marca,
            grasa,
            proteina,
            fibra,
            food_in_a_day,
            mascota_comida_id: store.idParam
        }

        store.alert = { text: "", background: "primary", visible: false };

        await actions.postFood(dataToSend);
        setShowModal(false);
    };

    const handleCapture = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;
            actions.setFotoJsonFood({ foto: base64 });
        };
        reader.readAsDataURL(file);
    };

    const lastFood = store.foods.length != 0 ? store.foods.reduce((latest, item) => { return new Date(item.ts_alta) > new Date(latest.ts_alta) ? item : latest; }) : null;
    console.log(lastFood)

    return (
        <section>
            <h3>Food Tracking</h3>
            <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
                <Nav variant="tabs" className="bg-light justify-content-center rounded">
                    <Nav.Item>
                        <Nav.Link style={{ color: "#1B365D" }} eventKey="profile">Food Profile</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link style={{ color: "#1B365D" }} eventKey="schedule">Meal Schedule</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content className="border-0 p-4 bg-transparent mt-3">
                    <Tab.Pane eventKey="profile">
                        <div className="row g-3 d-flex justify-content-between">
                            <div className="col-md-6">
                                <div className="card border-0" style={{ borderRadius: "12px" }}>
                                    <div className="card-header p-3" style={{ background: "#ffffffff" }}>
                                        <div className="d-flex justify-content-between">
                                            <h5>Regular Diet</h5>
                                            <button className="btn btn-outline-secondary" onClick={() => setShowModal(true)}>Add Manual Entry</button>
                                        </div>
                                    </div>
                                    <div className="modal fade" tabIndex="-1" ref={modalRef} aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="container modal-content">
                                                <div className="modal-header row">
                                                    <div className="d-flex justify-content-between">
                                                        <h1 className="modal-title fs-4 col-md-8">Record New Food</h1>
                                                        <button type="button" className="btn-close col-md-4" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                                                    </div>
                                                    <p className="col-md-12">Enter the details of the food you want to record for your pet.</p>
                                                </div>
                                                <div className="modal-body">
                                                    <form onSubmit={handleSubmit} className="row g-3">
                                                        <div className="col-md-12">
                                                            {store.fotoJsonFood && (
                                                                <div className="text-center p-2 mb-3">
                                                                    <img src={store.fotoJsonFood.foto} alt="Captura" className="img-fluid rounded" style={{ maxWidth: '200px' }} />
                                                                </div>
                                                            )}
                                                            <div className="text-center p-2 mb-3">
                                                                <label htmlFor="selectFotoComida" className="btn btn-primary" style={{ color: "white", background: "#ff6100", border: "#ff6100" }}>Upload a photo of the food</label>
                                                                <input id="selectFotoComida" type="file" accept="image/*" className="d-none" capture="environment" onChange={handleCapture} style={{ display: 'none' }} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 mb-3">
                                                            <label className="form-label fw-semibold">Type of the Food</label>
                                                            <select className="form-select" aria-label="Default select example" value={type_food} onChange={(event) => setTypeFood(event.target.value)} required >
                                                                <option value="">Select a type</option>
                                                                <option value="suave">Sueva</option>
                                                                <option value="dura">Dura</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-4 mb-3">
                                                            <label className="form-label fw-semibold">Brand</label>
                                                            <input type="text" name="marca" className="form-control" value={marca} onChange={(event) => setMarca(event.target.value)} required />
                                                        </div>
                                                        <div className="col-md-4 mb-3">
                                                            <label className="form-label fw-semibold">Fat</label>
                                                            <input type="text" name="grasa" className="form-control" value={grasa} onChange={(event) => setGrasa(event.target.value)} required />
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6 mb-3">
                                                                <label className="form-label fw-semibold">Protein</label>
                                                                <input type="text" name="proteina" className="form-control" value={proteina} onChange={(event) => setProteina(event.target.value)} required />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <label className="form-label fw-semibold">Fiber</label>
                                                                <input type="text" name="fibra" className="form-control" value={fibra} onChange={(event) => setFibra(event.target.value)} required />
                                                            </div>
                                                        </div>
                                                        <div className="row mb-3">
                                                            <div className="col-md-12 mb-3">
                                                                <label className="form-label fw-semibold">Food in a day</label>
                                                                <input type="text" name="food_in_a_day" className="form-control" value={food_in_a_day} onChange={(event) => setFoodInADay(event.target.value)} placeholder="Introduce how many grams in a day" required />
                                                            </div>
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
                                                                }}>Save Food</button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body p-5 d-flex justify-content-between">
                                        <div className="text-center">
                                            <h5>Fat</h5>
                                            <p>{lastFood != null ? lastFood.grasa + ' %' : '-'}</p>
                                        </div>
                                        <div className="text-center">
                                            <h5>Proteine</h5>
                                            <p>{lastFood != null ? lastFood.proteina + ' %' : '-'}</p>
                                        </div>
                                        <div className="text-center">
                                            <h5>Fiber</h5>
                                            <p>{lastFood != null ? lastFood.fibra + ' %' : '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0" style={{ borderRadius: "12px" }}>
                                    <div className="card-header p-3" style={{ background: "#ffffffff" }}>
                                        <h5>Weight Managment</h5>
                                    </div>
                                    <div className="card-body p-5">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="schedule">
                        <div className="row">
                            <div className="card border-0" style={{ borderRadius: "12px" }}>
                                <div className="card-header p-3" style={{ background: "#ffffffff" }}>
                                    <h5>Daily Meal Schedule</h5>
                                </div>
                                <div className="card-body p-5">

                                </div>
                            </div>
                        </div>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </section>
    );
}
