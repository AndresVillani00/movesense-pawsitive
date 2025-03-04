const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			isLogged: false,
			isBuyer: false,
			usuario: {},
			alert: {text:'', background:'primary', visible: false},
			message: null,
		},
		actions: {
			getUserProfile: async () => {
                const token = localStorage.getItem("token");
                if (!token) return;  // Si no hay token, no hace nada
                
                const uri = `${process.env.BACKEND_URL}/users/profile`;
                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await fetch(uri, options);
                if (!response.ok) {
                    console.log("Error obteniendo datos del usuario");
                    return;
                }

                const datos = await response.json();
                setStore({ usuario: datos.results });
            },

            signup: async (dataToSend) => {
                const uri = `${process.env.BACKEND_URL}/usersApi/users`;
                const options = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataToSend),
                };
                const response = await fetch(uri, options);
                if (!response.ok) {
                    if (response.status == 401) {
                        setStore({ alert: { text: "Usuario ya existe", background: "danger", visible: true } });
                    }
                    return;
                }
                const datos = await response.json();
                setStore({ isLogged: true, usuario: datos.results });
                localStorage.setItem("token", datos.access_token);
            },

			
			signup: async(dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/usersApi/users`;
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
						setStore({alert: {text:'Usuario que intenta registrar ya existe', background:'danger', visible:true}})
					}
					return
				}
				const datos = await response.json();
				console.log(options);
				console.log(datos);
				setStore({
					isLogged: true,
					usuario: datos.results
				})
				if(dataToSend.is_buyer){
					setStore({ isBuyer: true })
				}
				localStorage.setItem('token', datos.access_token)
			},
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
				if(getStore().usuario.is_buyer) {
					setStore({ isBuyer: true })
				}
				localStorage.setItem('token', datos.access_token)
			}, 
			logout: () => {
				setStore({
					isLogged: false,
					usuario: {}
				})
				localStorage.removeItem('token')
			},
			setIsLogged: (value) => {
				setStore({ isLogged: value })
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
