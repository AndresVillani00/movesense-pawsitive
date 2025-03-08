import React, { useContext } from "react";
import { Context } from "../store/appContext";


export const Alert = () => {
    const { store } = useContext(Context);
    
    return (
        <div className={`container mt-5 ${store.alert.visible ? '' : 'd-none'}`}>
            <div className={`alert alert-${store.alert.background}`} role="alert">
                {store.alert.text}
            </div>
        </div>
    );
}