const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			isLogged: false,
			usuario: {},
			alert: {text:'', background:'primary', visible: false},
			message: null,
		},
		actions: {
			login: async(dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/login`;
				const options = {
					method:'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if(!response.ok){
					if(response.status == 401){
						setStore({alert: {text:'Usuario o contraseña incorrecto', background:'danger', visible:true}})
					}
					return
				}
				const datos = await response.json();
				setStore({
					isLogged: true,
					usuario: datos.results
				})
				localStorage.setItem('token', datos.access_token)
				console.log(localStorage.setItem('token', datos.access_token))
				console.log(setStore({usuario: datos.results}))
			}, 
			logout: () => {
				setStore({
					isLogged: false,
					usuario: {}
				})
				console.log(setStore({usuario: datos.results}))
				console.log(localStorage.setItem('token', datos.access_token))
				localStorage.removeItem('token')
			},
			exampleFunction: () => {getActions().changeColor(0, "green");},
			getMessage: async () => {
				const uri = `${process.env.BACKEND_URL}/api/hello`;
				const response = await fetch(uri);
				if (!response.ok) {
					// Gestionar los errores
					console.log("Error loading message from backend", error)
					return
				}
				const data = await response.json()
				setStore({ message: data.message })
				return;
			}
		}
	};
};

export default getState;

// Revisar este gist para más detalles sobre la sintaxis dentro del archivo flux.js
// https://gist.github.com/hchocobar/25a43adda3a66130dc2cb2fed8b212d0
