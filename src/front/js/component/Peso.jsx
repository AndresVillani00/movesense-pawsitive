import React, { useState, useContext } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Context } from "../store/appContext";

export const Peso = () => {
    const { store, actions } = useContext(Context);

    const [daysRange, setDaysRange] = useState(5);
    const [itemCheck, setItemCheck] = useState([]);
    
    const metricasWeight = store.metricas != null ? store.metricas.filter(metricas => metricas.tipo_metrica_id === 'weight' && metricas.mascota_metrica_id === store.idParam) : null;

    const filteredData = [...metricasWeight].sort(
        (a, b) => new Date(a.ts_init) - new Date(b.ts_init)
    );

    const values = filteredData.map(d => d.valor_diario);
    const min = Math.floor(Math.min(...values) / 5) * 5;
    const max = Math.ceil(Math.max(...values) / 5) * 5;

    const ticks = [];
    for (let i = min; i <= max; i += 5) {
        ticks.push(i);
    }

    const toggleChecks = (id) => {
        if (itemCheck.includes(id)) {
        setItemCheck(itemCheck.filter((sid) => sid !== id));
        } else {
        setItemCheck([...itemCheck, id]);
        }
    };
    
    const formatDateTime = (value) => {
        if (!value) return null;
            
        const date = new Date(value);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const ss = '00'; // datetime-local no incluye segundos
    
        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    }

    const handleDelete = async (event) => {
        event.preventDefault();

        for(var i = 0; i < itemCheck.length; i++){
            actions.deleteMetrica(itemCheck[i]);
        }

        setItemCheck([]); // Limpiar selección
    };

    return (
        <section className="col-md-12 p-5">
            <h3>Historico del Peso</h3>
            <br></br>
            <div className="card p-2 border-0" style={{ borderRadius: "12px" }}>
                <div className="d-flex justify-content-end p-2">
                    <button className="btn btn-outline-danger" onClick={(event) => handleDelete(event)} hidden={itemCheck.length === 0}>Eliminar</button>
                </div>
                <div className="card p-4">
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={filteredData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ts_init" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                            <YAxis unit="kg" domain={['auto', 'auto']} ticks={ticks} tickFormatter={(v) => `${v}`} />
                            <Tooltip formatter={(v) => `${v} kg`} />
                            <Line
                                type="monotone"
                                dataKey="valor_diario"
                                stroke="#00b3b3"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-3 d-flex gap-2 justify-content-end">
                        {[1, 5, 30, 90].map((d) => (
                            <button
                                key={d}
                                className={`btn btn-sm ${daysRange === d ? "btn-primary" : "btn-outline-secondary"}`}
                                onClick={() => setDaysRange(d)}
                            >
                                {d}d
                            </button>
                        ))}
                    </div>
                </div>
                <table className="table table-striped" >
                    <thead style={{ color: "secondary" }}>
                        <tr className="text-center">
                            <th scope="col-md-2"></th>
                            <th scope="col-md-2">Fecha</th>
                            <th scope="col-md-2">Peso</th>
                            <th scope="col-md-2">Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metricasWeight.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td>
                                    <input
                                    type="checkbox"
                                    checked={itemCheck.includes(item.id)}
                                    onChange={() => toggleChecks(item.id)}
                                    />
                                </td>
                                <td>{item.ts_init != null ? formatDateTime(item.ts_init) : '-'}</td>
                                <td>{item.valor_diario != null ? item.valor_diario + " kg" : '-'}</td>
                                <td>{item.note != null ? item.note : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};