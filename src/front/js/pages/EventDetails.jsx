import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../store/appContext";

export const EventDetail = () => {
  const { store } = useContext(Context);
  const { id } = useParams();
  const navigate = useNavigate();
  const [ username, setUsername ] = useState({});
  const [ event, setEvent ] = useState({});

  useEffect(() => {
          const foundEvent = store.events.find(p => p.id === Number(id)); 
          setEvent(foundEvent);
      }, [id, store.events]);

  return (
    <div className="container mt-5 p-4 shadow-lg rounded" style={{ maxWidth: "800px", backgroundColor: "#f8f9fa" }}>
      <img src={event.image_url || "https://i.imgur.com/yPRhTpS.png"} className="img-fluid rounded mb-3" alt={event.title} />
      <h2 className="text-primary">{event.title}</h2>
      <p className="text-muted">Por <strong>@{"artlover"}</strong></p>
      <p className="mt-3" style={{ textAlign: "justify" }}>{event.body_content}</p>
      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        Volver
      </button>
    </div>
  );
};