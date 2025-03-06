import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Artists = () => {
    const { store, actions } = useContext(Context);
    const [search, setSearch] = useState("");
    const [filteredArtists, setFilteredArtists] = useState([]);

    useEffect(() => {
        actions.getArtists();
    }, []);

    useEffect(() => {
        setFilteredArtists(
            store.artists.filter(artist =>
                artist.username.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, store.artists]);

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
            <div className="row">
                {filteredArtists.length > 0 ? (
                    filteredArtists.map(artist => (
                        <div key={artist.id} className="col-md-4 mb-4">
                            <div className="card shadow-sm">
                                <img className="card-img-top" src={artist.profile_pic || "https://via.placeholder.com/150"} alt={artist.username} />
                                <div className="card-body">
                                    <h5 className="card-title">{artist.username}</h5>
                                    <p className="card-text">{artist.bio || "Artista sin biografía."}</p>
                                    <Link to={`/artist/${artist.id}`} className="btn btn-primary">Ver Perfil</Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No se encontraron artistas.</p>
                )}
            </div>
        </div>
    );
};
