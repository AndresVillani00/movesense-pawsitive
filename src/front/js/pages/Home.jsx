import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";

export const Home = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [nameMascot, setNameMascot] = useState(store.mascota.name_mascot);
  const [foto, setFoto] = useState(store.mascota.foto_mascot);
  const [raza, setRaza] = useState(store.mascota.raza);
  const [isMix, setMix] = useState(store.mascota.is_mix);
  const [birthdate, setBirthdate] = useState(store.mascota.birth_date);
  const [gender, setGender] = useState(store.mascota.gender);
  const [isEsterilizado, setEsterilizado] = useState(store.mascota.is_Esterilizado);
  const [patology, setPatology] = useState(store.mascota.patologia);

  const handleSubmit = async (event) => {
    event.preventDefault();
        
    const dataToSend = {
      nameMascot,
      raza,
      birthdate,
      gender,
      patology
    }

    await actions.postMascota(dataToSend);
    navigate('/home');
  }

  return (
    <div style={{ background: "#F5EFDE" }}>

      {/* Sección de Categorías */}
      <section className="container py-5">
        {store.isLogged ?
        <div className="row justify-content-center g-4">
          <h2 className="text-center mb-4" style={{ color: "#1E1E50" }}>
            {store.mascotas.length == 0 ? "Registra tu Mascotas" : "Mascotas"}
          </h2>
          {store.mascotas.length == 0 ?
            <div className="container mt-5 p-4 d-flex justify-content-center card p-4 shadow-lg border-0" style={{ maxWidth: "600px", width: "100%", borderRadius: "12px" }}>
              <form onSubmit={handleSubmit} className="row g-3">
                {/* Campos del formulario */}
                <div className="col-md-12">
                  <div className="text-center my-5 mb-3">
                    <label className="form-label fw-semibold" htmlFor="selectFoto"></label>
                    <label htmlFor="selectFoto" className="btn btn-primary" >Upload a photo of your mascot</label>
                    <input type="file" className="d-none" id="selectFoto"/>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Mascot Name</label>
                  <input type="text" name="name" className="form-control" value={nameMascot} onChange={(event) => setNameMascot(event.target.value)} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Birth Date</label>
                  <input type="date" name="username" className="form-control" value={birthdate} onChange={(event) => setBirthdate(event.target.value)} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Gender</label>
                  <input type="text" name="username" className="form-control" value={gender} onChange={(event) => setGender(event.target.value)} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Patology</label>
                  <input type="text" name="username" className="form-control" value={patology} onChange={(event) => setPatology(event.target.value)} />
                </div>
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-semibold">Raza</label>
                  <input type="text" name="lastName" className="form-control" value={raza} onChange={(event) => setRaza(event.target.value)} required />
                </div>
                <div className="col-md-6 mx-3 mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="is_mix"/>
                  <label className="form-check-label" htmlFor="is_mix">Your mascot is mix ?</label>
                </div>
                <div className="col-md-6 mx-3 mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="is_esterilizado"/>
                  <label className="form-check-label" htmlFor="is_esterilizado">Your mascot is Esterilizado ?</label>
                </div>
                {/* Botones de acción */}
                <div className="d-flex justify-content-between">
                  <button className="btn btn-primary fw-bold m-3" type="submit">Sign In Mascot</button>
                  <button className="btn btn-secondary fw-bold m-3" type="submit">Cancel</button>
                </div>
              </form>
            </div>
          :
            store.mascotas.map((item, index) => (
            <div key={index} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card border-0 shadow-sm h-100 bg-transparent">
                <img
                  src={item.img}
                  alt={item.name_mascot}
                  className="card-img-top rounded-circle"
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title" style={{ color: "#1E1E50" }}>
                    {item.name_mascot}
                  </h5>
                  <Link
                    to={'/mascota-profile'}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        :
        <div></div>
        }
      </section>
    </div>
  );
};