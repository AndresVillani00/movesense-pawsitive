const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			isLogged: false,
			isBuyer: false,
			isAddedToCart:true,
			usuario: {},
			seller: {},
			buyer: {},
			artists: [],
			products: [],
			currentProduct: null, 
			cart: [],
			alert: {text:'', background:'primary', visible: false},
			message: null,
		},
		actions: {
			setCurrentProduct: (item) => { setStore({currentProduct: item})},
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
                const uri = `${process.env.BACKEND_URL}/productsApi/products`;
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
				
				//  llamo al endpoint de cloundinary en mi back enviandole el  datatosend.image 
				// el endpoint me devuelve una url, con esa url, reemplazo el datatosend.image (queda json) y despues continuo debajo
				 
				const token = localStorage.getItem("token");
                if (!token) return;  // Si no hay token, no hace nada
                
				const uri = `${process.env.BACKEND_URL}/productsApi/products`;
				const options = {
					method:'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if(!response.ok){
					if(response.status == 401){
						setStore({alert: {text:'El Producto que intenta registrar ya existe', background:'danger', visible:true}})
					}
					return
				}
				const datos = await response.json();
				getActions().getProducts()  // action del get product
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
			uploadImage: async (file) => {
				const store = getStore();
				const cloud_name = "diakkcdpm"; 
				const preset_name = "artVibespreset"; 
			
				const data = new FormData();
				data.append("file", file);
				data.append("upload_preset", preset_name);
			
				try {
					const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
						method: "POST",
						body: data
					});
			
					if (!response.ok) throw new Error("Error al subir la imagen");
			
					const fileData = await response.json();
					console.log("flux: ",fileData.secure_url)
					return fileData.secure_url;
				} catch (error) {
					console.error("Error en uploadImage:", error);
					return null;
				}
			},
			

			
		}
	};
};

export default getState;

// Revisar este gist para más detalles sobre la sintaxis dentro del archivo flux.js
// https://gist.github.com/hchocobar/25a43adda3a66130dc2cb2fed8b212d0
