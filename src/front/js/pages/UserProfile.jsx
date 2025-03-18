import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const UserProfile = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(store.usuario.image_url || "");
  const [name, setName] = useState(store.usuario.name);
  const [last_name, setLastName] = useState(store.usuario.last_name);
  const [username, setUsername] = useState(store.usuario.username);
  const [email, setEmail] = useState(store.usuario.email);
  const [phone, setPhone] = useState(store.usuario.phone);
  const [address, setAddress] = useState(store.usuario.address);
  const [sending_address_buyer, setSendingAddress] = useState(store.usuario.sending_address_buyer);
  const [country, setCountry] = useState(store.usuario.country);
  const [biography, setBiography] = useState(store.usuario.biography);
  const [showAvatars, setShowAvatars] = useState(false);

  const avatarsForSellers = [
    "https://i.imgur.com/24t1SYU.jpeg", 
    "https://i.imgur.com/sERE9Yi.jpeg", 
    "https://i.imgur.com/zYX4xje.jpeg", 
    "https://i.imgur.com/rMJbDrq.jpeg", 
    "https://i.imgur.com/QwH0Arw.jpeg", 
  ];

  const avatarsForBuyers = [
    "https://i.imgur.com/4uXNHmC.jpeg", 
    "https://i.imgur.com/PgVeFHm.jpeg",
    "https://i.imgur.com/VZ7yg81.jpeg",
    "https://i.imgur.com/bn0gutF.jpeg" 
  ];

  const avatars = store.usuario.is_seller ? avatarsForSellers : avatarsForBuyers;

  const handleAvatarSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    setShowAvatars(false); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const idUsuario = store.usuario.id;

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
      image_url: selectedAvatar,
    };

    await actions.updateUsuario(dataToSend, idUsuario);

    if (store.usuario.is_buyer) {
      const dataToSendBuyer = { sending_address_buyer };
      await actions.updateUsuario(dataToSendBuyer, idUsuario);
    }

    navigate("/home");
  };

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow-lg d-flex justify-content-center">
      <div className="card p-4 shadow-lg border-0" style={{ maxWidth: "600px", width: "100%", borderRadius: "12px" }}>
        <div className="text-center mb-4">
          <div className="mt-3 text-end">
            <img
              src={selectedAvatar || "https://i.imgur.com/24t1SYU.jpeg"}
              className="rounded-circle img-fluid"
              alt="Owner"
              style={{ width: "60px", height: "60px" }}
            />
            <h3 className="mt-2 fw-bold text-center">Perfil de Usuario</h3>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="row g-3">
          {/* Botón para mostrar/ocultar avatares */}
          <div className="col-12 text-center">
            <button
              type="button"
              className="btn btn-outline-primary mb-3"
              onClick={() => setShowAvatars(!showAvatars)}
            >
              {showAvatars ? "Ocultar avatares" : "Seleccionar avatar"}
            </button>

            {showAvatars && (
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
            )}
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