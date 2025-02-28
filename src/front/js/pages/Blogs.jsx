import React from "react";


export const Blog = () => {
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
          <button className="btn btn-light text-dark mt-3">Leer más</button>
        </div>
      </div>

      {/* Lista de publicaciones */}
      <h3 className="text-center mb-4">Últimos Blogs</h3>
      <div className="row">
        {[1, 2 , 3 , 4 , 5 , 6].map((index) => (
          <div key={index} className="col-md-6 mb-4">
            <div className="card border-0 shadow-lg">
              <img src="https://i.imgur.com/yPRhTpS.png" className="card-img-top" alt="Blog" />
              <div className="card-body">
                <h5 className="card-title">Explorando el arte contemporáneo</h5>
                <p className="card-text">Una mirada profunda a las tendencias artísticas actuales y sus principales exponentes.</p>
                <p className="text-muted">Por <strong>@artlover</strong></p>
                <button className="btn btn-primary">Leer más</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


