import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../store/appContext";
import { Tab, Nav } from 'react-bootstrap';
import { Alert } from "./Alert.jsx";

export const Food = () => {
    const { store, actions } = useContext(Context);

    const [showModal, setShowModal] = useState(false);
    const [activeKey, setActiveKey] = useState('profile');
    const [itemCheck, setItemCheck] = useState([]);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [marca, setMarca] = useState('');
    const [grasa, setGrasa] = useState('');
    const [proteina, setProteina] = useState('');
    const [fibra, setFibra] = useState('');
    const [quantity, setQuantity] = useState('');
    const [type_food, setTypeFood] = useState('');
    const [food_time, setFoodTime] = useState('');

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
            title,
            type_food: store.comidaAI != null ? store.comidaAI.type_food : type_food,
            marca: store.comidaAI != null ? store.comidaAI.marca : marca,
            grasa: store.comidaAI != null ? store.comidaAI.grasa : grasa,
            proteina: store.comidaAI != null ? store.comidaAI.proteina : proteina,
            fibra: store.comidaAI != null ? store.comidaAI.fibra : fibra,
            quantity: store.comidaAI != null ? store.comidaAI.quantity : quantity,
            food_time,
            foto_food: store.fotoJsonFood != null ? store.fotoJsonFood.foto : '',
            mascota_comida_id: store.idParam
        }

        store.alert = { text: "", background: "primary", visible: false };
        await actions.postFood(dataToSend);
        //if (store.fotoJsonFood != null || dataToSend.foto_food == '') {
            setShowModal(false);
        //}
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
            actions.deleteFood(itemCheck[i]);
        }

        setItemCheck([]); // Limpiar selección
    };

    const handleAnalisisIA = async (foto) => {
        setLoading(true);

        const prompt = "Actua como un experto veterinario, Interpreta, analiza y rellena los datos necesarios para un detectar los datos mas importantes de ComidaEnviado la cual es la foto de la comida que utiliza mi mascota";

        if (foto == null) {
            store.alert = { text: "No se pudo analisar con IA la Comida enviada", background: "danger", visible: true };
            setLoading(false);
        }

        const json = {
            "ComidaEnviado": foto
        }

        try {
            await actions.comidaOpenAI(prompt, json);
        } catch (e) {
            store.alert = { text: `Error generando el analisis de comida, Error: ${e}`, background: "danger", visible: true };
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () => {
        store.comidaAI = null;
        actions.setFotoJsonFood('');
        setTitle('');
        setMarca('');
        setGrasa('');
        setProteina('');
        setFibra('');
        setQuantity('');
        setTypeFood('');
        setFoodTime('');
        setShowModal(false);
        store.alert = { text: "", background: "primary", visible: false }
    }

    return (
        <section>
            <div className="d-flex justify-content-between mb-3">
                <h3>Comida</h3>
                <div className="mx-3">
                    <button className="btn btn-outline-secondary mx-3" onClick={() => setShowModal(true)}><i className="fa-solid fa-plus"></i></button>
                    <button className="btn btn-outline-danger" onClick={(event) => handleDelete(event)} hidden={itemCheck.length === 0}>Eliminar</button>
                </div>
            </div>
            <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
                <div className="modal fade" tabIndex="-1" ref={modalRef} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" style={{ marginBottom: "180px" }}>
                        <div className="container modal-content">
                            <div className="modal-header row">
                                <div className="d-flex justify-content-between">
                                    <h1 className="modal-title fs-4 col-md-8">Registrar Comida</h1>
                                    <button type="button" className="btn-close col-md-4" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleCancel()}></button>
                                </div>
                                <br></br>
                                <br></br>
                                <p className="col-md-12">Introduce los detalles de la Comida de tu mascota.</p>
                                <p className="col-md-12">Si vas a introducir una foto para analizarla con IA debe ser del saco de la comida.</p>
                                <Alert />
                            </div>
                            <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                                <form onSubmit={handleSubmit} className="row g-3">
                                    <div className="col-md-12">
                                        {store.fotoJsonFood && (
                                            <div className="text-center p-2 mb-3">
                                                <img src={store.fotoJsonFood.foto} alt="Captura" className="img-fluid rounded" style={{ maxWidth: '200px' }} />
                                            </div>
                                        )}
                                        <div className="text-center p-2 mb-3">
                                            <label htmlFor="selectFotoComida" className="btn btn-primary" style={{ color: "white", background: "#ff6100", border: "#ff6100" }}>Introduce foto del saco de comida</label>
                                            <input id="selectFotoComida" type="file" accept="image/*" className="d-none" capture="environment" onChange={handleCapture} style={{ display: 'none' }} />
                                            <button className="btn btn-primary mx-2" type="button"
                                            onClick={() => handleAnalisisIA(store.fotoJsonFood.foto)}
                                            style={{ color: "white", background: "#ff6100", border: "#ff6100" }}>
                                            {loading ?
                                                <div className="spinner-border" role="status">
                                                    <span className="visually-hidden">Generando ...</span>
                                                </div>
                                                : "Analizar con IA"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Titulo</label>
                                        <input type="text" name="title" className="form-control" value={title} onChange={(event) => setTitle(event.target.value)} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Marca</label>
                                        <input type="text" name="marca" className="form-control" value={store.comidaAI != null ? store.comidaAI.marca : marca} onChange={(event) => setMarca(event.target.value)} required />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-semibold">Grasa</label>
                                        <input type="text" name="grasa" className="form-control" value={store.comidaAI != null ? store.comidaAI.grasa : grasa} onChange={(event) => setGrasa(event.target.value)} required />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-semibold">Proteina</label>
                                        <input type="text" name="proteina" className="form-control" value={store.comidaAI != null ? store.comidaAI.proteina : proteina} onChange={(event) => setProteina(event.target.value)} required />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label fw-semibold">Fibra</label>
                                        <input type="text" name="fibra" className="form-control" value={store.comidaAI != null ? store.comidaAI.fibra : fibra} onChange={(event) => setFibra(event.target.value)} required />
                                    </div>
                                    <div className="row g-3">
                                        <h3>Comida Diaria</h3>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Cantidad (gr)</label>
                                            <input type="number" name="quantity" className="form-control" value={store.comidaAI != null ? store.comidaAI.quantity : quantity} onChange={(event) => setQuantity(event.target.value)} required />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Tipo de Comida</label>
                                            <select className="form-select" aria-label="Default select example" value={store.comidaAI != null ? store.comidaAI.type_food : type_food} onChange={(event) => setTypeFood(event.target.value)} required >
                                                <option value="">Selecciona un Tipo</option>
                                                <option value="suave">Suave</option>
                                                <option value="dura">Dura</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Hora del Día</label>
                                            <input type="time" name="food_time" className="form-control" value={food_time} onChange={(event) => setFoodTime(event.target.value)} required />
                                        </div>
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
                <Tab.Content className="border-0 p-4 bg-transparent mt-3">
                    <Tab.Pane eventKey="profile">
                        <div className="row g-3 d-flex justify-content-between">
                            {store.foods.map((item, index) => (
                                <div key={index} className="col-md-6">
                                    <div className="card shadow-sm h-100 m-auto">
                                        <div className="card-title mt-3 mx-3 d-flex justify-content-between">
                                            <div className="text-start">
                                                <h4 style={{ color: "#1E1E50" }}>
                                                    {item.title}
                                                </h4>
                                                <h6 className="text-secondary">
                                                    {item.marca}
                                                </h6>
                                            </div>
                                            <input type="checkbox" checked={itemCheck.includes(item.id)} onChange={() => toggleChecks(item.id)} />
                                        </div>
                                        <div className="card-body d-flex justify-content-between">
                                            <div className="text-center">
                                                <h5>Grasa</h5>
                                                <p>{item.grasa != null ? item.grasa + ' %' : '-'}</p>
                                            </div>
                                            <div className="text-center">
                                                <h5>Proteina</h5>
                                                <p>{item.proteina != null ? item.proteina + ' %' : '-'}</p>
                                            </div>
                                            <div className="text-center">
                                                <h5>Fibra</h5>
                                                <p>{item.fibra != null ? item.fibra + ' %' : '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="schedule">
                        <div className="row">
                            <div className="card border-0" style={{ borderRadius: "12px" }}>
                                <div className="card-header p-3" style={{ background: "#ffffffff" }}>
                                    <h5>Horario diario de la Comida</h5>
                                </div>
                                <div className="card-body p-5">
                                    <table className="table table-striped" >
                                        <thead style={{ color: "secondary" }}>
                                            <tr className="text-center">
                                                <td>Hora</td>
                                                <td>Tipo</td>
                                                <td>Cantidad</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store.foods.map((item, index) => (
                                                <tr key={index} className="text-center">
                                                    <td>{item.food_time != null ? item.food_time : '-'}</td>
                                                    <td>{item.type_food != null ? item.type_food : '-'}</td>
                                                    <td>{item.quantity != null ? item.quantity + ' gr' : '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </Tab.Pane>
                </Tab.Content>
                <footer className="w-100 bg-white border-top" style={{ position: "fixed", bottom: "70px", left: 0, zIndex: 10000, height: "65px" }}>
                    <Nav className="d-flex justify-content-around align-items-center h-100">
                        {/* Perfil de la Comida */}
                        <Nav.Item>
                            <Nav.Link eventKey="profile" onClick={() => setActiveKey("profile")} className="text-center" style={{ color: "#1B365D" }}>
                                <i className="fa-solid fa-utensils fa-lg"></i>
                                <div style={{ fontSize: "12px" }}>Perfil</div>
                            </Nav.Link>
                        </Nav.Item>
                        {/* Horario */}
                        <Nav.Item>
                            <Nav.Link eventKey="schedule" onClick={() => setActiveKey("schedule")} className="text-center" style={{ color: "#1B365D" }}>
                                <i className="fa-solid fa-clock fa-lg"></i>
                                <div style={{ fontSize: "12px" }}>Horario</div>
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </footer>
            </Tab.Container>
        </section>
    );
}
