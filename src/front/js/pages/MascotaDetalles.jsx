import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

import { Analysis } from "../component/Analysis.jsx";
import { Peso } from "../component/Peso.jsx";
import { Activity } from "../component/Activity.jsx";
import { Temperature } from "../component/Temperature.jsx";
import { HeartRate } from "../component/HeartRate.jsx";
import { Incidencias } from "../component/Incidencias.jsx";

export const MascotaDetalles = () => {
    const { store, actions } = useContext(Context);

    const [activeMenu, setActiveMenu] = useState('incident');

    const toggleMenu = (menu) => {
        setActiveMenu((prev) => (prev === menu ? null : menu));
    };

    const analysis = store.analysis != null ? store.analysis.filter(analysis => analysis.mascota_analysis_id === store.idParam) : null;
    const metricasActivity = store.metrica != null ? store.metrica.filter(metricas => metricas.tipo_metrica_id === 'activity' && metricas.mascota_metrica_id === store.idParam) : null;
    const metricasWeight = store.metrica != null ? store.metrica.filter(metricas => metricas.tipo_metrica_id === 'weight' && metricas.mascota_metrica_id === store.idParam) : null;
    const metricasTemperature = store.metrica != null ? store.metrica.filter(metricas => metricas.tipo_metrica_id === 'temperature' && metricas.mascota_metrica_id === store.idParam) : null;
    const metricasHeartRate = store.metrica != null ? store.metrica.filter(metricas => metricas.tipo_metrica_id === 'heart_rate' && metricas.mascota_metrica_id === store.idParam) : null;
       
    const formatDateTime = (value) => {
        if (!value) return null;
            
        const date = new Date(value);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
    
        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    }

    return (
        <section className="container-fluid p-5">
            {store.isLogged ?
                <div>
                    <div className="row g-3">
                        <div className="col-md-2">
                            <div className="card border-0" style={{ borderRadius: "12px" }}>
                                <div className="card-header d-flex p-3" style={{ background: "#ffffffff" }}>
                                    <img src={store.currentMascota.foto_mascot} alt="Profile" className="rounded-circle m-1" width="50" height="50"></img>
                                    <div className="mx-3">
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
                                <button className="col-md-4 btn bg-transparent border-0" onClick={() => toggleMenu('analysis')}>
                                    <div className="card border-0" style={{ borderRadius: "12px" }}>
                                        <div className="card-header d-flex justify-content-between" >
                                            Urine Analysis<i className="fa-solid fa-droplet p-1"></i>
                                        </div>
                                        <div className="card-body">
                                            Last analysis at: 
                                            <br></br>
                                            {analysis[0] != null ? formatDateTime(analysis[0].ts_init) : ''}
                                        </div>
                                    </div>
                                </button>
                                <button className="col-md-4 btn bg-transparent border-0" onClick={() => toggleMenu('activity')}>
                                    <div className="card border-0" style={{ borderRadius: "12px" }}>
                                        <div className="card-header d-flex justify-content-between">
                                            Activity<i className="fa-solid fa-chart-line p-1"></i>
                                        </div>
                                        <div className="card-body">
                                            {metricasActivity[0] != null ? metricasActivity[0].valor_diario + ' min' : ''}
                                        </div>
                                    </div>
                                </button>
                                <button className="col-md-4 btn bg-transparent border-0" onClick={() => toggleMenu('weight')}>
                                    <div className="card border-0" style={{ borderRadius: "12px" }}>
                                        <div className="card-header d-flex justify-content-between">
                                            Weight<i className="fa-solid fa-weight-hanging"></i>
                                        </div>
                                        <div className="card-body">
                                            {metricasWeight[0] != null ? metricasWeight[0].valor_diario + ' kg' : ''}
                                        </div>
                                    </div>
                                </button>
                                <button className="col-md-4 btn bg-transparent border-0" onClick={() => toggleMenu('temperature')}>
                                    <div className="card border-0" style={{ borderRadius: "12px" }}>
                                        <div className="card-header d-flex justify-content-between">
                                            Temperature<i className="fa-solid fa-temperature-full p-1"></i>
                                        </div>
                                        <div className="card-body">
                                            {metricasTemperature[0] != null ? metricasTemperature[0].valor_diario + ' ºC' : ''}
                                        </div>
                                    </div>
                                </button>
                                <button className="col-md-4 btn bg-transparent border-0" onClick={() => toggleMenu('heartrate')}>
                                    <div className="card border-0" style={{ borderRadius: "12px" }}>
                                        <div className="card-header d-flex justify-content-between">
                                            Heart Rate<i className="fa-solid fa-heart p-1" ></i>
                                        </div>
                                        <div className="card-body">
                                            {metricasHeartRate[0] != null ? metricasHeartRate[0].valor_diario + ' bpm' : ''}
                                        </div>
                                    </div>
                                </button>
                                <button className="col-md-4 btn bg-transparent border-0" onClick={() => toggleMenu('incident')}>
                                    <div className="card border-0" style={{ borderRadius: "12px" }}>
                                        <div className="card-header d-flex justify-content-between">
                                            Incidents<i className="fa-solid fa-triangle-exclamation p-1"></i>
                                        </div>
                                        <div className="card-body">
                                            {store.incidencias.length}
                                        </div>
                                    </div>
                                </button>
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
                    {activeMenu === 'analysis' && (
                        <Analysis />
                    )}
                    {activeMenu === 'activity' && (
                        <Activity />
                    )}
                    {activeMenu === 'weight' && (
                        <Peso />
                    )}
                    {activeMenu === 'temperature' && (
                        <Temperature />
                    )}
                    {activeMenu === 'heartrate' && (
                        <HeartRate />
                    )}
                    {activeMenu === 'incident' && (
                        <Incidencias />
                    )}
                </div>
                :
                <div></div>
            }
        </section>
    );
}
