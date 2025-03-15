import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";

export const PostProduct = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");


  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const result = await actions.uploadImage(file)
      if (!result) {
        setError("Error al subir la imagen");
        return;
      }
      setImageUrl(result);
      console.log("componente: result", result)
      console.log("imageUrl: ", imageUrl)
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }

  };

  const removeImage = () => {
    setPreview("");
    setImageFile(null);
    setImageUrl(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validaciones
    if (!name || !imageUrl || !price || !description || !category) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setError("");

    const dataToSend = {
      name,
      image_url: imageUrl, 
      price,
      description,
      category
    };
    console.log("dataTSend: ", dataToSend)
    await actions.postProduct(dataToSend);
    navigate("/sales");
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <section className="hero text-center text-white d-flex align-items-center justify-content-center w-100" style={{ background: "#1E1E50", height: "300px" }}>
        <div>
          <h1 className="fw-bold">Publicar un producto</h1>
          <p className="fs-5">Comparte tu arte con miles de entusiastas</p>
        </div>
      </section>

      <div className="container my-5 p-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm p-4 rounded-4 p-5" style={{ backgroundColor: "#f8f9fa" }}>
              <h2 className="text-center mb-4 fw-bold text-primary">Detalles del Producto</h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-12 text-center">
                  <div className="image-upload-container d-flex flex-column align-items-center p-3 border rounded-3" style={{ borderColor: "#1E1E50", borderStyle: "dashed" }}>
                    {preview ? (
                      <>
                        <img src={preview} alt="Vista previa" className="img-fluid rounded mb-2" style={{ width: "350px", height: "350px", objectFit: "cover" }} />
                        <button type="button" className="btn btn-danger mt-2" onClick={removeImage}>Quitar Imagen</button>
                      </>
                    ) : (
                      <p className="text-muted">No hay imagen seleccionada</p>
                    )}
                  </div>
                </div>

                <div className="col-md-8 mt-5">
                  <label className="form-label fw-semibold">Nombre del producto</label>
                  <input type="text" className="form-control" placeholder="Ej. Pintura Abstracta" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="col-md-4 mt-5">
                  <label className="form-label fw-semibold">Precio</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input type="number" className="form-control" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
                  </div>
                </div>

                <div className="col-md-12 mt-3">
                  <label className="form-label fw-semibold">Categoría</label>
                  <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Selecciona una categoría</option>
                    <option value="pintura">Pintura</option>
                    <option value="ropa">Ropa</option>
                    <option value="ilustracion digital">Ilustración Digital</option>
                  </select>
                </div>

                <div className="col-12 mt-3">
                  <label className="form-label fw-semibold">Descripción</label>
                  <textarea className="form-control" rows="4" placeholder="Describe las características de tu producto, como el estilo, materiales utilizados, dimensiones, etc." value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                </div>

                <div className="col-12 d-flex justify-content-center gap-3 mt-3">
                  <button type="submit" className="btn btn-primary fw-bold px-4">Publicar</button>
                  <button type="button" className="btn btn-secondary fw-bold px-4">Cancelar</button>
                  <div>
                    <input type="file" accept="image/*" className="form-control d-none" id="fileInput" onChange={handleImageChange} />
                    <label htmlFor="fileInput" className="btn btn-outline-primary mt-2"><i className="fas fa-cloud-upload-alt"></i> Subir Una Imagen</label>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
