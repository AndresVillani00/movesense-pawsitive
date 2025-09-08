import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import logo from '../../img/LogoPawsitive.png';

export const Report = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const sendReport = (event) => {
        event.preventDefault();

        const dataToSend = {
            score: 10,
            description_ia: 'lastIncidencia.ia_desciption',
            food_ia: 'store.food.ia_food',
            action_ia: 'lastIncidencia.ia_action',
            analysis_ia: 'lastAnalysis.ia_analysis',
            mascota_reports_id: store.idParam
        }

        actions.postReport(dataToSend);
        navigate('/home')
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
                        <h5 style={{ color: "#1B365D" }}>Overall Health Score: {store.report.score}/10</h5>
                        <p>This report covers the last 30 days of your pet's health data</p>
                    </div>

                    <div className="p-3 mb-4 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                        <h5 style={{ color: "#1B365D" }}>Patterns Detected</h5>
                        <p>{store.report.description_ia}</p>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-6 mb-3">
                            <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                                <h5 style={{ color: "#1B365D" }}>Urine Analysis</h5>
                                <p>{store.report.analysis_ia}</p>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                                <h5 style={{ color: "#1B365D" }}>Food Analysis</h5>
                                <p>{store.report.food_ia}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                        <h5 style={{ color: "#1B365D" }}>Action Plan</h5>
                        <p>{store.report.action_ia}</p>
                    </div>
                    <div className="p-5 text-center">
                        <button className="btn fw-bold" onClick={event => sendReport(event)} style={{ color: "white", background:"#ff6100", border: "#ff6100", borderRadius: "30px", padding: "10px 20px"}}>
                            Share with Veterinarian
                        </button>
                    </div>
                </div>
            :
                <div className="container py-4" style={{ backgroundColor: "#F5EFDE", minHeight: "100vh" }}>
                    <div className="d-flex align-items-center mb-4">
                        <img src={logo} alt="Logo" style={{ height: "60px", marginRight: "15px" }} />
                        <h2 style={{ color: "#1B365D", fontWeight: "bold" }}>Pawsitive Health Quality Report</h2>
                    </div>

                    <div className="p-3 mb-4 rounded shadow-sm" style={{ backgroundColor: "white", borderLeft: "6px solid #1B365D" }}>
                        <h5 style={{ color: "#1B365D" }}>Overall Health Score: {store.report.score}/10</h5>
                        <p>This report covers the last 30 days of your pet's health data</p>
                    </div>

                    <div className="p-3 mb-4 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                        <h5 style={{ color: "#1B365D" }}>Patterns Detected</h5>
                        <p>{store.report.description_ia}</p>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-6 mb-3">
                            <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                                <h5 style={{ color: "#1B365D" }}>Urine Analysis</h5>
                                <p>{store.report.analysis_ia}</p>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                                <h5 style={{ color: "#1B365D" }}>Food Analysis</h5>
                                <p>{store.report.food_ia}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 rounded shadow-sm" style={{ backgroundColor: "white" }}>
                        <h5 style={{ color: "#1B365D" }}>Action Plan</h5>
                        <p>{store.report.action_ia}</p>
                    </div>
                </div>
            }
        </section>
    );
}