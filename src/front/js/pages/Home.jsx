import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Home = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="bg-light" style={{ background: "#e9ecef" }}>

      {/* Sección de Categorías */}
      <section className="container py-5">
        <h2 className="text-center mb-4" style={{ color: "#1E1E50" }}>
          Mascotas
        </h2>
        <div className="row justify-content-center g-4">
          {[
            { name: "Mascota 1", img: "https://imgs.search.brave.com/XfFlpegBtPslbhbyzN9rm3VNV82Qe_cWmVi5RIf61rg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTIx/MDk3OTQ1L3Bob3Rv/L2hhcHB5LW9sZC1m/ZW1hbGUtZ29sZGVu/LXJldHJpZXZlci1p/c29sYXRlZC1vbi1h/LXdoaXRlLWJhY2tn/cm91bmQuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPWhNc0p3/RlZSeGlZTXlDMkh6/OHVfVHlQVFZCdHJP/akJMWWpVdmhvOFVD/M3M9" },
            { name: "Mascota 2", img: "https://imgs.search.brave.com/mAd6nWV1DXvMd5tWKbO6dnHfq16DUJKIegXKLf6ETOE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bWVpbmh1c2t5LmRl/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDEz/LzEyL0h1c2t5Lmpw/Zw" }
          ].map((category, index) => (
            <div key={index} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card border-0 shadow-sm h-100 bg-transparent">
                <img
                  src={category.img}
                  alt={category.name}
                  className="card-img-top rounded-circle"
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title" style={{ color: "#1E1E50" }}>
                    {category.name}
                  </h5>
                  <Link
                    to={'/mascota-profile'}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};