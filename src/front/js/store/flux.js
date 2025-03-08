const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			isLogged: false,
			isBuyer: false,
			isAddedToCart:true,
			usuario: {},
			artists: [],
			products: [], 
			cart: [],
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
			addToCart: (product) => {
				const store = getStore();
				setStore({ 
				  cart: [...store.cart, product],  
				});
			  },
		
			  removeFromCart: (productId) => {
				const store = getStore();
				setStore({ 
				  cart: store.cart.filter((item) => item.id !== productId),
				});
			  },
            getArtists: async () => {
                const uri = `${process.env.BACKEND_URL}/api/users/artists`;
                try {
                    const response = await fetch(uri, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    if (!response.ok) {
                        console.log("Error obteniendo la lista de artistas");
                        return;
                    }
                    const data = await response.json();
                    setStore({ artists: data.results });
                } catch (error) {
                    console.log("Error en getArtists:", error);
                }
            },
            getProducts: async () => {
                const uri = `${process.env.BACKEND_URL}/products`;
                try {
                    const response = await fetch(uri, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" }
                    });
                    if (!response.ok) throw new Error("Error obteniendo productos");
                    const data = await response.json();
                    setStore({ products: data.results });
                } catch (error) {
                    console.log("Error en getProducts:", error);
                }
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
				setStore({
					isLogged: true,
					usuario: datos.results
				})
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
            updateUsuario: async(dataToSend, id) => {
				const uri = `${process.env.BACKEND_URL}/usersApi/users/${id}`;
				const options = {
					method:'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if(!response.ok){
					if(response.status == 401){
						setStore({ alert: {text:'Los datos del Usuario no se han podido guardar', background:'danger', visible:true} })
					}
					return
				}
				const datos = await response.json();
				setStore({	usuario: datos.results	})
			},
			postProduct: async(dataToSend) =>{
				
				const uri = `${process.env.BACKEND_URL}/productsApi/products`;
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
					isBuyer: false,
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
