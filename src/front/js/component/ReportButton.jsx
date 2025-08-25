import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import logo from '../../img/LogoPawsitive.png';
import { jsPDF } from "jspdf";

export const ReportButton = ({ data }) => {
  const { store, actions } = useContext(Context);

  const lastIncidencia = store.incidencias != null ? store.incidencias.reduce((latest, item) => { return new Date(item.ts_alta) > new Date(latest.ts_alta) ? item : latest; }) : null;

  const sendReport = (event) => {
    event.preventDefault();

    const dataToSend = {
      score: store.currentMascota.score,
      description_ia: lastIncidencia.ia_desciption,
      food_ia: store.food.ia_food,
      action_ia: lastIncidencia.ia_action
    }

      actions.postReport(dataToSend);
  }

  const generatePDF = async () => {
    const doc = new jsPDF();

   // Colorear fondo del PDF
    doc.setFillColor(245, 239, 222); // #F5EFDE
    doc.rect(0, 0, 210, 297, "F");

    // Insertar logo
    const img = new Image();
    img.src = logo;
    await new Promise((resolve) => {
      img.onload = () => {
        doc.addImage(img, "PNG", 15, 20, 30, 30);
        resolve();
      };
    });

    // Título principal
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(27, 54, 93); // #1B365D
    doc.text("Health Quality Report", 55, 35);

    // Tarjeta de Overall Health Score
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(10, 60, 190, 20, 3, 3, "F");
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(27, 54, 93);
    doc.text(`Overall Health Score: ${data.score}/10`, 15, 68);
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("This report covers the last 30 days of your pet's health data", 15, 74);

    // Tarjeta Patterns
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(10, 90, 90, 30, 3, 3, "F");
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(27, 54, 93);
    doc.text("Patterns Detected", 15, 98);
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(data.description_ia, 15, 104, { maxWidth: 80 });

    // Tarjeta Food
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(110, 90, 90, 30, 3, 3, "F");
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(27, 54, 93);
    doc.text("Food Analysis", 115, 98);
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(data.food_ia, 115, 104, { maxWidth: 80 });

    // Tarjeta Action Plan
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(10, 130, 190, 25, 3, 3, "F");
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.setTextColor(27, 54, 93);
    doc.text("Action Plan", 15, 138);
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(data.action_ia, 15, 144, { maxWidth: 180 });

    // Abrir en nueva pestaña
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    doc.save(`Pawsitive-Health-Report-For-${store.currentMascota.name_mascot}.pdf`);
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="card-footer d-flex justify-content-between" style={{ background: "#ffffffff" }}>
      <Link to="/report">
        <button className="btn fw-bold" onClick={event => sendReport(event)} style={{ color: "white", background:"#ff6100", border: "#ff6100", borderRadius: "30px", padding: "10px 20px"}}>
          Health Report
        </button>
      </Link>
      <button className="btn fw-bold" onClick={generatePDF} style={{ color: "white", background:"#ff6100", border: "#ff6100", borderRadius: "30px", padding: "10px 20px"}}>
        PDF Report
      </button>
    </div>
  );
}
