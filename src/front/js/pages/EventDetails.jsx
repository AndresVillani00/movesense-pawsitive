import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../store/appContext";

export const EventDetail = () => {
  const { store } = useContext(Context);
  const { id } = useParams();
  const navigate = useNavigate();

  const blog = store.events?.find((b) => b.id === parseInt(id));

  if (!blog) {
    return (
      <div className="container mt-5 text-center">
        <h2>Blog no encontrado</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5 p-4 shadow-lg rounded" style={{ maxWidth: "800px", backgroundColor: "#f8f9fa" }}>
      <img src={blog.image_url || "https://i.imgur.com/yPRhTpS.png"} className="img-fluid rounded mb-3" alt={blog.title} />
      <h2 className="text-primary">{blog.title}</h2>
      <p className="text-muted">Por <strong>@{blog.user?.username || "artlover"}</strong></p>
      <p className="mt-3" style={{ textAlign: "justify" }}>{blog.body_content}</p>
      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        Volver
      </button>
    </div>
  );
};