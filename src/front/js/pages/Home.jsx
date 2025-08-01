import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";
import { Tab, Nav, Container } from 'react-bootstrap';

export const Home = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [activeKey, setActiveKey] = useState('existing');
  const [mascota_name_id, setMascotaId] = useState('');
  const [password, setPassword] = useState('');
  const [name_mascot, setNameMascot] = useState('');
  const [raza, setRaza] = useState('');
  const [isMix, setMix] = useState('');
  const [birth_date, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [isEsterilizado, setEsterilizado] = useState('');
  const [patologia, setPatology] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
        
    const dataToSend = {
      mascota_name_id,
      password,
      name_mascot,
      foto_mascot: store.fotoMascota.foto,
      raza,
      birth_date,
      gender,
      patologia,
      is_mix: isMix,
      is_Esterilizado: isEsterilizado
    }

    await actions.postMascota(dataToSend);
    setActiveKey('existing')
    navigate('/home');
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
    
    navigate(`/mascota-profile/${mascota.id}`);
  };

  return (
    <div style={{ background: "#F5EFDE" }}>

      {/* Sección de Categorías */}
      <section className="container py-5">
        {store.isLogged ?
        <Container className="row justify-content-center mt-4">
          <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
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
              <Tab.Pane eventKey="existing">
                <div className="row g-3">
                {store.mascotas.map((item, index) => (
                  <div key={index} className="col-sm-6 col-md-4 col-lg-3">
                    <div className="card border-0 shadow-sm h-100 bg-transparent">
                      <img
                        src={item.foto_mascot}
                        alt={item.name_mascot}
                        className="card-img-top rounded"
                        style={{ height: "300px", objectFit: "cover" }}
                      />
                      <div className="card-body text-center">
                        <h5 className="card-title" style={{ color: "#1E1E50" }}>
                          {item.name_mascot}
                        </h5>
                        <button className="btn fw-bold" type="button" onClick={(event) => handleDetails(event, item)}
                          style={{ color: "white", 
                            background:"#ff6100", 
                            border: "#ff6100",
                            borderRadius: "30px",
                            padding: "10px 20px"
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
                <form onSubmit={handleSubmit} className="row g-3">
                  {/* Campos del formulario */}
                  <div className="col-md-12">
                    {store.fotoMascota && (
                      <div className="text-center p-2 mb-3">
                        <img src={store.fotoMascota.foto} alt="Captura" className="img-fluid rounded" style={{ maxWidth: '200px' }} />
                      </div>
                    )}
                    <div className="text-center my-5 mb-3">
                      <label htmlFor="selectFoto" className="btn btn-primary" style={{ color: "white", background:"#ff6100", border: "#ff6100"}}>Upload a photo of your mascot</label>
                      <input id="selectFoto" type="file" accept="image/*" className="d-none" capture="environment" onChange={handleCapture} style={{ display: 'none' }} />
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Mascot Username</label>
                    <input type="text" name="mascota_id" className="form-control" value={mascota_name_id} onChange={(event) => setMascotaId(event.target.value)} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Mascot Password</label>
                    <input type="password" name="password" className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Mascot Name</label>
                    <input type="text" name="mascotname" className="form-control" value={name_mascot} onChange={(event) => setNameMascot(event.target.value)} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Birth Date</label>
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
                    <label className="form-label fw-semibold">Patology</label>
                    <input type="text" name="patology" className="form-control" value={patologia} onChange={(event) => setPatology(event.target.value)} />
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="form-label fw-semibold">Raza</label>
                    <input type="text" name="raza" className="form-control" value={raza} onChange={(event) => setRaza(event.target.value)} required />
                  </div>
                  <div className="col-md-6 mx-3 mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="is_mix" onChange={(event) => setMix(event.target.checked)}/>
                    <label className="form-check-label" htmlFor="is_mix">Your mascot is mix ?</label>
                  </div>
                  <div className="col-md-6 mx-3 mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="is_esterilizado" onChange={(event) => setEsterilizado(event.target.checked)}/>
                    <label className="form-check-label" htmlFor="is_esterilizado">Your mascot is Esterilizado ?</label>
                  </div>
                  {/* Botones de acción */}
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-primary fw-bold m-3" style={{ color: "white", background:"#ff6100", border: "#ff6100"}} type="submit">Sign In Mascot</button>
                  </div>
                </form>
              </Tab.Pane>
              <Tab.Pane eventKey="sharing">
                <p>🔗 Aquí mostrarías la información de mascotas compartidas.</p>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
        :
        <div></div>
        }
      </section>
    </div>
  );
};