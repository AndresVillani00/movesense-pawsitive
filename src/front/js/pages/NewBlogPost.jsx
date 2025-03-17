import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

export const NewBlogPost = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [preview, setPreview] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const result = await actions.uploadImage(file); 
      if (!result) {
        setModalMessage("Error al subir la imagen.");
        setShowModal(true);
        return;
      }
      setImageUrl(result); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview("");
    setImageUrl(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      title,
      date,
      location,
      body_content: bodyContent,
      image_url: imageUrl || "", 
    };

    actions.postEvent(dataToSend); 
    navigate("/events"); 
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="p-4 bg-light rounded">
            {/* Header */}
            <div className="text-center my-4">
              <h1 className="fw-bold text-dark">Publica un nuevo evento</h1>
              <p className="text-muted">Comparte información sobre eventos artísticos con la comunidad.</p>
            </div>

            {/* Formulario */}
            <div className="card p-4 mb-4">
              {/* Campo para subir una imagen */}
              <div className="text-center mb-4">
                <div className="image-upload-container d-flex flex-column align-items-center p-3 border rounded-3" style={{ borderColor: "#1E1E50", borderStyle: "dashed" }}>
                  {preview ? (
                    <>
                      <img src={preview} alt="Vista previa" className="img-fluid rounded mb-2" style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} />
                      <button type="button" className="btn btn-danger mt-2" onClick={removeImage}>Quitar Imagen</button>
                    </>
                  ) : (
                    <p className="text-muted">No hay imagen seleccionada</p>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control mt-2"
                  onChange={handleImageChange}
                />
              </div>

              <form onSubmit={handleSubmit}>
                {/* Campo para el título */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Título del evento</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej. Exposición de Arte Moderno"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Campos para fecha y ubicación */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Fecha del evento</label>
                    <input
                      type="date"
                      className="form-control"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Ubicación del evento</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ej. Museo de Arte Contemporáneo"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Campo para la descripción */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Descripción del evento</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Describe el evento, incluyendo detalles importantes como horarios, artistas participantes, etc."
                    value={bodyContent}
                    onChange={(e) => setBodyContent(e.target.value)}
                    required
                  />
                </div>

                {/* Botón para publicar */}
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary fw-bold px-4">Publicar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para errores */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#1E1E50", color: "#fff" }}>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};