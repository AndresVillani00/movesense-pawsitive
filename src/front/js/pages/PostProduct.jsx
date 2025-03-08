import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js";

export const PostProduct = () => {
  const { store, actions } = useContext(Context);

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataToSend = {
      name,
      image: imageUrl, 
      price,
      description,
      category
    };
    await actions.PostProduct(dataToSend);
  };

  return (
    <div>
      <section
        className="hero text-center text-white d-flex align-items-center justify-content-center"
        style={{
          background: "#1E1E50",
          height: "300px"
        }}
      >
        <div>
          <h1 className="fw-bold">Publicar un producto</h1>
          <p className="fs-5">Comparte tu arte con miles de entusiastas</p>
        </div>
      </section>

      {/* Contenedor principal con la tarjeta del formulario */}
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm p-4">
              <h2 className="text-center mb-4 fw-bold" style={{ color: "#1E1E50" }}>
                Detalles del Producto
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label fw-semibold">
                    Nombre del producto
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    placeholder="Ej. Pintura Abstracta"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>

                {/* URL de la imagen */}
                <div className="mb-3">
                  <label htmlFor="productImageUrl" className="form-label fw-semibold">
                    URL de la imagen
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productImageUrl"
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(event) => setImageUrl(event.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productPrice" className="form-label fw-semibold">
                    Precio
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      id="productPrice"
                      placeholder="0"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                    />
                    <span className="input-group-text">.00</span>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="productCategory" className="form-label fw-semibold">
                    Categoría
                  </label>
                  <select
                    className="form-select"
                    id="productCategory"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="Pintura">Pintura</option>
                    <option value="Ropa">Ropa</option>
                    <option value="Ilustración Digital">Ilustración Digital</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="productDescription" className="form-label fw-semibold">
                    Descripción
                  </label>
                  <textarea
                    className="form-control"
                    id="productDescription"
                    rows="4"
                    placeholder="Describe tu producto..."
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn btn-primary fw-bold">
                    Publicar
                  </button>
                  <button type="button" className="btn btn-secondary fw-bold">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
