import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const UserProfile = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [preview, setPreview] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const [name, setName] = useState(store.usuario.name);
    const [last_name, setLastName] = useState(store.usuario.last_name);
    const [username, setUsername] = useState(store.usuario.username);
    const [email, setEmail] = useState(store.usuario.email);
    const [phone, setPhone] = useState(store.usuario.phone);
    const [address, setAddress] = useState(store.usuario.address);
    const [sending_address_buyer, setSendingAddress] = useState(store.usuario.sending_address_buyer);
    const [country, setCountry] = useState(store.usuario.country);
    const [biography, setBiography] = useState(store.usuario.biography)

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          const result = await actions.uploadImage(file);
          if (!result) {
            setError("Error al subir la imagen");
            return;
          }
          setImageUrl(result);
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPreview("");
        setImageUrl(null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const idUsuario = store.usuario.id
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
            image_url: imageUrl
        }
        actions.updateUsuario(dataToSend, idUsuario);
        
        if(store.usuario.is_buyer) {
            const dataToSendBuyer = { sending_address_buyer }
            actions.updateUsuario(dataToSendBuyer, idUsuario);
        }
        
        navigate('/home')
    };

    return (
        <div className="container mt-5 p-4 bg-light rounded shadow-lg d-flex justify-content-center">
            <div className="card p-4 shadow-lg border-0" style={{ maxWidth: "600px", width: "100%", borderRadius: "12px" }}>
                <div className="text-center mb-4">
                    <div className="mt-3 text-end">
                        <img
                            src={store.usuario.image_url == null ? "https://i.imgur.com/24t1SYU.jpeg" : store.usuario.image_url}
                            className="rounded-circle img-fluid"
                            alt="Owner"
                            style={{ width: "60px", height: "60px" }}
                        />
                        <h3 className="mt-2 fw-bold text-center">Perfil de Usuario</h3>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-12 text-center">
                        <div className="image-upload-container d-flex flex-column align-items-center p-3 border rounded-3" style={{ borderColor: "#1E1E50", borderStyle: "dashed" }}>
                            {preview ? (
                            <>
                                <img src={preview} alt="Vista previa" className="img-fluid rounded mb-2" style={{ width: "350px", height: "350px", objectFit: "cover" }} />
                                <button type="button" className="btn btn-danger mt-2" onClick={removeImage}>Quitar Imagen</button>
                            </>
                            ) : (
                            <p className="text-muted">No hay imagen seleccionada</p>
                            )}
                        </div>
                    </div>
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
                    {store.usuario.is_buyer ?
                    <div className="col-md-12">
                        <label className="form-label fw-semibold">Dirección de Envio</label>
                        <input type="text" name="address" className="form-control" value={sending_address_buyer} onChange={(event) => setSendingAddress(event.target.value)} />
                    </div>
                    :
                    <div className="col-md-12">
                        <label className="form-label fw-semibold">Biografia</label>
                        <textarea name="content" placeholder="Descripcion del Evento" onChange={(event) => setBiography(event.target.value)} value={biography} className="form-control mb-2" required></textarea>
                    </div>
                    }
                    <div className="d-flex">
                        <div className="col-7">
                            <button className="btn btn-primary w-50 fw-bold m-3" type="submit">Guardar Cambios</button>
                        </div>
                        <div className="col-5">
                            <input type="file" accept="image/*" className="form-control d-none" id="fileInput" onChange={handleImageChange} />
                            <label htmlFor="fileInput" className="btn btn-outline-primary mt-2"><i className="fas fa-cloud-upload-alt"></i> Subir Una Imagen Perfil</label>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
