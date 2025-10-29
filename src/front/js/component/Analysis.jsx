import React, { useEffect, useState, useRef, useContext } from "react";
import { Context } from "../store/appContext";
import { Alert } from "./Alert.jsx";
import AnalisisFoto from '../../img/Analisis.jpeg';

export const Analysis = () => {
    const { store, actions } = useContext(Context);

    const [showModal, setShowModal] = useState(false);
    const [date, setDate] = useState('');
    const [itemCheck, setItemCheck] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [base64Analisis, setBase64] = useState('');
    const [blood, setBlood] = useState('');
    const [bilirubin, setBilirubin] = useState('');
    const [urobiling, setUrobiling] = useState('');
    const [ketones, setKetones] = useState('');
    const [glucose, setGlucose] = useState('');
    const [protein, setProtein] = useState('');
    const [nitrite, setNitrite] = useState('');
    const [leukocytes, setLeukocytes] = useState('');
    const [ph, setPh] = useState('');

    const modalRef = useRef(null);
    const bsModal = useRef(null);


    useEffect(() => {
        // Cargar modal de Bootstrap solo una vez
        if (modalRef.current) {
            bsModal.current = new window.bootstrap.Modal(modalRef.current, {
                backdrop: 'static',
                keyboard: false,
            });
        }
    }, []);

    useEffect(() => {
        if (bsModal.current) {
            showModal ? bsModal.current.show() : bsModal.current.hide();
        }
    }, [showModal]);

    const toggleChecks = (id) => {
        if (itemCheck.includes(id)) {
            setItemCheck(itemCheck.filter((sid) => sid !== id));
        } else {
            setItemCheck([...itemCheck, id]);
        }
    };

    const formatDateTime = (value) => {
        if (!value) return null;

        const date = new Date(value);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const ss = '00'; // datetime-local no incluye segundos

        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const startDate = formatDateTime(date);

        const dataToSend = {
            blood,
            bilirubin,
            urobiling,
            ketones,
            glucose,
            protein,
            nitrite,
            leukocytes,
            ph,
            foto_analysis: store.fotoJsonAnalysis != null ? store.fotoJsonAnalysis.foto : null,
            ts_init: startDate,
            mascota_analysis_id: store.idParam
        }
        await actions.postAnalysis(dataToSend);
        if (store.fotoJsonAnalysis != null) {
            setShowModal(false);
        }
    };

    const handleCapture = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            // Crear objeto Image a partir del archivo
            const image = await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = URL.createObjectURL(file);
            });

            // Crear canvas para comprimir
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // 🔧 Ajusta el tamaño máximo (reduce resolución)
            const maxWidth = 400;
            const maxHeight = 400;
            let width = image.width;
            let height = image.height;

            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Dibujar imagen comprimida en el canvas
            ctx.drawImage(image, 0, 0, width, height);

            // Convertir a base64 con calidad reducida
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.5); // 0.5 = 50% calidad

            // Guardar en tu store
            actions.setFotoJsonAnalysis({ foto: compressedBase64 });
        } catch (error) {
            console.error("Error al comprimir imagen:", error);
        }

        handleFile();
    };

    const handleFile = async () => {
        try {
            // 1. Cargar la imagen estática como blob
            const response = await fetch(AnalisisFoto);
            const blob = await response.blob();

            // 2. Crear objeto Image a partir del blob
            const img = new Image();
            img.src = URL.createObjectURL(blob);

            img.onload = () => {
                // 3. Crear canvas y calcular escala
                const maxWidth = 512; // ajusta según lo que necesites (400–800 recomendado)
                const maxHeight = 512;
                let { width, height } = img;

                const scale = Math.min(maxWidth / width, maxHeight / height, 1); // nunca agrandar
                width *= scale;
                height *= scale;

                // 4. Dibujar imagen en canvas
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                // 5. Obtener base64 comprimida (calidad 0.6 ≈ 60%)
                const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);

                // 6. Guardar en tu estado (ya comprimida)
                setBase64(compressedBase64);

                // 7. Liberar recursos
                URL.revokeObjectURL(img.src);
            };
        } catch (error) {
            console.error("Error convirtiendo imagen a base64:", error);
        }
    };

    const handleAnalisisIA = async (foto) => {
        setLoading(true);

        const prompt = "Actua como un experto veterinario, Interpreta, analiza y rellena los datos necesarios para un analises de orina en un perro comparando el AnalisisBase y el AnalisisEnviado el cual es el analisis que le realice a mi mascota";
        
        if(base64Analisis == null || foto == null) {
            store.alert = { text: "No se pudo analisar con IA el Analisis de orina", background: "danger", visible: true };
            setLoading(false);
        }

        const json = {
            "AnalisisBase": base64Analisis,
            "AnalisisEnviado": foto
        }

        try {
            await actions.analisisOpenAI(prompt, json);
            console.log(store.analisisAI)
        } catch (e) {
            store.alert = { text: `Error generando el analisis, Error: ${e}` , background: "danger", visible: true };
            setLoading(false);
        } finally {
            setLoading(false);
        }
    } 

    const handleDelete = async (event) => {
        event.preventDefault();

        for (var i = 0; i < itemCheck.length; i++) {
            actions.deleteAnalysis(itemCheck[i]);
        }

        setItemCheck([]); // Limpiar selección
    };

    const handleCancel = () => {
        setShowModal(false); 
        store.alert = { text: "", background: "primary", visible: false }
    }

    return (
        <section className="col-md-12 p-5">
            <h3>Historico de Analisis de Orina</h3>
            <br></br>
            <div className="card p-2 border-0" style={{ borderRadius: "12px" }}>
                <div className="d-flex justify-content-end p-2">
                    <div className="mx-3">
                        <button className="btn btn-outline-secondary" onClick={() => setShowModal(true)}>Introducir valor manualmente</button>
                    </div>
                    <button className="btn btn-outline-danger" onClick={(event) => handleDelete(event)} hidden={itemCheck.length === 0}>Eliminar</button>
                </div>
                <div className="modal fade" tabIndex="-1" ref={modalRef} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="container modal-content">
                            <div className="modal-header row">
                                <div className="d-flex justify-content-between">
                                    <h1 className="modal-title fs-4 col-md-8">Registrar Analisis</h1>
                                    <button type="button" className="btn-close col-md-4" data-bs-dismiss="modal" aria-label="Close" onClick={() => handleCancel()}></button>
                                </div>
                                <p className="col-md-12">Introduce los detalles del analisis de orina de tu mascota</p>
                                <Alert />
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit} className="row g-3">
                                    <div className="col-md-12">
                                        {store.fotoJsonAnalysis && (
                                            <div className="text-center p-2 mb-3">
                                                <img src={store.fotoJsonAnalysis.foto} alt="Captura" className="img-fluid rounded" style={{ maxWidth: '200px' }} />
                                            </div>
                                        )}
                                        <div className="text-center p-2 mb-3">
                                            <label htmlFor="selectFotoAnalysis" className="btn btn-primary" style={{ color: "white", background: "#ff6100", border: "#ff6100" }}>Introduce foto de Analisis</label>
                                            <input id="selectFotoAnalysis" type="file" accept="image/*" className="d-none" capture="environment" onChange={handleCapture} style={{ display: 'none' }} />
                                            <button className="btn btn-primary mx-2" type="button"
                                                onClick={() => handleAnalisisIA(store.fotoJsonAnalysis.foto)} 
                                                style={{ color: "white", background: "#ff6100", border: "#ff6100" }}>
                                                    {loading ? 
                                                        <div className="spinner-border" role="status">
                                                            <span className="visually-hidden">Generando ...</span>
                                                        </div> 
                                                    : "Analizar con IA"}</button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Sangre</label>
                                            <input type="text" name="blood" className="form-control" value={store.analisisAI != null ? store.analisisAI.blood : blood} onChange={(event) => setBlood(event.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Bilirubina</label>
                                            <input type="text" name="bilirubin" className="form-control" value={store.analisisAI != null ? store.analisisAI.bilirubin : bilirubin} onChange={(event) => setBilirubin(event.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Urobilinógeno</label>
                                            <input type="text" name="urobiling" className="form-control" value={store.analisisAI != null ? store.analisisAI.urobiling : urobiling} onChange={(event) => setUrobiling(event.target.value)} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Cetonas</label>
                                            <input type="text" name="ketones" className="form-control" value={store.analisisAI != null ? store.analisisAI.ketones : ketones} onChange={(event) => setKetones(event.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Glucosa</label>
                                            <input type="text" name="glucose" className="form-control" value={store.analisisAI != null ? store.analisisAI.glucose : glucose} onChange={(event) => setGlucose(event.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Proteina</label>
                                            <input type="text" name="protein" className="form-control" value={store.analisisAI != null ? store.analisisAI.protein : protein} onChange={(event) => setProtein(event.target.value)} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Nitritos</label>
                                            <input type="text" name="nitrite" className="form-control" value={store.analisisAI != null ? store.analisisAI.nitrite : nitrite} onChange={(event) => setNitrite(event.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">Leucocitos</label>
                                            <input type="text" name="leukocytes" className="form-control" value={store.analisisAI != null ? store.analisisAI.leukocytes : leukocytes} onChange={(event) => setLeukocytes(event.target.value)} />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label fw-semibold">PH</label>
                                            <input type="number" name="ph" className="form-control" value={store.analisisAI != null ? store.analisisAI.ph : ph} onChange={(event) => setPh(event.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Fecha de Alta</label>
                                        <input type="datetime-local" name="date" className="form-control" value={date} onChange={(event) => setDate(event.target.value)} required />
                                    </div>
                                    <div className="row my-3">
                                        <div className="d-flex justify-content-between">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                                                onClick={() => handleCancel()} style={{
                                                    borderRadius: "30px", padding: "10px 20px"
                                                }}>Cancelar</button>
                                            <button type="submit" className="btn btn-primary" style={{
                                                color: "white",
                                                background: "#ff6100",
                                                border: "#ff6100",
                                                borderRadius: "30px",
                                                padding: "10px 20px"
                                            }}>Enviar</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <table className="table table-striped" >
                    <thead style={{ color: "secondary" }}>
                        <tr className="text-center">
                            <th scope="col-md-2"></th>
                            <th scope="col-md-2">Sangre</th>
                            <th scope="col-md-2">Bilirubina</th>
                            <th scope="col-md-2">Urobilinógeno</th>
                            <th scope="col-md-2">Cetonas</th>
                            <th scope="col-md-2">Glucosa</th>
                            <th scope="col-md-2">Proteina</th>
                            <th scope="col-md-2">Nitritos</th>
                            <th scope="col-md-2">Leucocitos</th>
                            <th scope="col-md-2">PH</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.analysis.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={itemCheck.includes(item.id)}
                                        onChange={() => toggleChecks(item.id)}
                                    />
                                </td>
                                <td>{item.blood != null ? item.blood : '-'}</td>
                                <td>{item.bilirubin != null ? item.bilirubin : '-'}</td>
                                <td>{item.urobiling != null ? item.urobiling : '-'}</td>
                                <td>{item.ketones != null ? item.ketones : '-'}</td>
                                <td>{item.glucose != null ? item.glucose : '-'}</td>
                                <td>{item.protein != null ? item.protein : '-'}</td>
                                <td>{item.nitrite != null ? item.nitrite : '-'}</td>
                                <td>{item.leukocytes != null ? item.leukocytes : '-'}</td>
                                <td>{item.ph != null ? item.ph : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );

};