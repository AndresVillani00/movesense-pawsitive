import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import logo from '../../img/LogoPawsitive.png';
import { jsPDF } from "jspdf";

export const ReportButton = ({ data }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const jsonDescription = store.currentMascota;
  const jsonAnalysis = store.analysis[0];
  const jsonFood = store.foods[0];

  const metricasActivity = store.metricas != null ? store.metricas.filter(metricas => metricas.tipo_metrica_id === 'activity' && metricas.mascota_metrica_id === store.idParam) : null;
  const metricasWeight = store.metricas != null ? store.metricas.filter(metricas => metricas.tipo_metrica_id === 'weight' && metricas.mascota_metrica_id === store.idParam) : null;
  const metricasTemperature = store.metricas != null ? store.metricas.filter(metricas => metricas.tipo_metrica_id === 'temperature' && metricas.mascota_metrica_id === store.idParam) : null;
  const metricasHeartRate = store.metricas != null ? store.metricas.filter(metricas => metricas.tipo_metrica_id === 'heart_rate' && metricas.mascota_metrica_id === store.idParam) : null;

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

    const prompt = "Actua como un experto veterinario, Interpreta, analiza y realiza un reporte sobre si es bueno o malo cada uno de los datos del json creado sobre mi mascota, devuelveme un json igual pero con los reportes para cada parte, agregando el de accion";
    const data = {
      'Descripcion de la Mascota': {
        //'Foto de la mascota en base64': jsonDescription.foto_mascot,
        'Raza de la mascota': jsonDescription.raza,
        'Campo en booleano si la mascota esta o no mezclada': jsonDescription.is_mix,
        'Genero de la mascota': jsonDescription.gender,
        'Campo en booleano si la mascota esta o no esterilizado': jsonDescription.is_Esterilizado,
        'Patologia de la mascota, si la tuviera': jsonDescription.patologia,
        'Metricas': {
          'Minutos de la ultima Actividad/Paseo de la mascota': metricasActivity[0].valor_diario,
          'Peso de la mascota': metricasWeight[0].valor_diario,
          'Temperatura de la mascota': metricasTemperature[0].valor_diario,
          'Heart Rate de la mascota': metricasHeartRate[0].valor_diario,
        }
      },
      'Analisis Orina': {
        'Foto del analisis de orina en base64': jsonAnalysis.foto_analysis,
        /*'Sangre en Analisis': jsonAnalysis.blood,
        'Bilirubina en Analisis': jsonAnalysis.bilirubin,
        'Urobilinogeno Analisis': jsonAnalysis.urobiling,
        'Cetonas en Analisis': jsonAnalysis.ketones,
        'Glucosa en Analisis': jsonAnalysis.glucose,
        'Proteina en Analisis': jsonAnalysis.protein,
        'Nitritoen Analisis': jsonAnalysis.nitrite,
        'Leucocitos en Analisis': jsonAnalysis.leukocytes,
        'PH en Analisis': jsonAnalysis.ph,*/
      },
      'Comida': {
        'Foto de la comida en base64': jsonFood.foto_food,
        'Titulo de contexto de la comida': jsonFood.title,
        'Marca de la comida': jsonFood.marca,
        'Tipo de la comida': jsonFood.type_food,
        'Cantidad de la comida': jsonFood.quantity,
        'Fibra, proteina y grasa por porcentajes': {
          'Fibra': jsonFood.fibra,
          'Proteina': jsonFood.proteina,
          'Grasa': jsonFood.grasa
        }
      }
    };

    try {
      await actions.reportOpenAI(prompt, data);
    } catch (e) {
      store.alert = { text: "Error generating the report", background: "danger", visible: true };
    } finally {
      setLoading(false);
      navigate('/report')
    }
  };

  return (
    <div className="card-footer" style={{ background: "#ffffffff" }}>
      <div className="d-flex justify-content-between">
        <button className="btn fw-bold" onClick={() => generateAIReport()} disabled={loading} style={{ color: "white", background:"#ff6100", border: "#ff6100", borderRadius: "8px", padding: "8px 16px"}}>
          {loading ? "Generating..." : "Health Report"}
        </button>
        <button className="btn fw-bold" onClick={generatePDF} style={{ color: "white", background:"#ff6100", border: "#ff6100", borderRadius: "8px", padding: "8px 16px"}}>
          PDF Report
        </button>
      </div>
    </div>
  );
}
