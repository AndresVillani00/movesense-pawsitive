import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Alert } from "../component/Alert.jsx";

export const MascotaProfile = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const [name_mascot, setNameMascot] = useState(store.currentMascota != null ? store.currentMascota.name_mascot : null);
  const [password, setPassword ] = useState(store.currentMascota != null ? store.currentMascota.password : null);
  const [foto_mascot, setFotoMascot] = useState(store.currentMascota != null ? store.currentMascota.foto_mascot : null);
  const [raza, setRaza] = useState(store.currentMascota != null ? store.currentMascota.raza : null);
  const [is_Esterilizado, setIsEsterilizado] = useState(store.currentMascota != null ? store.currentMascota.is_Esterilizado : null);
  const [patologia, setPatology] = useState(store.currentMascota != null ? store.currentMascota.patologia : null);
  const [status, setStatus] = useState(store.currentMascota != null ? store.currentMascota.status : null);

  const razas = ['Beagle', 'Border Collie', 'Bóxer', 'Bulldog Francés', 'Bulldog Inglés', 'Caniche', 'Chihuahua', 'Cocker Spaniel Inglés', 'Dálmata', 'Dobermann', 
    'Epagneul Bretón', 'Galgo Español', 'Golden Retriever', 'Husky Siberiano', 'Jack Russell Terrier / Parson Russell Terrier', 'Labrador Retriever', 'Mastín Español', 
    'Pastor Alemán', 'Perro de Agua Español', 'Podenco Ibicenco / Podenco Canario', 'Pomerania (Spitz Alemán Enano)', 'Pug (Carlino)', 'Rottweiler', 'San Bernardo', 
    'Setter Inglés', 'Shih Tzu', 'Staffordshire Bull Terrier / American Staffordshire Terrier', 'Teckel (Dachshund)', 'West Highland White Terrier', 'Yorkshire Terrier', 'Otros']

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = {
      name_mascot,
      password,
      foto_mascot,
      raza,
      is_Esterilizado,
      patologia,
      status
    };

    await actions.updateMascota(dataToSend, store.idParam);
    navigate("/home");
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

  const handleStatusChange = (event) => {
    const isChecked = event.target.checked;
    const value = isChecked ? "nonactive" : "active";

    setStatus(value);

  };


  const handleCapture = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setFotoMascot({ foto: base64 });
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="container-fluid p-5">
      {store.isLogged ?
        <div className="mt-5 p-4 d-flex justify-content-center card p-4 shadow-lg border-0">
          <div className="p-2">
            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Volver</button>
          </div>
          <div className="text-center mb-4">
            <div className="mt-3 text-end">
              <h3 className="mt-2 fw-bold text-center">Perfil de Mascota</h3>
            </div>
          </div>
          <Alert />
          <form onSubmit={handleSubmit} className="row g-3">
            {/* Campos del formulario */}
            <div className="col-md-12">
              {foto_mascot && (
                <div className="text-center p-2 mb-3">
                  <img src={foto_mascot} alt="Captura" className="img-fluid rounded" style={{ maxWidth: '200px' }} />
                </div>
              )}
              <div className="text-center my-5 mb-3">
                <label htmlFor="selectFoto" className="btn btn-primary" style={{ color: "white", background:"#ff6100", border: "#ff6100"}}>Upload a photo of your mascot</label>
                <input id="selectFoto" type="file" accept="image/*" className="d-none" capture="environment" onChange={handleCapture} style={{ display: 'none' }} />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Username de Mascota</label>
              <span className="input-group-text">{store.currentMascota.mascota_name_id}</span>
            </div>
            <div className="mb-3 input-group">
              <label className="form-label col-12">Contraseña</label>
              <input onChange={(event) => validatePassword(event.target.value)} value={password} type={showPassword ? "text" : "password"} className={`form-control ${error ? "is-invalid" : "is-valid"} border-0 shadow-sm`} placeholder="Introduce tu Contraseña" required />
              <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
              </span>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Nombre</label>
              <input type="text" name="mascotname" className="form-control" value={name_mascot} onChange={(event) => setNameMascot(event.target.value)} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Patología</label>
              <select className="form-select" aria-label="Default select example" value={patologia} onChange={(event) => setPatology(event.target.value)} >
                <option value="">Selecciona una Patología</option>
                <option value="food_pathology">Patología de Comida</option>
                <option value="movility_pathology">Patología de Movilidad</option>
                <option value="skin_pathology">Patología en la Piel</option>
                <option value="cardiac_pathology">Patología Cardiaca</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Raza</label>
              <select className="form-select" aria-label="Default select example" value={raza} onChange={(event) => setRaza(event.target.value)} required >
                <option value="">Selecciona una Raza</option>
                {razas.map((item) => {
                  return (
                    <option value={item}>{item}</option>
                  );
                }
              )}
              </select>
            </div>
            <div className="col-md-6 mx-3 mb-3 form-check">
              <input type="checkbox" className="form-check-input" checked={status === "nonactive"} id="status" onChange={(event) => handleStatusChange(event)} />
              <label className="form-check-label" htmlFor="status">Marca esta opción si {name_mascot} ha fallecido.</label>
            </div>
            <div className="col-md-6 mx-3 mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="is_esterilizado" onChange={(event) => setIsEsterilizado(event.target.checked)} />
              <label className="form-check-label" htmlFor="is_esterilizado">¿ Tu mascota esta Esterilizada ?</label>
            </div>
            {/* Botones de acción */}
            <div className="d-flex justify-content-between">
              <button className="btn btn-primary fw-bold m-3" style={{ color: "white", background:"#ff6100", border: "#ff6100"}} type="submit">Actualizar Mascota</button>
            </div>
          </form>
        </div>
      :
        <div></div>
      }
    </section>
  );
};
