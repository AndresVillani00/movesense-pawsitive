import { Actions } from "@cloudinary/url-gen/index";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const NewBlogPost = () => {    
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [ title, setTitle ] = useState("");
    const [ date, setDate ] = useState("");
    const [ location, setLocation ] = useState("");
    const [ body_content, setBodyContent ] = useState("");
    const [comments, setComments] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSend = {
            title,
            date,
            location,
            body_content
        }

        actions.postEvent(dataToSend);
        navigate('/events')
    };

    const handleCommentChange = (blogId, e) => {
        setComments({ ...comments, [blogId]: e.target.value });
    };

    const handleCommentSubmit = (blogId) => {
        alert(`Comentario enviado en el blog ${blogId}: ${comments[blogId]}`);
        setComments({ ...comments, [blogId]: "" });
    };

    return (
        <div className="container py-5">
            <h1 className="text-center mb-4">Art Blogs</h1>

            {/* Formulario para agregar blogs */}
            <div className="card p-4 mb-4">
                <h3 className="mb-3">Publica un nuevo evento en nuestro Blog</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="title" placeholder="Título" onChange={(event) => setTitle(event.target.value)} value={title} className="form-control mb-2" required />
                    <div className="d-flex justify-content-between">
                        <div className="col-md-5">
                            <label className="form-label fw-semibold">Fecha del Evento</label>
                            <input type="date" name="date" class="form-control mb-4" onChange={(event) => setDate(event.target.value)} value={date}></input>
                        </div>
                        <div className="col-md-5">
                            <label className="form-label fw-semibold">Ubicacion del Evento</label>
                            <input type="text" name="location" class="form-control mb-4" onChange={(event) => setLocation(event.target.value)} value={location}></input>
                        </div>
                    </div>
                    <textarea name="content" placeholder="Descripcion del Evento" onChange={(event) => setBodyContent(event.target.value)} value={body_content} className="form-control mb-2" required></textarea>
                    <button type="submit" className="btn btn-primary">Publicar</button>
                </form>
            </div>

            {/* Lista de Blogs 
            <div className="row">
                {blogs.map((blog) => (
                    <div key={blog.id} className="col-md-4 mb-4">
                        <div className="card">
                            <img src={blog.image} className="card-img-top" alt={blog.title} />
                            <div className="card-body">
                                <h5 className="card-title">{blog.title}</h5>
                                <p className="text-muted">Categoría: {blog.category}</p>
                                <p className="card-text">{blog.content}</p>
                                <Link to={`/blog/${blog.id}`} className="btn btn-outline-dark">Leer más</Link>
                                
                                 Sección de Comentarios 
                                <div className="mt-3">
                                    <input type="text" placeholder="Escribe un comentario..." value={comments[blog.id] || ""} onChange={(e) => handleCommentChange(blog.id, e)} className="form-control" />
                                    <button className="btn btn-sm btn-secondary mt-2" onClick={() => handleCommentSubmit(blog.id)}>Comentar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            */}
        </div>
    );
};
