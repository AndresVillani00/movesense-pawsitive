import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";

import { Incidencias } from "../component/Incidencias.jsx";

export const MascotaDetalles = () => {
    const { store, actions } = useContext(Context);
    const { idMascot } = useParams();

    return (
        <section className="container-fluid p-5">
            {store.isLogged ?
                <div>
                    <div className="row g-3">
                        <div className="col-md-2">
                            <div className="card border-0" style={{ borderRadius: "12px" }}>
                                <div className="card-header d-flex p-3" style={{ background: "#ffffffff" }}>
                                    <img src={store.currentMascota.foto_mascot} alt="Profile" className="rounded-circle m-1" width="50" height="50"></img>
                                    <div className="m-auto">
                                        <h5>{store.currentMascota.name_mascot}</h5>
                                        <p className="text-center">{store.currentMascota.raza}</p>
                                    </div>
                                </div>
                                <div className="card-body p-5">

                                </div>
                                <div className="card-footer" style={{ background: "#ffffffff" }}>
                                    Reports
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="card border-0" style={{ borderRadius: "12px" }}>
                                        <div className="card-header d-flex justify-content-between" >
                                            Water Intake<i className="fa-solid fa-droplet p-1"></i>
                                        </div>
                                        <div className="card-body">

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card border-0" style={{ borderRadius: "12px" }}>
                                        <div className="card-header d-flex justify-content-between">
                                            Activity<i className="fa-solid fa-chart-line p-1"></i>
                                        </div>
                                        <div className="card-body">

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card border-0" style={{ borderRadius: "12px" }}>
                                        <div className="card-header d-flex justify-content-between">
                                            Weight<i className="fa-solid fa-weight-hanging"></i>
                                        </div>
                                        <div className="card-body">

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card border-0" style={{ borderRadius: "12px" }}>
                                        <div className="card-header d-flex justify-content-between">
                                            Temperature<i className="fa-solid fa-temperature-full p-1"></i>
                                        </div>
                                        <div className="card-body">

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card border-0" style={{ borderRadius: "12px" }}>
                                        <div className="card-header d-flex justify-content-between">
                                            Heart Rate<i className="fa-solid fa-heart p-1" ></i>
                                        </div>
                                        <div className="card-body">

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card border-0" style={{ borderRadius: "12px" }}>
                                        <div className="card-header d-flex justify-content-between">
                                            Incidents<i className="fa-solid fa-triangle-exclamation p-1"></i>
                                        </div>
                                        <div className="card-body">
                                            {store.incidencias.length}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card border-0" style={{ borderRadius: "12px" }}>
                                <div className="card-header" style={{ background: "#ffffffff" }}>
                                    List of Profiles
                                </div>
                                <div className="card-body p-5">

                                </div>
                            </div>
                        </div>
                    </div>
                    <Incidencias />
                </div>
                :
                <div></div>
            }
        </section>
    );
}
