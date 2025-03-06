import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

export const UserProfile = () => {
    const { store, actions } = useContext(Context)
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        zipCode: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const idUsuario = store.usuario.id
        const dataToSend = {
            name: userInfo.name,
            lastName: userInfo.lastName,
            username: userInfo.username,
            email: userInfo.email,
            phone: userInfo.phone,
            address: userInfo.address,
            city: userInfo.city,
            country: userInfo.country,
            zipCode: userInfo.zipCode
        }
        actions.updateUsuario(dataToSend, idUsuario);
    };

    return (
        <div className="container mt-5 p-4 bg-light rounded shadow-lg d-flex justify-content-center">
            <div className="card p-4 shadow-lg border-0" style={{ maxWidth: "600px", width: "100%", borderRadius: "12px" }}>
                <div className="text-center mb-4">
                    <div className="mt-3 text-end">
                        <img
                            src="https://i.imgur.com/24t1SYU.jpeg"
                            className="rounded-circle img-fluid"
                            alt="Owner"
                            style={{ width: "60px", height: "60px" }}
                        />
                        <h3 className="mt-2 fw-bold text-center">Perfil de Usuario</h3>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">Nombre</label>
                        <input type="text" name="name" className="form-control" value={store.usuario.name} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">Apellido</label>
                        <input type="text" name="lastName" className="form-control" value={store.usuario.lastName} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">Username</label>
                        <input type="text" name="username" className="form-control" value={store.usuario.username} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Correo Electrónico</label>
                        <input type="email" name="email" className="form-control" value={store.usuario.email} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Teléfono</label>
                        <input type="text" name="phone" className="form-control" value={store.usuario.phone} onChange={handleChange} required />
                    </div>
                    <div className="col-md-12">
                        <label className="form-label fw-semibold">Dirección</label>
                        <input type="text" name="address" className="form-control" value={store.usuario.address} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-semibold">Ciudad</label>
                        <input type="text" name="city" className="form-control" value={store.usuario.city} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4">
                        <fieldset disabled>
                            <label htmlFor="disabledTextInput" className="form-label">País</label>
                            <input type="text" id="disabledTextInput" className="form-control" placeholder="Espana" />
                        </fieldset>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Código Postal</label>
                        <input type="text" name="zipCode" className="form-control" value={store.usuario.zipCode} onChange={handleChange} required />
                    </div>
                    <div className="col-12 text-center">
                        <button className="btn btn-primary w-50 fw-bold m-3" type="submit">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
