import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Alert } from "../component/Alert.jsx";

export const UserProfile = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  
  {/* User Data */}
  const [name, setName] = useState(store.usuario.name);
  const [last_name, setLastName] = useState(store.usuario.last_name);
  const [email, setEmail] = useState(store.usuario.email);
  const [country, setCountry] = useState(store.usuario.country);
  const [address, setAddress] = useState(store.usuario.address);
  const [phone, setPhone] = useState(store.usuario.phone);
  const [postalCode, setPostalCode] = useState(store.usuario.postalcode);

  {/* Vets Data */}
  const [name_clinica, setNameClinica] = useState(store.veterinario.name_clinica);
  const [email_clinica, setEmailClinica] = useState(store.veterinario.email_clinica);
  const [address_clinica, setAddressClinica] = useState(store.veterinario.address_clinica);
  const [phone_clinica, setPhoneClinica] = useState(store.veterinario.phone_clinica);
  const [name_doctor, setNameDoctor] = useState(store.veterinario.name_doctor);
  const [last_name_doctor, setLastNameDoctor] = useState(store.veterinario.last_name_doctor);
  const [email_doctor, setEmailDoctor] = useState(store.veterinario.email_doctor);
  const [phone_doctor, setPhoneDoctor] = useState(store.veterinario.phone_doctor);

  const handleUserSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = {
      name,
      last_name,
      email,
      country,
      address,
      phone,
      postalCode
    };

    await actions.updateUsuario(dataToSend);
    navigate("/home");
  };

  const handleVetSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = {
      name_clinica,
      email_clinica,
      address_clinica,
      phone_clinica,
      name_doctor,
      last_name_doctor,
      email_doctor,
      phone_doctor
    };

    await actions.updateVeterinario(dataToSend);

    navigate("/home");
  };

  return (
    <div className="container mt-5 p-4 d-flex justify-content-center card p-4 shadow-lg border-0" style={{ maxWidth: "600px", width: "100%", borderRadius: "12px" }}>
      <div className="text-center mb-4">
        <div className="mt-3 text-end">
          <h3 className="mt-2 fw-bold text-center">Perfil de Usuario</h3>
        </div>
      </div>
      <Alert />
      {/* Campos del formulario */}
      {store.usuario.is_veterinario ? (
        <form onSubmit={handleVetSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Nombre de la Clinica</label>
            <input type="text" name="name_clinica" className="form-control" value={name_clinica} onChange={(event) => setNameClinica(event.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Email de la Clinica</label>
            <input type="text" name="email_clinica" className="form-control" value={email_clinica} onChange={(event) => setEmailClinica(event.target.value)} />
          </div>
          <div className="col-md-8">
            <label className="form-label fw-semibold">Dirección de la Clinica</label>
            <input type="text" name="address_clinica" className="form-control" value={address_clinica} onChange={(event) => setAddressClinica(event.target.value)} required />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Telefono de la Clinica</label>
            <input type="text" name="phone_clinica" className="form-control" value={phone_clinica} onChange={(event) => setPhoneClinica(event.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Nombre del Doctor/a</label>
            <input type="text" name="name_doctor" className="form-control" value={name_doctor} onChange={(event) => setNameDoctor(event.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Apellido del Doctor/a</label>
            <input type="text" name="last_name_doctor" className="form-control" value={last_name_doctor} onChange={(event) => setLastNameDoctor(event.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Email del Doctor/a</label>
            <input type="text" name="email_doctor" className="form-control" value={email_doctor} onChange={(event) => setEmailDoctor(event.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Telefono del Doctor/a</label>
            <input type="text" name="phone_doctor" className="form-control" value={phone_doctor} onChange={(event) => setPhoneDoctor(event.target.value)} required />
          </div>
          {/* Botones de acción */}
          <div className="d-flex">
            <div className="col-7">
              <button className="btn btn-primary w-50 fw-bold m-3" type="submit">Actualizar</button>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleUserSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Nombre</label>
            <input type="text" name="name" className="form-control" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Apellido</label>
            <input type="text" name="lastName" className="form-control" value={last_name} onChange={(event) => setLastName(event.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" name="email" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Whatsapp</label>
            <input type="text" name="phone" className="form-control" value={phone} onChange={(event) => setPhone(event.target.value)} />
          </div>
          <div className="col-md-8">
            <label className="form-label fw-semibold">Dirección</label>
            <input type="text" name="address" className="form-control" value={address} onChange={(event) => setAddress(event.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Codigo Postal</label>
            <input type="text" name="postalcode" className="form-control" value={postalCode} onChange={(event) => setPostalCode(event.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">País</label>
            <input type="text" className="form-control" value={country} onChange={(event) => setCountry(event.target.value)} />
          </div>
          {/* Botones de acción */}
          <div className="d-flex">
            <div className="col-7">
              <button className="btn btn-primary w-50 fw-bold m-3" type="submit">Actualizar</button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};