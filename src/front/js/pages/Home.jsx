import React, { useState, useEffect, useRef, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Tab, Nav, Container, Form } from 'react-bootstrap';
import logo from '../../img/LogoPawsitive.png';
import defaultProfilePet from '../../img/defaultProfilePet.png';
import { Alert } from "../component/Alert.jsx";

export const Home = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [itemCheck, setItemCheck] = useState([]);

  const [share_mascota_name_id, setShareMascotaId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [share_password, setSharePassword] = useState('');
  const [mascota_name_id, setMascotaId] = useState('');
  const [password, setPassword] = useState('');
  const [name_mascot, setNameMascot] = useState('');
  const [raza, setRaza] = useState('');
  const [isMix, setMix] = useState(false);
  const [birth_date, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [isEsterilizado, setEsterilizado] = useState(false);
  const [patologia, setPatology] = useState('');
  const [tamano, setTamano] = useState('');
  const [error, setError] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const modalRef = useRef(null);
  const bsModal = useRef(null);

  const razas = ['Beagle', 'Border Collie', 'Bóxer', 'Bulldog Francés', 'Bulldog Inglés', 'Caniche', 'Chihuahua', 'Cocker Spaniel Inglés', 'Dálmata', 'Dobermann',
    'Epagneul Bretón', 'Galgo Español', 'Golden Retriever', 'Husky Siberiano', 'Jack Russell Terrier / Parson Russell Terrier', 'Labrador Retriever', 'Mastín Español',
    'Pastor Alemán', 'Perro de Agua Español', 'Podenco Ibicenco / Podenco Canario', 'Pomerania (Spitz Alemán Enano)', 'Pug (Carlino)', 'Rottweiler', 'San Bernardo',
    'Setter Inglés', 'Shih Tzu', 'Staffordshire Bull Terrier / American Staffordshire Terrier', 'Teckel (Dachshund)', 'West Highland White Terrier', 'Yorkshire Terrier', 'Otros']

  useEffect(() => {
    if (store.activeKey === 'alerts') {
      actions.getIncidencias();
      actions.getReportes();
      actions.getMascotas();
      actions.getAlerts();
    }
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

  const handleShareSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = {
      mascota_name_id: share_mascota_name_id,
      password: share_password,
      usuario_mascota_id: store.usuario.id
    }

    await actions.shareMascot(dataToSend, share_mascota_name_id, store.usuario.id);
    actions.setActiveKey('existing')
    navigate('/home');
  }

  const handleMascotSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = {
      mascota_name_id,
      password,
      name_mascot,
      foto_mascot: store.fotoMascota != null ? store.fotoMascota.foto : defaultProfilePet,
      raza,
      birth_date,
      gender,
      patologia,
      tamano,
      is_mix: isMix,
      is_Esterilizado: isEsterilizado
    }

    await actions.postMascota(dataToSend);
    if (error) {
      actions.setActiveKey('register')
    } else if (dataToSend.foto_mascot == null) {
      actions.setActiveKey('register')
    } else {
      store.fotoMascota = null;
      setMascotaId('');
      setPassword('');
      setNameMascot('');
      setRaza('');
      setMix(false);
      setBirthdate('');
      setGender('');
      setEsterilizado(false);
      setPatology('');
      setTamano('');
      actions.setActiveKey('existing')
    }
    navigate('/home');
  }

  const handleMascotDelete = async (idMascot) => {
    actions.deleteMascota(idMascot);
    store.alert = { text: '', background: 'primary', visible: false }
    setShowModal(false)
  }

  const handleCapture = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      actions.setFotoMascota({ foto: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleDetails = async (event, mascota) => {
    event.preventDefault();

    actions.setCurrentMascota(mascota);
    actions.setIdParam(mascota.id)
    await actions.getAnalysis(mascota.id);
    await actions.getMetrica(mascota.id);
    await actions.getIncidencia(mascota.id);
    await actions.getShareUsers(mascota.mascota_name_id);
    await actions.getCodeJson(mascota.id);

    store.alert = { text: '', background: 'primary', visible: false }
    navigate('/pet-details');
  };

  const handleEdit = async (event, mascota) => {
    event.preventDefault();

    actions.setCurrentMascota(mascota);
    actions.setIdParam(mascota.id)

    store.alert = { text: '', background: 'primary', visible: false }
    navigate('/edit-pet');
  };

  const handleReport = async (event, id) => {
    event.preventDefault();

    store.idMascotaReporte = id;
    navigate('/report');
  }

  const toggleChecks = (id) => {
    if (itemCheck.includes(id)) {
      setItemCheck(itemCheck.filter((sid) => sid !== id));
    } else {
      setItemCheck([...itemCheck, id]);
    }
  };

  const handleLeido = async (event) => {
    event.preventDefault();

    const dataToSend = { status_read: 'leido' }
    for (var i = 0; i < itemCheck.length; i++) {
      actions.putReadAlert(dataToSend, itemCheck[i]);
    }

    setItemCheck([]); // Limpiar selección
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

  // Normalizamos búsqueda (case-insensitive)
  const filterData = (data, type) => {
    return data.filter((item) => {
      const mascota =
        store.mascotas != null
          ? store.mascotas.find(
            (mascota) =>
              mascota.id ===
              (type === "incidencias" ? item.mascota_incidencia_id : (type === "reporte" ? item.mascota_reports_id : item.mascota_alert_id))
          )
          : null;

      const mascotName = mascota ? mascota.mascota_name_id.toLowerCase() : "";

      const matchesName = mascotName.includes(searchName.toLowerCase());
      const matchesStatus = filterStatus
        ? item.status_read === filterStatus : true;
      const matchesDate = filterDate
        ? (formatDateTime(item.ts_alta) &&
          formatDateTime(item.ts_alta).substring(0, 10) === filterDate)
        : true;


      return matchesName && matchesStatus && matchesDate;
    });
  };

  const validatePassword = async (value) => {
    const isValid = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!isValid.test(value)) {
      setError(true)
    } else {
      setError(false)
    }
    setPassword(value)
  }

  // Eliminar
  const [f1, setF1] = useState(null);
  const [f2, setF2] = useState(null);
  const [f3, setF3] = useState(null);
  const [f4, setF4] = useState(null);

  const readJsonFile = async (file) => {
    if (!file) return null;
    const text = await file.text();
    return JSON.parse(text); // lanzará si no es JSON válido
  };

  const handlejson = async (event) =>{
    event.preventDefault();
    const [actividad, peso, pulso, temperatura] = await Promise.all([
      readJsonFile(f1),
      readJsonFile(f2),
      readJsonFile(f3),
      readJsonFile(f4),
    ]);
    const data = {
      json_actividad: actividad,
      json_peso: peso,
      json_pulso: pulso,
      json_temperatura: temperatura
    }
    await actions.postjson(data);
  }

  return (
    <div style={{ background: "#F5EFDE" }}>
      {/* Sección de Categorías */}
      {store.isLogged ?
        <section className="container py-5">
          {store.isLogged && !store.isVeterinario ?
            <Container className="row justify-content-center mt-4">
              <Tab.Container activeKey={store.activeKey} onSelect={(k) => actions.setActiveKey(k)}>
                <Nav variant="tabs" className="bg-light justify-content-center rounded">
                  <Nav.Item>
                    <Nav.Link style={{ color: "#1B365D" }} eventKey="existing">Existing Pets</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link style={{ color: "#1B365D" }} eventKey="register">Register New Pet</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link style={{ color: "#1B365D" }} eventKey="sharing">Sharing Pet</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content className="border p-4 bg-white mt-3 rounded shadow-sm">
                  <Alert />
                  <Tab.Pane eventKey="existing">
                    <div className="row g-3">
                      {store.userMascotas.map((item, index) => (
                        <div key={index} className="col-sm-6 col-md-4 col-lg-3">
                          <div className="card border-0 shadow-sm h-100 bg-transparent">
                            <img
                              src={item.foto_mascot}
                              alt={item.name_mascot}
                              className="card-img-top rounded"
                              style={{ height: "300px", objectFit: "cover" }}
                            />
                            <div className="card-body text-center">
                              <div className="card-title mb-3 d-flex justify-content-between">
                                <div>
                                  <h4 style={{ color: "#1E1E50" }}>
                                    {item.name_mascot}
                                  </h4>
                                  <h6 className="text-secondary">
                                    {item.raza}
                                  </h6>
                                </div>
                                <div>
                                  <button type="button" className="btn border-0 bg-transparent p-0 mx-3" onClick={(event) => handleEdit(event, item)}>
                                    <i className="fa-solid fa-pen-to-square text-primary"></i>
                                  </button>
                                  <button type="button" className="btn border-0 bg-transparent p-0" onClick={() => setShowModal(true)}>
                                    <i className="fa-solid fa-trash-can text-danger"></i>
                                  </button>
                                  <div className="modal fade" tabIndex="-1" ref={modalRef} aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                      <div className="container modal-content">
                                        <div className="modal-header row d-flex justify-content-between">
                                          <h3 className="modal-title fs-4 col-md-8">Are your sure you want to delete this pet ?</h3>
                                          <button type="button" className="btn-close col-md-4" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
                                        </div>
                                        <div className="modal-body d-flex justify-content-end">
                                          <button type="button" className="btn btn-primary" style={{
                                            color: "white",
                                            background: "#ff6100",
                                            border: "#ff6100",
                                            borderRadius: "30px",
                                            padding: "10px 20px"
                                          }}
                                            onClick={() => handleMascotDelete(item.id)}>
                                            Delete
                                          </button>
                                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                                            onClick={() => setShowModal(false)} style={{ borderRadius: "30px", padding: "10px 20px" }}>
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <button className="btn fw-bold" type="button" onClick={(event) => handleDetails(event, item)}
                                style={{
                                  color: "white",
                                  background: "#ff6100",
                                  border: "#ff6100",
                                }}>
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="register">
                    <form onSubmit={handleMascotSubmit} className="row g-3">
                      {/* Campos del formulario */}
                      <div className="col-md-12">
                        {store.fotoMascota && (
                          <div className="text-center p-2 mb-3">
                            <img src={store.fotoMascota.foto} alt="Captura" className="img-fluid rounded" style={{ maxWidth: '200px' }} />
                          </div>
                        )}
                        <div className="text-center my-5 mb-3">
                          <label htmlFor="selectFoto" className="btn btn-primary" style={{ color: "white", background: "#ff6100", border: "#ff6100" }}>Upload a photo of your Pet</label>
                          <input id="selectFoto" type="file" accept="image/*" className="d-none" capture="environment" onChange={handleCapture} style={{ display: 'none' }} />
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold g-3">Pet Username <span style={{ color: "red" }}>*</span></label>
                        <i className="fa-solid fa-circle-info text-primary ms-1" data-bs-toggle="tooltip" data-bs-placement="right" 
                          title="Nombre unico de unico de caada mascota. No existirá ninguna otra mascota con el el mismo nombre, como si fuera un correo electronico"
                          style={{ color:"#1B365D", cursor: "pointer" }}>  
                        </i>
                        <input type="text" name="mascota_id" className="form-control" value={mascota_name_id} onChange={(event) => setMascotaId(event.target.value)} />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Pet Password <span style={{ color: "red" }}>*</span></label>
                        <i className="fa-solid fa-circle-info text-primary ms-1" data-bs-toggle="tooltip" data-bs-placement="right" 
                          title="La contraseña debe tener al menos 8 caracteres y un símbolo."
                          style={{ color:"#1B365D", cursor: "pointer" }}>  
                        </i>
                        <div className="input-group">
                          <input type={showPassword ? "text" : "password"} name="password" className="form-control" value={password} onChange={(event) => validatePassword(event.target.value)} required />
                          <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}> {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>} </span>
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Pet Name <span style={{ color: "red" }}>*</span></label>
                        <i className="fa-solid fa-circle-info text-primary ms-1" data-bs-toggle="tooltip" data-bs-placement="right" 
                          title="El nombre con el que tu mascota está acostumbrado"
                          style={{ color:"#1B365D", cursor: "pointer" }}>  
                        </i>
                        <input type="text" name="mascotname" className="form-control" value={name_mascot} onChange={(event) => setNameMascot(event.target.value)} required/>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Birth Date <span style={{ color: "red" }}>*</span></label>
                        <input type="date" name="birthdate" className="form-control" value={birth_date} onChange={(event) => setBirthdate(event.target.value)} required />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Gender</label>
                        <select className="form-select" aria-label="Default select example" value={gender} onChange={(event) => setGender(event.target.value)}>
                          <option value={''}>Select one</option>
                          <option value={'Male'}>Male</option>
                          <option value={'Female'}>Female</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Pathology</label>
                        <i className="fa-solid fa-circle-info text-primary ms-1" data-bs-toggle="tooltip" data-bs-placement="right" 
                          title="Si el campo se deja vacío, debemos interpretar que no tiene ninguna pataologia"
                          style={{ color:"#1B365D", cursor: "pointer" }}>  
                        </i>
                        <select className="form-select" aria-label="Default select example" value={patologia} onChange={(event) => setPatology(event.target.value)} >
                          <option value="">Select a Pathology</option>
                          <option value="food_pathology">Food pathology</option>
                          <option value="movility_pathology">Movility pathology</option>
                          <option value="skin_pathology">Skin pathology</option>
                          <option value="cardiac_pathology">Cardiac pathology</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Tamaño <span style={{ color: "red" }}>*</span></label>
                        <i className="fa-solid fa-circle-info text-primary ms-1" data-bs-toggle="tooltip" data-bs-placement="right" 
                          title="Razas de perros pequeños: Pesan entre 3 y 10 kilos.
                                 Razas de perros medianos: Con un peso de 10 a 25 kilos, son perros muy versátiles. Como pueden ser: El Border Collie y el Cocker Spaniel, Basset Hound.
                                 Razas de perros grandes: Estos perros pesan entre 25 y 50 kilos. Son razas reconocidas y populares como el Golden Retriever, el Pastor Alemán y el Husky Siberiano. "
                          style={{ color:"#1B365D", cursor: "pointer" }}>  
                        </i>
                        <select className="form-select" aria-label="Default select example" value={tamano} onChange={(event) => setTamano(event.target.value)} >
                          <option value="">Seleccciona el Tamaño</option>
                          <option value="Pequeño">Pequeño</option>
                          <option value="Mediano">Mediano</option>
                          <option value="Grande">Grande</option>
                        </select>
                      </div>
                      <div className="col-md-8 mb-3">
                        <label className="form-label fw-semibold">Breed <span style={{ color: "red" }}>*</span></label>
                        <i className="fa-solid fa-circle-info text-primary ms-1" data-bs-toggle="tooltip" data-bs-placement="right" 
                          title='Seleccionar "Otros" si no se conoce la Raza'
                          style={{ color:"#1B365D", cursor: "pointer" }}>  
                        </i>
                        <select className="form-select" aria-label="Default select example" value={raza} onChange={(event) => setRaza(event.target.value)} required >
                          <option value="">Select a Breed</option>
                          {razas.map((item) => {
                            return (
                              <option value={item}>{item}</option>
                            );
                          }
                          )}
                        </select>
                      </div>
                      <div className="col-md-6 mx-3 mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="is_mix" onChange={(event) => setMix(event.target.checked)} />
                        <label className="form-check-label" htmlFor="is_mix">Is your pet mixed Breed?</label>
                      </div>
                      <div className="col-md-6 mx-3 mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="is_esterilizado" onChange={(event) => setEsterilizado(event.target.checked)} />
                        <label className="form-check-label" htmlFor="is_esterilizado">Is your pet Spay / Neuter ?</label>
                      </div>
                      {/* Botones de acción */}
                      <div className="d-flex justify-content-between">
                        <button className="btn btn-primary fw-bold m-3" style={{ color: "white", background: "#ff6100", border: "#ff6100" }} type="submit">Save Pet</button>
                      </div>
                    </form>
                  </Tab.Pane>
                  <Tab.Pane eventKey="sharing">
                    <form onSubmit={handleShareSubmit} className="row g-3">
                      {/* Campos del formulario */}
                      <div className="col-md-12 mb-3">
                        <label className="form-label fw-semibold">Pet Username</label>
                        <input type="text" name="mascota_id" className="form-control" value={share_mascota_name_id} onChange={(event) => setShareMascotaId(event.target.value)} />
                      </div>
                      <div className="col-md-12 mb-3">
                        <label className="form-label fw-semibold">Pet Password</label>
                        <input type="password" name="password" className="form-control" value={share_password} onChange={(event) => setSharePassword(event.target.value)} />
                      </div>
                      {/* Botones de acción */}
                      <div className="d-flex justify-content-between">
                        <button className="btn btn-primary fw-bold m-3" style={{ color: "white", background: "#ff6100", border: "#ff6100" }} type="submit">Sign In Pet</button>
                      </div>
                    </form>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Container>
            :
            <Container className="row justify-content-center mt-4">
              {/* Barra de búsqueda */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <Form.Control
                    type="text"
                    placeholder="Buscar mascota..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">Filtrar por estado...</option>
                    <option value="leido">Readed</option>
                    <option value="noleido">Un Readed</option>
                  </Form.Select>
                </div>
                <div className="col-md-3">
                  <Form.Control
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <button style={{ color: "white", background: "#1B365D", border: "#1B365D", borderRadius: "8px", padding: "8px 16px" }}
                    variant="secondary"
                    onClick={() => {
                      setSearchName("");
                      setFilterStatus("");
                      setFilterDate("");
                    }}
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              <Tab.Container activeKey={store.activeKey} onSelect={(k) => actions.setActiveKey(k)}>
                <Nav variant="tabs" className="bg-light justify-content-center rounded">
                  <Nav.Item>
                    <Nav.Link style={{ color: "#1B365D" }} eventKey="alerts">
                      Alerts
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link style={{ color: "#1B365D" }} eventKey="incidents">
                      Incidents
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link style={{ color: "#1B365D" }} eventKey="reports">
                      Reports
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content className="border p-4 bg-white mt-3 rounded shadow-sm">
                  {/* TAB ALERTAS */}
                  <Tab.Pane eventKey="alerts">
                    <div className="d-flex justify-content-end p-2">
                      <button className="btn btn-outline-secondary" onClick={(event) => handleLeido(event)} hidden={itemCheck.length === 0}>Read Alerts</button>
                    </div>
                    <table className="table table-striped">
                      <thead>
                        <tr className="text-center">
                          <th>Mascot</th>
                          <th>Type</th>
                          <th>Source</th>
                          <th>Value</th>
                          <th>State</th>
                          <th>Description</th>
                          <th>Post Time</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterData(store.alerts, "alerts").map(
                          (item, index) => {
                            const mascot = store.mascotas != null ? store.mascotas.find((m) => m.id == item.mascota_alerts_id) : null;

                            return (
                              <tr key={index} className="text-center">
                                <td>{mascot ? mascot.mascota_name_id : "-"}</td>
                                <td>{item.type != null ? item.type : "-"}</td>
                                <td>{item.source != null ? item.source : "-"}</td>
                                <td>{item.danger_value != null ? item.danger_value : "-"}</td>
                                <td>{item.status_read != null ? (item.status_read == 'leido' ? 'Readed' : 'Un Readed') : "-"}</td>
                                <td>{item.description != null ? item.description : "-"}</td>
                                <td>{item.post_time != null ? formatDateTime(item.post_time) : "-"}</td>
                                <td>{item.traffic_light != null ? (item.traffic_light == 'rojo' ? 'Danger' : (item.traffic_light == 'amarillo' ? 'Medium' : 'Good')) : "-"}</td>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={itemCheck.includes(item.id)}
                                    onChange={() => toggleChecks(item.id)}
                                  />
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </Tab.Pane>

                  {/* TAB INCIDENCIAS */}
                  <Tab.Pane eventKey="incidents">
                    <table className="table table-striped">
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
                        {filterData(store.incidencias, "incidencia").map(
                          (item, index) => {
                            const mascot = store.mascotas != null ? store.mascotas.find((m) => m.id == item.mascota_incidencia_id) : null;

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
                  </Tab.Pane>

                  {/* TAB REPORTES */}
                  <Tab.Pane eventKey="reports">
                    <table className="table table-striped">
                      <thead>
                        <tr className="text-center">
                          <th>Mascot</th>
                          <th>Score</th>
                          <th>State</th>
                          <th>Date</th>
                          <th>Report</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterData(store.reportes, "reporte").map(
                          (item, index) => {
                            const mascot = store.mascotas != null ? store.mascotas.find((m) => m.id == item.mascota_reports_id) : null;

                            return (
                              <tr key={index} className="text-center">
                                <td>{mascot ? mascot.mascota_name_id : "-"}</td>
                                <td>{item.score != null ? item.score : "-"}</td>
                                <td>{item.status_read != null ? (item.status_read == 'leido' ? 'Readed' : 'Un Readed') : "-"}</td>
                                <td>{item.ts_alta != null ? formatDateTime(item.ts_alta) : "-"}</td>
                                <td><button className="btn fw-bold" onClick={(event) => handleReport(event, item.id)} style={{ color: "white", background: "#ff6100", border: "#ff6100", borderRadius: "8px", padding: "8px 16px" }}>See</button></td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Container>
          }
        </section>
        :
        <section className="container py-5 d-flex justify-content-center align-items-center">
          <div className="position-relative w-100" style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {/* Imagen de fondo difuminada */}
            <img src={logo} alt="Background" className="img-fluid position-absolutetranslate-middle"
              style={{
                width: "100%", height: "100%", objectFit: "cover"
              }}
            />
           
          </div>
        </section>

      }
    </div>
  );
};