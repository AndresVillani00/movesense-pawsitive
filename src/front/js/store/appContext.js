import React, { useState, useEffect } from "react";
import getState from "./flux.js";

// Don't change, here is where we initialize our context, by default it's just going to be null.
export const Context = React.createContext(null);

// This function injects the global store to any view/component where you want to use it, we will inject the context to layout.js, you can see it here:
// https://github.com/4GeeksAcademy/react-hello-webapp/blob/master/src/js/layout.js#L35
const injectContext = PassedComponent => {
	const StoreWrapper = props => {
		// This will be passed as the contenxt value
		const [state, setState] = useState(
			getState({
				getStore: () => state.store,
				getActions: () => state.actions,
				setStore: updatedStore =>
					setState({
						store: Object.assign(state.store, updatedStore),
						actions: { ...state.actions }
					})
			})
		);

		/*
		  EDIT THIS!
		  This function is the equivalent to "window.onLoad", it only runs once on the entire application lifetime
		  you should do your ajax requests or fetch api requests here. Do not use setState() to save data in the
		  store, instead use actions, like this:
		*/
		useEffect(() => {
			state.actions.checkAuth();
			state.actions.getUserProfile();
			state.actions.getUsersMascotas();

			const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
			[...popoverTriggerList].map(el => new window.bootstrap.Popover(el));

			const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    		[...tooltipTriggerList].map(el => new window.bootstrap.Tooltip(el));
			
			try {
				const token = localStorage.getItem("token");
				const wasReloaded = sessionStorage.getItem("wasReloaded");

				// Solo redirigir si hay token, ya fue recargada previamente y no estamos ya en /home
				if (token && wasReloaded && window.location.pathname !== "/home") {
					// dejamos un pequeño delay para que checkAuth() pueda terminar
					setTimeout(() => {
						// Usa replace para no agregar una entrada extra al historial
						window.location.replace("/home");
					}, 1000);
				}

				// Marcar que ya hubo al menos un montaje / posible recarga
				// (esto hace que la siguiente recarga sea detectada como "wasReloaded")
				sessionStorage.setItem("wasReloaded", "true");
			} catch (err) {
				// no hacer nada si falla el acceso a storage
				console.warn("Error comprobando remember/reload:", err);
			}
		}, []);

		// The initial value for the context is not null anymore, but the current state of this component,
		// the context will now have a getStore, getActions and setStore functions available, because they were declared
		// on the state of this component
		return (
			<Context.Provider value={state}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};

	return StoreWrapper;
};

export default injectContext;
