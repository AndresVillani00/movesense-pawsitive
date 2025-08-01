const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			idParam: null,
			isLogged: false,
			isNuevaMascota: false,
			isVeterinario: false,
			usuario: {},
			analysis: [],
			metrica: [],
			incidenciaId: null,
			incidencia: {},
			incidencias: [],
			mascotas: [],
			currentMascota: null,
			fotoMascota: null,
			fotoJsonAnalysis: null,
			fotoJsonIncidencia: null,
			alert: { text: '', background: 'primary', visible: false },
			message: null,
		},
		actions: {
			setIdParam: (item) => { setStore({ idParam: item }) },
			setCurrentMascota: (item) => { setStore({ currentMascota: item }) },
			setFotoMascota: (item) => { setStore({ fotoMascota: item }) },
			setFotoJsonIncidencia: (item) => { setStore({ fotoJsonIncidencia: item }) },
			setFotoJsonAnalysis: (item) => { setStore({ fotoJsonAnalysis: item }) },
			getUserProfile: async () => {
				const token = localStorage.getItem("token");
				if (!token) return;

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
			postMascotaDetails: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/mascotasDetailsApi/mascotas-details`;
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					return
				}
				const data = await response.json();
				getActions().getMascotas(data.user_id);
			},
			getMascotas: async () => {
				const uri = `${process.env.BACKEND_URL}/mascotasApi/users/mascotas`;
				const token = localStorage.getItem("token");
				if (!token) return;

				try {
					const response = await fetch(uri, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`
						}
					});
					if (!response.ok) {
						console.log("Error obteniendo la lista de mascotas");
						return;
					}
					const data = await response.json();
					setStore({ mascotas: data.results });
				} catch (error) {
					console.log("Error en getMascotas:", error);
				}
			},
			getMascotaById: async (id) => {
				const uri = `${process.env.BACKEND_URL}/mascotasApi/mascotas/${id}`;
				try {
					const response = await fetch(uri, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					});
					if (!response.ok) {
						console.log("Error obteniendo la mascota");
						return null;
					}
					const data = await response.json();
					return data.results;
				} catch (error) {
					console.log("Error en getMascotatById:", error);
					return null;
				}
			},
			postMascota: async (dataToSend) => {
				//  llamo al endpoint de cloundinary en mi back enviandole el  datatosend.image 
				// el endpoint me devuelve una url, con esa url, reemplazo el datatosend.image (queda json) y despues continuo debajo

				const token = localStorage.getItem("token");
				if (!token) return;

				const uri = `${process.env.BACKEND_URL}/mascotasApi/mascotas`;
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					if (response.status == 401) {
						setStore({ alert: { text: 'La Mascota que intenta registrar ya existe', background: 'danger', visible: true } })
					}
					return
				}

				getActions().getMascotas()
			},
			getAnalysis: async (id) => {
				const uri = `${process.env.BACKEND_URL}/analysisApi/mascotas/${id}/analysis`;

				try {
					const response = await fetch(uri, {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (!response.ok) {
						console.log("Error obteniendo la lista de analysis");
						return;
					}
					const data = await response.json();
					setStore({ analysis: data.results });
				} catch (error) {
					console.log("Error en getAnalysis:", error);
				}
			},
			postAnalysis: async (dataToSend) => {
				const token = localStorage.getItem("token");
				if (!token) return;
				
				const uri = `${process.env.BACKEND_URL}/analysisApi/analysis`;
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					if (response.status == 401) {
						setStore({ alert: { text: 'La Analysis que intenta registrar ya existe', background: 'danger', visible: true } })
					}
					return
				}

				getActions().getAnalysis(dataToSend.mascota_analysis_id);
			},
			getMetrica: async (id) => {
				const uri = `${process.env.BACKEND_URL}/metricasApi/mascotas/${id}/metricas`;

				try {
					const response = await fetch(uri, {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (!response.ok) {
						console.log("Error obteniendo la lista de metricas");
						return;
					}
					const data = await response.json();
					setStore({ metrica: data.results });
				} catch (error) {
					console.log("Error en getMetrica:", error);
				}
			},
			postMetrica: async (dataToSend) => {
				const token = localStorage.getItem("token");
				if (!token) return;
				
				const uri = `${process.env.BACKEND_URL}/metricasApi/metricas`;
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					if (response.status == 401) {
						setStore({ alert: { text: 'La Metrica que intenta registrar ya existe', background: 'danger', visible: true } })
					}
					return
				}

				getActions().getMetrica(dataToSend.mascota_metrica_id);
			},
			getIncidencia: async (id) => {
				const uri = `${process.env.BACKEND_URL}/incidenciasApi/mascotas/${id}/incidencias`;

				try {
					const response = await fetch(uri, {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (!response.ok) {
						console.log("Error obteniendo la lista de incidencias");
						return;
					}
					const data = await response.json();
					setStore({ incidencias: data.results });
				} catch (error) {
					console.log("Error en getIncidencias:", error);
				}
			},
			postIncidencia: async (dataToSend) => {
				const token = localStorage.getItem("token");
				if (!token) return;

				const uri = `${process.env.BACKEND_URL}/incidenciasApi/incidencias`;
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					if (response.status == 401) {
						setStore({ alert: { text: 'La Incidencia que intenta registrar ya existe', background: 'danger', visible: true } })
					}
					return
				}

				getActions().getIncidencia(dataToSend.mascota_incidencia_id);
			},
			signup: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/usersApi/users`;
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					if (response.status == 401) {
						setStore({ alert: { text: 'Usuario que intenta registrar ya existe', background: 'danger', visible: true } })
					}
					return
				}
				const datos = await response.json();
				setStore({
					isLogged: true,
					usuario: datos.results
				})
				if (getStore().usuario.is_veterinario) {
					setStore({ isVeterinario: true })
				}
				localStorage.setItem('token', datos.access_token)
			},
			login: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/login`;
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					if (response.status == 401) {
						setStore({ alert: { text: 'Usuario o contraseña incorrecto', background: 'danger', visible: true } })
					}
					return
				}
				const datos = await response.json();
				setStore({
					isLogged: true,
					usuario: datos.results
				})
				if (getStore().usuario.is_veterinario) {
					setStore({ isVeterinario: true })
				}
				localStorage.setItem('token', datos.access_token)
				getActions().getMascotas()
			},
			logout: () => {
				setStore({
					isLogged: false,
					isVeterinario: false,
					usuario: {},
					mascotas:[]
				})
				localStorage.removeItem('token')
			},
			setIsLogged: (value) => {
				setStore({ isLogged: value })
			},
			setNuevaMascota: (value) => {
				setStore({ isNuevaMascota: value })
			},
			updateUsuario: async (dataToSend, id) => {
				const uri = `${process.env.BACKEND_URL}/usersApi/users/${id}`;
				const options = {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					if (response.status == 401) {
						setStore({ alert: { text: 'Los datos del Usuario no se han podido guardar', background: 'danger', visible: true } })
					}
					return
				}
				const datos = await response.json();
				setStore({ usuario: datos.results })
			},
			uploadImage: async (file) => {
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
					console.log("flux: ", fileData.secure_url)
					return fileData.secure_url;
				} catch (error) {
					console.error("Error en uploadImage:", error);
					return null;
				}
			},
			removeMascota: async (mascotaId) => {
				const token = localStorage.getItem("token");
				if (!token) return false;

				const uri = `${process.env.BACKEND_URL}/mascotasApi/mascotas/${mascotaId}`;
				const options = {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};

				try {
					const response = await fetch(uri, options);
					if (!response.ok) throw new Error("No tienes permisos para eliminar este producto");

					const store = getStore();
					const updatedMascotas = store.mascotas.filter(mascota => mascota.id !== mascotaId);
					setStore({ mascotas: updatedMascotas });

					return true;
				} catch (error) {
					console.log("Error en removeMascota:", error);
					return false;
				}
			}
		}
	};
};

export default getState;

// Revisar este gist para más detalles sobre la sintaxis dentro del archivo flux.js
// https://gist.github.com/hchocobar/25a43adda3a66130dc2cb2fed8b212d0
