import React, { useContext, useState } from "react"; 
import { Context } from "../store/appContext.js"; 
import { useNavigate } from "react-router-dom"; 
import { Alert } from "./Alert.jsx";


export const SignUp = () => { 
    const { store, actions } = useContext(Context); 
    const navigate = useNavigate(); 

    const [username, setUsername] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [phone, setPhone] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [politica, isPolitica] = useState(false); 
    const [error, setError] = useState(false); 
    
    const handleSubmit = async (event) => { 
        event.preventDefault(); 
        const dataToSend = { username, email, password, phone, postalCode } 
        
        if(politica){
            await actions.signup(dataToSend); 
            if(store.isVeterinario){
                actions.setActiveKey('alerts')
            } else if(store.userMascotas.length < 1) {
                actions.setActiveKey('register')
            } else {
                actions.setActiveKey('existing')
            }

            if (store.isLogged && !store.isVeterinario) { 
                store.alert = { text: "", background: "primary", visible: false }; 
                navigate('/home'); 
            } 
        } else {
            store.alert = { text: "Es necesario aceptar la política de privacidad", background: "danger", visible: true };
        }
    } 
        
    const validatePassword = async (value) => { 
        const isValid = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; 
            
        if(!isValid.test(value)){ 
            setError(true) 
        } else{ 
            setError(false) 
        } 
        setPassword(value) 
    } 
            
    return ( 
        <div className="container-fluid"> 
            <div className="row"> 
                {/* Sección Izquierda - Formulario */} 
                <div className="col-md-12 d-flex flex-column justify-content-center align-items-center" style={{ fontFamily: "'Montserrat', sans-serif", background: "linear-gradient(135deg, #1B365D, #4A69BB, #F5EFDE)", minHeight: "100vh" }}> 
                    <div className="d-flex flex-column justify-content-center align-items-center text-white p-5 text-center"> 
                        <h1 className="fw-bold display-4" style={{ color: "#F5EFDE" }}>Unete a nuestra Comunidad</h1> 
                        <p className="fs-5 mt-3" style={{ color: "#F5EFDE" }}> Pawsitive, la plataforma de bienestar para tu mascota </p> 
                    </div> 
                    {/* Formulario */} 
                    <div className="card p-5 shadow-lg border-0" style={{ maxWidth: "600px", width: "100%", borderRadius: "12px" }}> 
                        <h3 className="text-center fw-bold mb-4" style={{ color: "#1B365D" }}>Registra tu Cuenta</h3> 
                        <Alert />
                        <form onSubmit={handleSubmit} className="row g-3"> 
                            {/* Campo Username */} 
                            <div className="col-12"> 
                                <label className="form-label fw-semibold">Username</label> 
                                <div className="input-group"> 
                                    <span className="input-group-text">@</span> 
                                    <input onChange={(event) => setUsername(event.target.value)} value={username} type="text" className="form-control" placeholder="Introduce un Usuario" required /> 
                                </div> 
                            </div> 
                            {/* Campo Email */} 
                            <div className="col-12"> 
                                <label className="form-label fw-semibold">Email</label> 
                                <input onChange={(event) => setEmail(event.target.value)} value={email} type="email" className="form-control" placeholder="name@ejemplo.com" required /> 
                            </div> 
                            {/* Campo Password */} 
                            <div className="col-12"> 
                                <label className="form-label fw-semibold">Contraseña</label> 
                                <div className="input-group"> 
                                    <input onChange={(event) => validatePassword(event.target.value)} value={password} type={showPassword ? "text" : "password"} className="form-control" placeholder="Introduce tu Contraseña" required /> 
                                    <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}> {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>} </span> 
                                </div> 
                            </div> 
                            <div className="col-md-12">
                                <label className="form-label fw-semibold">Whatsapp</label>
                                <input type="text" name="phone" className="form-control" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Introduce tu Número de telefono" />
                            </div>
                            <div className="col-md-12">
                                <label className="form-label fw-semibold">Codigo Postal</label>
                                <input type="text" name="postalcode" className="form-control" value={postalCode} onChange={(event) => setPostalCode(event.target.value)} placeholder="Introduce tu Codigo Postal" />
                            </div>
                                <a href="https://www.pawsitiveapp.es/politica-privacidad/">Política de privacidad</a>
                            <div className="col-md-12 mx-3 mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="is_politica" onChange={(event) => isPolitica(event.target.checked)} required />
                                <label className="form-check-label" htmlFor="is_politica">He leido y Acepto las condiciones de uso del servicio y la política de privacidad</label>
                            </div>
                            <div className="col-12 text-center"> 
                                <div className="d-flex justify-content-center gap-3"> 
                                    <button className="btn fw-bold" type="submit" style={{ color: "white", background:"#ff6100", border: "#ff6100", borderRadius: "30px", padding: "10px 20px" }}> Registrarse </button> 
                                </div> 
                            </div> 
                        </form> 
                    </div> 
                </div>
            </div> 
        </div> 
    ); 
};
