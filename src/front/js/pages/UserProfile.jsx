import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const UserProfile = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(store.usuario.image_url || ""); // Avatar seleccionado
  const [name, setName] = useState(store.usuario.name);
  const [last_name, setLastName] = useState(store.usuario.last_name);
  const [username, setUsername] = useState(store.usuario.username);
  const [email, setEmail] = useState(store.usuario.email);
  const [phone, setPhone] = useState(store.usuario.phone);
  const [address, setAddress] = useState(store.usuario.address);
  const [sending_address_buyer, setSendingAddress] = useState(store.usuario.sending_address_buyer);
  const [country, setCountry] = useState(store.usuario.country);
  const [biography, setBiography] = useState(store.usuario.biography);

  // Banco de avatares (rutas de imágenes)
  const avatars = [
    "https://i.imgur.com/24t1SYU.jpeg", // Avatar 1
    "https://i.imgur.com/4321lqr.jpeg", // Avatar 2
    "https://i.imgur.com/zYX4xje.jpeg", // Avatar 3
    // Agrega más avatares aquí
  ];

  const handleAvatarSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl); // Guardar el avatar seleccionado
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const idUsuario = store.usuario.id;

    // Datos a enviar para actualizar el perfil
    const dataToSend = {
      name,
      last_name,
      username,
      email,
      phone,
      address,
      sending_address_buyer,
      country,
      biography,
      image_url: selectedAvatar, // Incluir la URL del avatar seleccionado
    };

    // Actualizar el perfil del usuario
    await actions.updateUsuario(dataToSend, idUsuario);

    // Si es comprador, actualizar la dirección de envío
    if (store.usuario.is_buyer) {
      const dataToSendBuyer = { sending_address_buyer };
      await actions.updateUsuario(dataToSendBuyer, idUsuario);
    }

    // Redirigir a la página de inicio
    navigate('/home');
  };

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow-lg d-flex justify-content-center">
      <div className="card p-4 shadow-lg border-0" style={{ maxWidth: "600px", width: "100%", borderRadius: "12px" }}>
        <div className="text-center mb-4">
          <div className="mt-3 text-end">
            <img
              src={selectedAvatar || "https://i.imgur.com/24t1SYU.jpeg"} // Mostrar el avatar seleccionado o uno por defecto
              className="rounded-circle img-fluid"
              alt="Owner"
              style={{ width: "60px", height: "60px" }}
            />
            <h3 className="mt-2 fw-bold text-center">Perfil de Usuario</h3>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="row g-3">
          {/* Sección para seleccionar un avatar */}
          <div className="col-12 text-center">
            <h5 className="fw-semibold mb-3">Selecciona un avatar</h5>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              {avatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className={`img-fluid rounded-circle cursor-pointer ${selectedAvatar === avatar ? "border border-primary" : ""}`}
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  onClick={() => handleAvatarSelect(avatar)}
                />
              ))}
            </div>
          </div>

          {/* Campos del formulario */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">Nombre</label>
            <input type="text" name="name" className="form-control" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Apellido</label>
            <input type="text" name="lastName" className="form-control" value={last_name} onChange={(event) => setLastName(event.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Username</label>
            <input type="text" name="username" className="form-control" value={username} onChange={(event) => setUsername(event.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Correo Electrónico</label>
            <input type="email" name="email" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Teléfono</label>
            <input type="text" name="phone" className="form-control" value={phone} onChange={(event) => setPhone(event.target.value)} />
          </div>
          <div className="col-md-8">
            <label className="form-label fw-semibold">Dirección</label>
            <input type="text" name="address" className="form-control" value={address} onChange={(event) => setAddress(event.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">País</label>
            <input type="text" className="form-control" value={country} onChange={(event) => setCountry(event.target.value)} />
          </div>
          {store.usuario.is_buyer ? (
            <div className="col-md-12">
              <label className="form-label fw-semibold">Dirección de Envío</label>
              <input type="text" name="address" className="form-control" value={sending_address_buyer} onChange={(event) => setSendingAddress(event.target.value)} />
            </div>
          ) : (
            <div className="col-md-12">
              <label className="form-label fw-semibold">Biografía</label>
              <textarea name="content" placeholder="Descripción del Evento" onChange={(event) => setBiography(event.target.value)} value={biography} className="form-control mb-2" required></textarea>
            </div>
          )}

          {/* Botones de acción */}
          <div className="d-flex">
            <div className="col-7">
              <button className="btn btn-primary w-50 fw-bold m-3" type="submit">Guardar Cambios</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};