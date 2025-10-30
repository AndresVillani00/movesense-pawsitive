import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import logo from '../../img/LogoPawsitive.png';

export const Report = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const report = store.reportes != null ? store.reportes.filter(reporte => reporte.mascota_reports_id === store.idMascotaReporte) : null;

    const sendReport = (event) => {
        event.preventDefault();

        const dataToSend = {
            score: store.reportAI.results.Score,
            description_ia: store.reportAI.results.Descripcion,
            food_ia: store.reportAI.results.Comida,
            action_ia: store.reportAI.results.Accion,
            future_ia: store.reportAI.results.Futuro,
            analysis_ia: store.reportAI.results.Analisis,
            mascota_reports_id: store.idParam
        }

        actions.postReport(dataToSend);
        navigate(-1)
    }

    const handleRead = (event, id) => {
        event.preventDefault();
        
        const dataToSend = { status_read: 'leido' }
        actions.putReadReport(dataToSend, id);
        navigate(-1)
    }

    return (
        <section className="container-fluid p-5">
            {store.isLogged && !store.isVeterinario ?
                <div className="container py-4" style={{ backgroundColor: "#F5EFDE", minHeight: "100vh" }}>
                    <div className="d-flex align-items-center mb-4">
                        <img src={logo} alt="Logo" style={{ height: "60px", marginRight: "15px" }} />
                        <h2 style={{ color: "#1B365D", fontWeight: "bold" }}>Pawsitive Health Quality Report</h2>
                    </div>

                    <div className="p-3 mb-4 rounded shadow-sm" style={{ backgroundColor: "white", borderLeft: "6px solid #1B365D" }}>
                        <h5 style={{ color: "#1B365D" }}>Overall Health Score: {store.reportAI.results.Score}/10</h5>
                        <p>This report covers the last 30 days of your pet's health data</p>
                    </div>

                    <div className="p-3 mb-4 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                        <h5 style={{ color: "#1B365D" }}>Patterns Detected</h5>
                        <p>{store.reportAI.results.Descripcion}</p>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-6 mb-3">
                            <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                                <h5 style={{ color: "#1B365D" }}>Urine Analysis</h5>
                                <p>{store.reportAI.results.Analisis}</p>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                                <h5 style={{ color: "#1B365D" }}>Food Analysis</h5>
                                <p>{store.reportAI.results.Comida}</p>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                            <h5 style={{ color: "#1B365D" }}>Action Plan</h5>
                            <p>{store.reportAI.results.Accion}</p>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                            <h5 style={{ color: "#1B365D" }}>Future Plan</h5>
                            <p>{store.reportAI.results.Futuro}</p>
                        </div>
                    </div>

                    <div className="p-5 text-center">
                        <button className="btn fw-bold" onClick={event => sendReport(event)} style={{ color: "white", background:"#ff6100", border: "#ff6100", borderRadius: "30px", padding: "10px 20px"}}>
                            Share with Veterinarian
                        </button>
                    </div>
                </div>
            :
            <div className="container" style={{ backgroundColor: "#F5EFDE", minHeight: "100vh" }}>
                {store.isLogged ?
                    <div className="py-4">
                        <div className="py-4">
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Volver</button>
                                <button className="btn btn-outline-secondary" onClick={(event) => handleRead(event, report[report.length - 1].id)}>Mark as Read</button>
                            </div>
                        </div>
                        <div className="d-flex align-items-center mb-4">
                            <img src={logo} alt="Logo" style={{ height: "60px", marginRight: "15px" }} />
                            <h2 style={{ color: "#1B365D", fontWeight: "bold" }}>Pawsitive Health Quality Report</h2>
                        </div>

                        <div className="p-3 mb-4 rounded shadow-sm" style={{ backgroundColor: "white", borderLeft: "6px solid #1B365D" }}>
                            <h5 style={{ color: "#1B365D" }}>Overall Health Score: {report[report.length - 1].score}/10</h5>
                            <p>This report covers the last 30 days of your pet's health data</p>
                        </div>

                        <div className="p-3 mb-4 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                            <h5 style={{ color: "#1B365D" }}>Patterns Detected</h5>
                            <p>{report[report.length - 1].description_ia}</p>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6 mb-3">
                                <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                                    <h5 style={{ color: "#1B365D" }}>Urine Analysis</h5>
                                    <p>{report[report.length - 1].analysis_ia}</p>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                                    <h5 style={{ color: "#1B365D" }}>Food Analysis</h5>
                                    <p>{report[report.length - 1].food_ia}</p>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                                <h5 style={{ color: "#1B365D" }}>Action Plan</h5>
                                <p>{report[report.length - 1].action_ia}</p>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                                <h5 style={{ color: "#1B365D" }}>Future Plan</h5>
                                <p>{report[report.length - 1].future_ia}</p>
                            </div>
                        </div>
                    </div>
                :
                    <div></div>
                }
            </div>
            }
        </section>
    );
}