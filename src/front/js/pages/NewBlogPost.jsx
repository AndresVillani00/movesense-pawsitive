import React, { useState } from "react";
import { Link } from "react-router-dom";

export const NewBlogPost = () => {
    const [blogs, setBlogs] = useState([
        { id: 1, title: "Exploring Modern Art", category: "Pintura", content: "An in-depth look at contemporary painting techniques.", image: "https://via.placeholder.com/300" },
        { id: 2, title: "Sculpting Wonders", category: "Escultura", content: "The beauty of sculptures throughout history.", image: "https://via.placeholder.com/300" },
        { id: 3, title: "Fashion & Art", category: "Ropa", content: "How fashion intersects with artistic expression.", image: "https://via.placeholder.com/300" }
    ]);
    
    const [newBlog, setNewBlog] = useState({ title: "", category: "Pintura", content: "" });
    const [comments, setComments] = useState({});

    const handleInputChange = (e) => {
        setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setBlogs([...blogs, { id: blogs.length + 1, ...newBlog, image: "https://via.placeholder.com/300" }]);
        setNewBlog({ title: "", category: "Pintura", content: "" });
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
                <h3 className="mb-3">Escribe un nuevo blog</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="title" placeholder="Título" value={newBlog.title} onChange={handleInputChange} className="form-control mb-2" required />
                    <select name="category" value={newBlog.category} onChange={handleInputChange} className="form-control mb-2">
                        <option value="Ropa">Evento en tu ciudad</option>
                        <option value="Pintura">Pintura</option>
                        <option value="Escultura">Escultura</option>
                        <option value="Ropa">Ropa</option>
                    </select>
                    <textarea name="content" placeholder="Contenido" value={newBlog.content} onChange={handleInputChange} className="form-control mb-2" required></textarea>
                    <button type="submit" className="btn btn-primary">Publicar</button>
                </form>
            </div>

            {/* Lista de Blogs */}
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
                                
                                {/* Sección de Comentarios */}
                                <div className="mt-3">
                                    <input type="text" placeholder="Escribe un comentario..." value={comments[blog.id] || ""} onChange={(e) => handleCommentChange(blog.id, e)} className="form-control" />
                                    <button className="btn btn-sm btn-secondary mt-2" onClick={() => handleCommentSubmit(blog.id)}>Comentar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
