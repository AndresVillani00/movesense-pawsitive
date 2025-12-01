import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Tab, Nav } from 'react-bootstrap';

import { Food } from "../component/Food.jsx";
import { ReportButton } from "../component/ReportButton.jsx";

import { Analysis } from "../component/Analysis.jsx";
import { Peso } from "../component/Peso.jsx";
import { Activity } from "../component/Activity.jsx";
import { Temperature } from "../component/Temperature.jsx";
import { HeartRate } from "../component/HeartRate.jsx";
import { Incidencias } from "../component/Incidencias.jsx";
import { AnalysisButton } from "../buttons/AnalysisButton.jsx";
import { PesoButton } from "../buttons/PesoButton.jsx";
import { ActivityButton } from "../buttons/ActivityButton.jsx";
import { TemperatureButton } from "../buttons/TemperatureButton.jsx";
import { HeartRateButton } from "../buttons/HeartRateButton.jsx";
import { IncidenciasButton } from "../buttons/IncidenciasButton.jsx";

export const MascotaDetalles = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [activeMenu, setActiveMenu] = useState('incident');
    const [activeKeyDetail, setActiveKeyDetail] = useState('overview');
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        actions.getIncidencia(store.idParam);
        actions.getMetrica(store.idParam);
        actions.getAnalysis(store.idParam);
        actions.getFood(store.idParam);
        actions.getReport(store.idParam);
    }, [])

    const toggleMenu = (menu) => {
        setActiveMenu((prev) => (prev === menu ? null : menu));
        setSelected(menu);
    };

    const buttonStyle = (key) => ({
        boxShadow: selected === key ? "0 0 12px 3px rgba(13,110,253,0.6)" : "none", // azul Bootstrap primary
        borderRadius: "12px",
        transition: "box-shadow 0.3s ease-in-out",
    });

    const analysis = store.analysis != null ? store.analysis.filter(analysis => analysis.mascota_analysis_id === store.idParam) : null;
    const metricasActivity = store.metricas != null ? store.metricas.filter(metricas => metricas.tipo_metrica_id === 'activity' && metricas.mascota_metrica_id === store.idParam) : null;
    const metricasWeight = store.metricas != null ? store.metricas.filter(metricas => metricas.tipo_metrica_id === 'weight' && metricas.mascota_metrica_id === store.idParam) : null;
    const metricasTemperature = store.metricas != null ? store.metricas.filter(metricas => metricas.tipo_metrica_id === 'temperature' && metricas.mascota_metrica_id === store.idParam) : null;
    const metricasHeartRate = store.metricas != null ? store.metricas.filter(metricas => metricas.tipo_metrica_id === 'heart_rate' && metricas.mascota_metrica_id === store.idParam) : null;

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

    const handleEdit = async (event, mascota) => {
        event.preventDefault();

        actions.setCurrentMascota(mascota);
        actions.setIdParam(mascota.id)

        store.alert = { text: '', background: 'primary', visible: false }
        navigate('/edit-pet');
    };

    const handleShareDelete = async (event, userId) => {
        event.preventDefault();

        await actions.deleteShareMascot(store.idParam, userId)
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
                                    <button type="button" className="btn border-0 bg-transparent p-0 mx-3" onClick={(event) => handleEdit(event, store.currentMascota)}>
                                        <i className="fa-solid fa-pen-to-square text-primary"></i>
                                    </button>
                                </div>
                                <div className="card-body p-5">
                                    <p className="text-center">{store.reportes[0] != null ? store.reportes[0].score + "/10" : "Aún no has generado ningún reporte de " + store.currentMascota.name_mascot + ". Introduce los datos de las métricas y genera un reporte para obtener una valoración del estado de salud de  " + store.currentMascota.name_mascot}</p>
                                </div>
                                <ReportButton />
                            </div>
                        </div>
                        <div className="col-md-8">
                            <Tab.Container activeKey={activeKeyDetail} onSelect={(k) => setActiveKeyDetail(k)}>
                                <Tab.Content className="border-0 p-4 bg-transparent mt-3">
                                    <Tab.Pane eventKey="overview">
                                        <h3>Vista General</h3>
                                        <div className="row g-3">
                                            <div className="col-md-4 btn bg-transparent border-0" onClick={() => toggleMenu('weight')}>
                                                <div className="card border-0" style={buttonStyle('weight')}>
                                                    <div className="card-header d-flex justify-content-between">
                                                        <div className="p-2">
                                                            Peso<i className="fa-solid fa-weight-hanging mx-2 p-1"></i>
                                                        </div>
                                                        <PesoButton />
                                                    </div>
                                                    <div className="card-body">
                                                        {metricasWeight[0] != null ? (metricasWeight.length > 0 ? metricasWeight[metricasWeight.length - 1].valor_diario + ' kg' : metricasWeight[0].valor_diario + ' kg') : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 btn bg-transparent border-0" onClick={() => toggleMenu('activity')}>
                                                <div className="card border-0" style={buttonStyle('activity')}>
                                                    <div className="card-header d-flex justify-content-between">
                                                        <div className="p-2">
                                                            Actividad<i className="fa-solid fa-chart-line mx-2 p-1"></i>
                                                        </div>
                                                        <ActivityButton />
                                                    </div>
                                                    <div className="card-body">
                                                        {metricasActivity[0] != null ? (metricasActivity.length > 0 ? metricasActivity[metricasActivity.length - 1].valor_diario + ' min' : metricasActivity[0].valor_diario + ' min') : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 btn bg-transparent border-0" onClick={() => toggleMenu('analysis')}>
                                                <div className="card border-0" style={buttonStyle('analysis')}>
                                                    <div className="card-header d-flex justify-content-between" >
                                                        <div className="p-2">
                                                            Analisis de Orina<i className="fa-solid fa-droplet mx-2 p-1"></i>
                                                        </div>
                                                        <AnalysisButton />
                                                    </div>
                                                    <div className="card-body">
                                                        Ultimo analisis:
                                                        <br></br>
                                                        {analysis[0] != null ? (analysis.length > 0 ? formatDateTime(analysis[analysis.length - 1].ts_init) : formatDateTime(analysis[0].ts_init)) : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 btn bg-transparent border-0" onClick={() => toggleMenu('temperature')}>
                                                <div className="card border-0" style={buttonStyle('temperature')}>
                                                    <div className="card-header d-flex justify-content-between">
                                                        <div className="p-2">
                                                            Temperatura<i className="fa-solid fa-temperature-full mx-2 p-1"></i>
                                                        </div>
                                                        <TemperatureButton />
                                                    </div>
                                                    <div className="card-body">
                                                        {metricasTemperature[0] != null ? (metricasTemperature.length > 0 ? metricasTemperature[metricasTemperature.length - 1].valor_diario + ' ºC' : metricasTemperature[0].valor_diario + ' ºC') : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 btn bg-transparent border-0" onClick={() => toggleMenu('heartrate')}>
                                                <div className="card border-0" style={buttonStyle('heartrate')}>
                                                    <div className="card-header d-flex justify-content-between">
                                                        <div className="p-2">
                                                            Pulso<i className="fa-solid fa-heart mx-2 p-1"></i>
                                                        </div>
                                                        <HeartRateButton />
                                                    </div>
                                                    <div className="card-body">
                                                        {metricasHeartRate[0] != null ? (metricasHeartRate.length > 0 ? metricasHeartRate[metricasHeartRate.length - 1].valor_diario + ' bpm' : metricasHeartRate[0].valor_diario + ' bpm') : ''}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 btn bg-transparent border-0" onClick={() => toggleMenu('incident')}>
                                                <div className="card border-0" style={buttonStyle('incident')}>
                                                    <div className="card-header d-flex justify-content-between">
                                                        <div className="p-2">
                                                            Incidencias<i className="fa-solid fa-triangle-exclamation mx-2 p-1"></i>
                                                        </div>
                                                        <IncidenciasButton />
                                                    </div>
                                                    <div className="card-body">
                                                        {store.incidencias.length}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="food">
                                        <Food />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="medicine">
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="appoiment">
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="result">
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </div>
                        <div className="col-md-2">
                            <div className="card border-0" style={{ borderRadius: "12px" }}>
                                <table className="table table-striped" >
                                    <thead style={{ color: "secondary" }}>
                                        <tr className="text-center">
                                            <th scope="col-md-4">Usuarios Compartidos</th>
                                            <th scope="col-md-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {store.mascotUsers.map((item, index) => (
                                            <tr key={index} className="text-center">
                                                <td>{item != null ? item.username : '-'}</td>
                                                <td>
                                                    <button type="button" className="btn border-0 bg-transparent p-0" onClick={(event) => handleShareDelete(event, item.id)}>
                                                        <i className="fa-solid fa-trash-can text-danger"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <footer className="w-100 bg-white border-top shadow-sm" style={{ position: "fixed", bottom: 0, left: 0, zIndex: 9999, height: "70px" }}>
                            <Nav className="d-flex justify-content-around align-items-center h-100">
                                <Nav.Item>
                                    <Nav.Link eventKey="overview" onClick={() => { setActiveKeyDetail("overview") }} className="text-center" style={{ color: "#1B365D" }}>
                                        <i className="fa-solid fa-house fa-lg"></i>
                                        <div style={{ fontSize: "12px" }}>Home</div>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="food" onClick={() => { setActiveKeyDetail("food"); toggleMenu("food"); }} className="text-center" style={{ color: "#1B365D" }}>
                                        <i className="fa-solid fa-bowl-food fa-lg"></i>
                                        <div style={{ fontSize: "12px" }}>Food</div>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link disabled className="text-center" style={{ color: "#999" }}>
                                        <i className="fa-solid fa-prescription-bottle-medical fa-lg"></i>
                                        <div style={{ fontSize: "12px" }}>Medicine</div>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link disabled className="text-center" style={{ color: "#999" }}>
                                        <i className="fa-solid fa-calendar-check fa-lg"></i>
                                        <div style={{ fontSize: "12px" }}>Appointments</div>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link disabled className="text-center" style={{ color: "#999" }}>
                                        <i className="fa-solid fa-chart-line fa-lg"></i>
                                        <div style={{ fontSize: "12px" }}>Results</div>
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </footer>

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
                    {activeMenu === 'food' && (
                        <div></div>
                    )}
                </div>
                :
                <div></div>
            }
        </section>
    );
}
