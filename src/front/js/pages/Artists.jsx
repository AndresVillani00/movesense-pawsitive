import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

export const Artists = () => {
    const { store } = useContext(Context);
    const [search, setSearch] = useState("");
    const imagenes = [
        'https://randomuser.me/api/portraits/lego/0.jpg',
        'https://randomuser.me/api/portraits/lego/1.jpg',
        'https://randomuser.me/api/portraits/lego/2.jpg',
        'https://randomuser.me/api/portraits/lego/3.jpg',
        'https://randomuser.me/api/portraits/lego/4.jpg',
        'https://randomuser.me/api/portraits/lego/5.jpg',
        'https://randomuser.me/api/portraits/lego/7.jpg',
        'https://randomuser.me/api/portraits/lego/8.jpg'
    ];
    const aleatorio = Math.floor(Math.random() * imagenes.length);
	const randomImg = imagenes[aleatorio]

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Descubre a Nuestros Artistas</h2>
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar artista..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="p-4 bg-light rounded">
                {/* Header */}
                <div className="text-center my-4">
                <h1 className="fw-bold text-dark">Explora Artistas que ya venden Obras de Arte</h1>
                <p className="text-muted">Descubre los distintos artistas talentosos de nuestra web.</p>
                </div>

                {/* Grid de productos */}
                <div className="row">
                {store.artists.map(item => (
                    <div key={item.id} className="col-md-3 mb-4">
                    <div className="card shadow-sm bg-white">
                        <img
                        src={randomImg}
                        className="card-img-top rounded"
                        style={{ height: "200px", objectFit: "cover", width: "100%" }}
                        />
                        <div className="card-body text-center">
                        <h5 className="fw-bold">{item.username}</h5>
                        <p className="text-muted">{/*store.seller.reputation*/}</p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};
