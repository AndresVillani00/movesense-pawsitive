import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";
import { useNavigate } from "react-router-dom";

export const PostProduct = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  
  const [name, setName] = useState("");
  const [preview, setPreview] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataToSend = {
      name,
      image: preview,
      price,
      description,
      category
    };
    await actions.postProduct(dataToSend);
    navigate('/product')
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
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-12 text-center">
                  <div className="image-upload-container d-flex flex-column align-items-center p-3 border rounded-3" style={{ borderColor: "#1E1E50", borderStyle: "dashed" }}>
                    {preview ? (
                      <img src={preview} alt="Vista previa" className="img-fluid rounded mb-2" style={{ width: "350px", height: "350px", objectFit: "cover" }} />
                    ) : (
                      <p className="text-muted">No hay imagen seleccionada</p>
                    )}
                  </div>
                </div>

                <div className="col-md-8 mt-5">
                  <label className="form-label fw-semibold">Nombre del producto</label>
                  <input type="text" className="form-control" placeholder="Ej. Pintura Abstracta" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="rpw col-md-4 mt-5">
                  <label className="form-label fw-semibold">Precio</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input type="number" className="form-control" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                </div>

                <div className="col-md-12 mt-3">
                  <label className="form-label fw-semibold">Categoría</label>
                  <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Selecciona una categoría</option>
                    <option value="pintura">Pintura</option>
                    <option value="ropa">Ropa</option>
                    <option value="ilustración Digital">Ilustración Digital</option>
                    <option value="pintura">Pintura</option>
                    <option value="ropa">Ropa</option>
                    <option value="ilustración Digital">Ilustración Digital</option>
                  </select>
                </div>

                <div className="col-12 mt-3">
                  <label className="form-label fw-semibold">Descripción</label>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    placeholder="Describe las características de tu producto, como el estilo, materiales utilizados, dimensiones, etc." 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="col-12 d-flex justify-content-center gap-3 mt-3">
                  <button type="submit" className="btn btn-primary fw-bold px-4">Publicar</button>
                  <button type="button" className="btn btn-secondary fw-bold px-4">Cancelar</button>
                  <div><input type="file" accept="image/*" className="form-control d-none" id="fileInput" onChange={handleImageChange} />
                  <label htmlFor="fileInput" className="btn btn-outline-primary mt-2"> <i className="fas fa-cloud-upload-alt"></i> Subir Una Imagen</label></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
