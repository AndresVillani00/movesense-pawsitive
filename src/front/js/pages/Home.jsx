import React, { useState, useEffect, useRef, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";
import { Tab, Nav, Container, Form } from 'react-bootstrap';
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

  // Parametros LogIn
  const [username, setUsername] = useState('');
  const [remember, setRemember] = useState(false);

  const modalRef = useRef(null);
  const bsModal = useRef(null);

  const razas = ['Beagle', 'Border Collie', 'Bóxer', 'Bulldog Francés', 'Bulldog Inglés', 'Caniche', 'Chihuahua', 'Cocker Spaniel Inglés', 'Dálmata', 'Dobermann',
    'Epagneul Bretón', 'Galgo Español', 'Golden Retriever', 'Husky Siberiano', 'Jack Russell Terrier / Parson Russell Terrier', 'Labrador Retriever', 'Mastín Español',
    'Pastor Alemán', 'Perro de Agua Español', 'Podenco Ibicenco / Podenco Canario', 'Pomerania (Spitz Alemán Enano)', 'Pug (Carlino)', 'Rottweiler', 'San Bernardo',
    'Setter Inglés', 'Shih Tzu', 'Staffordshire Bull Terrier / American Staffordshire Terrier', 'Teckel (Dachshund)', 'West Highland White Terrier', 'Yorkshire Terrier', 'Otros']

  useEffect(() => {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    [...popoverTriggerList].map(el => new window.bootstrap.Popover(el));

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

  const getRandom5Digits = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };


  const handleMascotSubmit = async (event) => {
    event.preventDefault();

    const random_id = name_mascot + "@" + getRandom5Digits();
    const random_password = name_mascot + "@" + getRandom5Digits();

    const dataToSend = {
      mascota_name_id: random_id,
      password: random_password,
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
    await actions.getReport(mascota.id);

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

  const handlejson = async (event) => {
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

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    const dataToSend = { username, password, remember }
    await actions.login(dataToSend);
    console.log(store.userMascotas.length)
    if (store.isVeterinario) {
      actions.setActiveKey('alerts')
    } else if (store.userMascotas.length < 1) {
      actions.setActiveKey('register')
    } else {
      actions.setActiveKey('existing')
    }

    if (store.isLogged) {
      navigate('/home');
    }
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
                    <Nav.Link style={{ color: "#1B365D" }} eventKey="existing">Mis Mascotas</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link style={{ color: "#1B365D" }} eventKey="register">Registrar Nueva Mascota</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link style={{ color: "#1B365D" }} eventKey="sharing">Compartir Mascota</Nav.Link>
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
                                          <h3 className="modal-title fs-4 col-md-8">Estas Seguro que quieres Eliminar esta mascota ?</h3>
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
                                            Eliminar
                                          </button>
                                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                                            onClick={() => setShowModal(false)} style={{ borderRadius: "30px", padding: "10px 20px" }}>
                                            Cancelar
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
                                Detalles
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
                          <label htmlFor="selectFoto" className="btn btn-primary" style={{ color: "white", background: "#ff6100", border: "#ff6100" }}>Introduce una foto de tu mascota</label>
                          <input id="selectFoto" type="file" accept="image/*" className="d-none" capture="environment" onChange={handleCapture} style={{ display: 'none' }} />
                        </div>
                      </div>
                      <div className="col-md-12 mb-3">
                        <label className="form-label fw-semibold">Nombre de tu mascota <span style={{ color: "red" }}>*</span></label>
                        <input type="text" name="mascotname" className="form-control" value={name_mascot} onChange={(event) => setNameMascot(event.target.value)} required />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Fecha de Nacimiento <span style={{ color: "red" }}>*</span></label>
                        <input type="date" name="birthdate" className="form-control" value={birth_date} onChange={(event) => setBirthdate(event.target.value)} required />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Sexo</label>
                        <select className="form-select" aria-label="Default select example" value={gender} onChange={(event) => setGender(event.target.value)}>
                          <option value={''}>Selecciona el Sexo</option>
                          <option value={'Male'}>Macho</option>
                          <option value={'Female'}>Hembra</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Patología</label>
                        <button class="btn border-0 bg-transparent p-0 mx-2" style={{ boxShadow: "none" }} type="button" data-bs-toggle="collapse" data-bs-target="#collapsePatologia" aria-expanded="false" aria-controls="collapsePatologia">
                          <i className="fa-solid fa-circle-info text-primary ms-1" style={{ color: "#1B365D" }}></i>
                        </button>
                        <div class="collapse my-2" id="collapsePatologia">
                          <div class="card card-body" style={{ backgroundColor: "#c6e4f8ff" }}>
                            Si el campo se deja vacío, debemos interpretar que no tiene ninguna pataologia.
                          </div>
                        </div>
                        <select className="form-select" aria-label="Default select example" value={patologia} onChange={(event) => setPatology(event.target.value)} >
                          <option value="">Selecciona una Patología</option>
                          <option value="food_pathology">Patología de Comida</option>
                          <option value="movility_pathology">Patología de Movilidad</option>
                          <option value="skin_pathology">Patología en la Piel</option>
                          <option value="cardiac_pathology">Patología Cardiaca</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Tamaño <span style={{ color: "red" }}>*</span></label>
                        <button class="btn border-0 bg-transparent p-0 mx-2" style={{ boxShadow: "none" }} type="button" data-bs-toggle="collapse" data-bs-target="#collapseTamano" aria-expanded="false" aria-controls="collapseTamano">
                          <i className="fa-solid fa-circle-info text-primary ms-1" style={{ color: "#1B365D" }}></i>
                        </button>
                        <div class="collapse my-2" id="collapseTamano">
                          <div class="card card-body" style={{ backgroundColor: "#c6e4f8ff" }}>
                            - Razas de perros pequeños: Pesan entre 3 y 10 kilos.<br></br>
                            - Razas de perros medianos: Con un peso de 10 a 25 kilos, son perros muy versátiles. Como pueden ser: El Border Collie y el Cocker Spaniel, Basset Hound.<br></br>
                            - Razas de perros grandes: Estos perros pesan entre 25 y 50 kilos. Son razas reconocidas y populares como el Golden Retriever, el Pastor Alemán y el Husky Siberiano. "
                          </div>
                        </div>
                        <select className="form-select" aria-label="Default select example" value={tamano} onChange={(event) => setTamano(event.target.value)} >
                          <option value="">Seleccciona el Tamaño</option>
                          <option value="Pequeño">Pequeño</option>
                          <option value="Mediano">Mediano</option>
                          <option value="Grande">Grande</option>
                        </select>
                      </div>
                      <div className="col-md-8 mb-3">
                        <label className="form-label fw-semibold">Raza <span style={{ color: "red" }}>*</span></label>
                        <button class="btn border-0 bg-transparent p-0 mx-2" style={{ boxShadow: "none" }} type="button" data-bs-toggle="collapse" data-bs-target="#collapseBreed" aria-expanded="false" aria-controls="collapseBreed">
                          <i className="fa-solid fa-circle-info text-primary ms-1" style={{ color: "#1B365D" }}></i>
                        </button>
                        <div class="collapse my-2" id="collapseBreed">
                          <div class="card card-body" style={{ backgroundColor: "#c6e4f8ff" }}>
                            Seleccionar "Otros" si no se conoce la Raza.
                          </div>
                        </div>
                        <select className="form-select" aria-label="Default select example" value={raza} onChange={(event) => setRaza(event.target.value)} required >
                          <option value="">Selecciona la Raza</option>
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
                        <label className="form-check-label" htmlFor="is_mix">La Mascota es mezcla de varias razas ?</label>
                      </div>
                      <div className="col-md-6 mx-3 mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="is_esterilizado" onChange={(event) => setEsterilizado(event.target.checked)} />
                        <label className="form-check-label" htmlFor="is_esterilizado">La Mascota esta esterilizada  ?</label>
                      </div>
                      {/* Botones de acción */}
                      <div className="d-flex justify-content-between">
                        <button className="btn btn-primary fw-bold m-3" style={{ color: "white", background: "#ff6100", border: "#ff6100" }} type="submit">Registrar</button>
                      </div>
                    </form>
                  </Tab.Pane>
                  <Tab.Pane eventKey="sharing">
                    <form onSubmit={handleShareSubmit} className="row g-3">
                      {/* Campos del formulario */}
                      <div className="col-md-12 mb-3">
                        <label className="form-label fw-semibold">Username de Mascota</label>
                        <input type="text" name="mascota_id" className="form-control" value={share_mascota_name_id} onChange={(event) => setShareMascotaId(event.target.value)} />
                      </div>
                      <div className="col-md-12 mb-3">
                        <label className="form-label fw-semibold">Contraseña de Mascota</label>
                        <input type="password" name="password" className="form-control" value={share_password} onChange={(event) => setSharePassword(event.target.value)} />
                      </div>
                      {/* Botones de acción */}
                      <div className="d-flex justify-content-between">
                        <button className="btn btn-primary fw-bold m-3" style={{ color: "white", background: "#ff6100", border: "#ff6100" }} type="submit">Registrar</button>
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
                    <option value="leido">Leído</option>
                    <option value="noleido">No Leído</option>
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
                      Alertas
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link style={{ color: "#1B365D" }} eventKey="incidents">
                      Incidencias
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link style={{ color: "#1B365D" }} eventKey="reports">
                      Reportes
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
                          <th>Mascota</th>
                          <th>Tipo</th>
                          <th>Fuente</th>
                          <th>Valor</th>
                          <th>Estado</th>
                          <th>Descripción</th>
                          <th>Fecha de Alta</th>
                          <th>Estado Lectura</th>
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
                                <td>{item.status_read != null ? (item.traffic_light == 'rojo' ? 'Peligro' : (item.traffic_light == 'amarillo' ? 'Medio' : 'Bueno')) : "-"}</td>
                                <td>{item.description != null ? item.description : "-"}</td>
                                <td>{item.post_time != null ? formatDateTime(item.post_time) : "-"}</td>
                                <td>{item.status_read != null ? (item.status_read == 'leido' ? 'Leído' : 'No Leído') : "-"}</td>
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
                          <th>Mascota</th>
                          <th>Tipo</th>
                          <th>Fecha de Inicio</th>
                          <th>Fecha de Fin</th>
                          <th>Descripción</th>
                          <th>Bueno/Malo</th>
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
                          <th>Mascota</th>
                          <th>Puntaje</th>
                          <th>Estado</th>
                          <th>Fecha</th>
                          <th>Reporte</th>
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
                                <td>{item.status_read != null ? (item.status_read == 'leido' ? 'Leído' : 'No Leído') : "-"}</td>
                                <td>{item.ts_alta != null ? formatDateTime(item.ts_alta) : "-"}</td>
                                <td><button className="btn fw-bold" onClick={(event) => handleReport(event, item.id)} style={{ color: "white", background: "#ff6100", border: "#ff6100", borderRadius: "8px", padding: "8px 16px" }}>Ver</button></td>
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
        <section className="container py-3 d-flex justify-content-center align-items-center">
          <div className="position-relative w-100" style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="container-fluid d-flex justify-content-center align-items-center vh-100" style={{
              background: "#F5EFDE", // Fondo claro y limpio
              color: "#333" // Texto oscuro para contraste
            }}>
              <div className="card p-5 shadow-lg border-0" style={{
                maxWidth: "420px",
                width: "100%",
                background: "#FFFFFF", // Card blanca para elegancia
                borderRadius: "12px",
                border: "1px solid #DDD" // Borde sutil
              }}>
                <Link to="/home" className="text-decoration-none mb-3" style={{ color: "#1B365D" }}>  <i className="fas fa-arrow-left"></i> Volver</Link>
                <h2 className="text-center mb-4" style={{ fontWeight: "bold", color: "#1B365D" }}>Bienvenido de nuevo</h2>
                <p className="text-center" style={{ color: "#1B365D" }}>Inicia sesión para continuar</p>
                <Alert />
                <form onSubmit={handleSubmitLogin}>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input onChange={(event) => setUsername(event.target.value)} value={username} type="text" className="form-control border-0 shadow-sm" placeholder="Introduce tu Usuario o Email" required />
                  </div>
                  <div className="mb-3 input-group">
                    <label className="form-label col-12">Contraseña</label>
                    <input onChange={(event) => validatePassword(event.target.value)} value={password} type={showPassword ? "text" : "password"} className={`form-control ${error ? "is-invalid" : "is-valid"} border-0 shadow-sm`} placeholder="Introduce tu Contraseña" required />
                    <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                      {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                    </span>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="rememberMe" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    <label className="form-check-label" htmlFor="rememberMe">Recuérdame</label>
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn w-50 mt-4 fw-bold" style={{
                      color: "white",
                      background: "#ff6100",
                      border: "#ff6100",
                      borderRadius: "8px",
                      padding: "10px"
                    }}>Iniciar sesión</button>
                  </div>
                  <div className="text-center mt-3">
                    <p className="text-muted">No tienes cuenta ? <Link to={"/sign-up"} className="text-decoration-none" onClick={() => store.alert = { text: "", background: "primary", visible: false }} style={{ color: "#1E1E50" }}>Regístrate</Link></p>
                  </div>
                </form>
              </div>
            </div>
            {/**
             <form onSubmit={handlejson}>
              <div className="mb-2">
                <label>Json Actividad</label>
                <input className="form-control" type="file" accept=".json" onChange={e => setF1(e.target.files?.[0] ?? null)} />
              </div>

              <div className="mb-2">
                <label>Json Peso</label>
                <input className="form-control" type="file" accept=".json" onChange={e => setF2(e.target.files?.[0] ?? null)} />
              </div>

              <div className="mb-2">
                <label>Json Pulso</label>
                <input className="form-control" type="file" accept=".json" onChange={e => setF3(e.target.files?.[0] ?? null)} />
              </div>

              <div className="mb-2">
                <label>Json Temperatura</label>
                <input className="form-control" type="file" accept=".json" onChange={e => setF4(e.target.files?.[0] ?? null)} />
              </div>

              <button className="btn btn-primary" type="submit">Cargar JSONs</button>
            </form>
            */}
          </div>
        </section>

      }
      <footer className="text-light py-4 mt-auto" 
        style={{
            background: "#1B365D",
            fontFamily: "'Montserrat', sans-serif"
        }}>
            <div className="container text-center">
                <p className="mb-0">&copy; {new Date().getFullYear()} Pawsitive. Derechos Reservados.</p>
                <div className="mt-3">
                    <a href="https://www.instagram.com/pawsitiveapp.es?igsh=OG1raGJ4YTBkOTh3" className="text-light mx-2">
                        <i className="fab fa-instagram fa-lg"></i>
                    </a>
                </div>
            </div>
        </footer>
    </div>
  );
};