import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import logo from '../../img/LogoPawsitive.png';
import { jsPDF } from "jspdf";

export const ReportButton = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  
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

  const generateAIReport = async () => {
    setLoading(true);

    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const ddsemana = String(date.getDate()-7).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
  
    const now = `${yyyy}${mm}${dd}${hh}${min}00`;
    const oneWeekBefore = `${yyyy}${mm}${ddsemana}${hh}${min}00`;

    const prompt = "Actua como un experto veterinario, Interpreta, analiza y realiza un reporte sobre si es bueno o malo cada uno de los datos del json creado sobre mi mascota, devuelveme un json igual pero con los reportes para cada parte, agregando el de accion y el de acciones a futuro";
    await actions.generarJsonEntrada(store.idParam, oneWeekBefore, now);

    if(store.JSONEntrada != null){
      try {
        await actions.reportOpenAI(prompt, store.JSONEntrada);
      } catch (e) {
        store.alert = { text: "Error generando el reporte", background: "danger", visible: true };
      } finally {
        setLoading(false);
        navigate('/report')
      }
    }
  };

  return (
    <div className="card-footer" style={{ background: "#ffffffff" }}>
      <div className="d-flex justify-content-between">
        <button className="btn fw-bold" onClick={() => generateAIReport()} disabled={loading} style={{ color: "white", background:"#ff6100", border: "#ff6100", borderRadius: "8px", padding: "8px 16px"}}>
          {loading ? 
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Generando ...</span>
            </div> : "Reporte de Salud"}
        </button>
      </div>
    </div>
  );
}
