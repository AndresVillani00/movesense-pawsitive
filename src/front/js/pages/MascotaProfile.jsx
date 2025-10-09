import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Alert } from "../component/Alert.jsx";

export const MascotaProfile = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  
  const [name_mascot, setNameMascot] = useState(store.currentMascota.name_mascot);
  const [foto_mascot, setFotoMascot] = useState(store.currentMascota.foto_mascot);
  const [raza, setRaza] = useState(store.currentMascota.raza);
  const [is_Esterilizado, setIsEsterilizado] = useState(store.currentMascota.is_Esterilizado);
  const [patologia, setPatology] = useState(store.currentMascota.patologia);
  const [status, setStatus] = useState(store.currentMascota.status);

  const razas = ['Beagle', 'Border Collie', 'Bóxer', 'Bulldog Francés', 'Bulldog Inglés', 'Caniche', 'Chihuahua', 'Cocker Spaniel Inglés', 'Dálmata', 'Dobermann', 
    'Epagneul Bretón', 'Galgo Español', 'Golden Retriever', 'Husky Siberiano', 'Jack Russell Terrier / Parson Russell Terrier', 'Labrador Retriever', 'Mastín Español', 
    'Pastor Alemán', 'Perro de Agua Español', 'Podenco Ibicenco / Podenco Canario', 'Pomerania (Spitz Alemán Enano)', 'Pug (Carlino)', 'Rottweiler', 'San Bernardo', 
    'Setter Inglés', 'Shih Tzu', 'Staffordshire Bull Terrier / American Staffordshire Terrier', 'Teckel (Dachshund)', 'West Highland White Terrier', 'Yorkshire Terrier', 'Otros']

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = {
      name_mascot,
      foto_mascot,
      raza,
      is_Esterilizado,
      patologia,
      status
    };

    await actions.updateMascota(dataToSend, store.idParam);
    navigate("/home");
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
    <div className="container" style={{ maxWidth: "600px", width: "100%", borderRadius: "12px" }}>
      {store.isLogged ?
        <div className="mt-5 p-4 d-flex justify-content-center card p-4 shadow-lg border-0">
          <div className="p-2">
            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Volver</button>
          </div>
          <div className="text-center mb-4">
            <div className="mt-3 text-end">
              <h3 className="mt-2 fw-bold text-center">Pet Profile</h3>
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
              <label className="form-label fw-semibold">Pet Name</label>
              <input type="text" name="mascotname" className="form-control" value={name_mascot} onChange={(event) => setNameMascot(event.target.value)} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Pathology</label>
              <select className="form-select" aria-label="Default select example" value={patologia} onChange={(event) => setPatology(event.target.value)} >
                <option value="">Select a Pathology</option>
                <option value="food_pathology">Food pathology</option>
                <option value="movility_pathology">Movility pathology</option>
                <option value="skin_pathology">Skin pathology</option>
                <option value="cardiac_pathology">Cardiac pathology</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Breed</label>
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
            <div className="col-md-6">
              <label className="form-label fw-semibold">Change this if your pet is still active</label>
              <select className="form-select" aria-label="Default select example" value={status} onChange={(event) => setStatus(event.target.value)} required >
                <option value="active">Still Active</option>
                <option value="nonactive">Not Active</option>
              </select>
            </div>
            <div className="col-md-6 mx-3 mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="is_esterilizado" onChange={(event) => setIsEsterilizado(event.target.checked)} />
              <label className="form-check-label" htmlFor="is_esterilizado">Is your pet Spay / Neuter ?</label>
            </div>
            {/* Botones de acción */}
            <div className="d-flex justify-content-between">
              <button className="btn btn-primary fw-bold m-3" style={{ color: "white", background:"#ff6100", border: "#ff6100"}} type="submit">Update your pet</button>
            </div>
          </form>
        </div>
      :
        <div></div>
      }
    </div>
  );
};
