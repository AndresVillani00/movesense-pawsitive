import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const Events = () => {
  const { store, actions } = useContext(Context);
  const [currentPage, setCurrentPage] = useState(1); 
  const [eventsPerPage] = useState(4);

  const events = Object.values(store.events);

  
  const indexOfLastevents = currentPage * eventsPerPage;
  const indexOfFirstevents = indexOfLastevents - eventsPerPage;
  const currentevents = events.slice(indexOfFirstevents, indexOfLastevents);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Ir a la página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Ir a la página siguiente
  const goToNextPage = () => {
    if (currentPage < Math.ceil(events.length / eventsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };


  return (
    <div className="container mt-5">
      {/* Sección destacada */}
      <div className="row mb-4 p-4 rounded shadow-lg" style={{ background: "linear-gradient(135deg, #1E3A5F, #4A69BB, #8FAADC)", color: "white" }}>
        <div className="col-md-6">
          <img src="https://i.imgur.com/mC016Ss.png" className="img-fluid rounded" alt="Destacado" />
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2>El impacto del arte en la sociedad moderna</h2>
          <p>Descubre cómo el arte sigue inspirando, educando y transformando nuestras vidas en la era digital.</p>
          <Link to={`/event-details/${events.id}`} className="text-decoration-none"><button className="btn btn-light text-dark mt-3">Leer más</button></Link>
        </div>
      </div>

      {/* Lista de publicaciones */}
      <h3 className="text-center mb-4">Últimos eventos</h3>
      <div className="row">
        {currentevents.map((events) => (
          <div key={events.id} className="col-md-6 mb-4">
            <div className="card border-0 shadow-lg">
              <img src={events.image_url || "https://i.imgur.com/yPRhTpS.png"} className="card-img-top" alt={events.title} />
              <div className="card-body">
                <h5 className="card-title">{events.title}</h5>
                <p className="card-text">{events.body_content}</p>
                <p className="text-muted">Por <strong>@{ store.artists.filter(seller => seller.id === events.user_id)[0].username || "artlover" }</strong></p>
                <Link to={`/event-detail/${events.id}`} className="text-decoration-none"> <button className="btn btn-primary">Leer más</button></Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          {/* Botón "Anterior" */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <a
              className="page-link"
              href="#"
              aria-label="Previous"
              onClick={goToPreviousPage}
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>

          {/* Botones de páginas */}
          {[...Array(Math.ceil(events.length / eventsPerPage)).keys()].map((number) => (
            <li
              key={number + 1}
              className={`page-item ${currentPage === number + 1 ? "active" : ""}`}
            >
              <a
                className="page-link"
                href="#"
                onClick={() => paginate(number + 1)}
              >
                {number + 1}
              </a>
            </li>
          ))}

          {/* Botón "Siguiente" */}
          <li className={`page-item ${currentPage === Math.ceil(events.length / eventsPerPage) ? "disabled" : ""}`}>
            <a
              className="page-link"
              href="#"
              aria-label="Next"
              onClick={goToNextPage}
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};