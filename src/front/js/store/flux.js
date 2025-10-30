const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			idParam: null,
			idMascotaReporte: null,
			isLogged: false,
			isNuevaMascota: false,
			isVeterinario: false,
			JSONEntrada: null,
			alertas: {},
			usuario: {},
			veterinario: {},
			report: {},
			reportes: [],
			analysis: [],
			alerts: [],
			metricas: [],
			incidenciaId: null,
			incidencia: {},
			incidencias: [],
			incidenciasUser: [],
			foods: [],
			mascotas: [],
			userMascotas: [],
			mascotUsers: [],
			currentMascota: null,
			fotoMascota: null,
			fotoJsonAnalysis: null,
			fotoJsonIncidencia: null,
			fotoJsonFood: null,
			reportAI: null,
			analisisAI: null,
			descriptionReport: null,
			analysisReport: null,
			actionReport: null,
			activeKey: null,
			alert: { text: '', background: 'primary', visible: false },
			message: null,
		},
		actions: {
			setIdParam: (item) => { setStore({ idParam: item }) },
			setCurrentMascota: (item) => { setStore({ currentMascota: item }) },
			setFotoMascota: (item) => { setStore({ fotoMascota: item }) },
			setFotoJsonIncidencia: (item) => { setStore({ fotoJsonIncidencia: item }) },
			setFotoJsonAnalysis: (item) => { setStore({ fotoJsonAnalysis: item }) },
			setFotoJsonFood: (item) => { setStore({ fotoJsonFood: item }) },
			setActiveKey: (item) => { setStore({ activeKey: item }) },
			generarJsonEntrada: async (mascota_id, start, end) => {
				const uri = `${process.env.BACKEND_URL}/openaiApi/mascota/${mascota_id}/json-entrada?start_ts=${start}&end_ts=${end}`;
				const options = {
					method: 'GET',
					headers: { "Content-Type": "application/json" }
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					return
				}

				const dataJson = await response.json();
				setStore({ JSONEntrada: dataJson.results });
			},
			reportOpenAI: async (prompt, dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/openaiApi/generate-report`;
				const options = {
					method: 'POST',
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ prompt, dataToSend })
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					return
				}
				const data = await response.json();
				console.log(data)
				setStore({ reportAI: data })
			},
			analisisOpenAI: async (prompt, dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/openaiApi/generate-analisis`;
				const options = {
					method: 'POST',
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ prompt, dataToSend })
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					return
				}
				const data = await response.json();
				setStore({ analisisAI: data.results })
			},
			postjson: async (data) => {
				const uri = `${process.env.BACKEND_URL}/metricasApi/metricas-json`;
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					return
				}
			},
			updateJsonMascota: async (json) => {

			},
			getMetricasJSon: async (codigo) => {
				try {
					const uri = `${process.env.BACKEND_URL}/metricasApi/metricas-alertas/${codigo}`;
					const options = {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						}
					};
					const response = await fetch(uri, options);
					if (!response.ok) {
						console.log(response.error)
						return
					}
					const data = await response.json();
					setStore({ alertas: data.results });
				} catch (error) {
					console.log("Error: ", error);
				}
			},
			getCodeJson: async (id) => {
				try {
					const uri = `${process.env.BACKEND_URL}/metricasApi/codigo-final/${id}`;
					const response = await fetch(uri, {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});

					const data = await response.json();
					getActions().getMetricasJSon(data.results);
				} catch (error) {
					console.log("Error: ", error);
				}
			},
			getAlarmaJson: async () => {

			},
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
				const uri = `${process.env.BACKEND_URL}/mascotasApi/mascotas`;

				try {
					const response = await fetch(uri, {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
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
			getUsersMascotas: async () => {
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
					setStore({ userMascotas: data.results });
				} catch (error) {
					console.log("Error en getUsersMascotas:", error);
				}
				getActions().getMascotShareUsers(getStore().userMascotas.userId);
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
					if (response.status == 400) {
						setStore({ alert: { text: 'La contraseña necesita al menos 8 caracteres', background: 'danger', visible: true } })
					}
					if (response.status == 401) {
						setStore({ alert: { text: 'La contraseña necesita tener un caracter especial', background: 'danger', visible: true } })
					}
					if (response.status == 404) {
						setStore({ alert: { text: 'Usuario que intenta registrar ya existe', background: 'danger', visible: true } })
					}
					return
				}

				setStore({ alert: { text: 'Mascota registrada correctamente', background: 'primary', visible: true } })
				getActions().getUsersMascotas()
			},
			updateMascota: async (dataToSend, id) => {
				const uri = `${process.env.BACKEND_URL}/mascotasApi/mascotas/${id}`;
				const token = localStorage.getItem("token");
				if (!token) return;

				const options = {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					if (response.status == 400) {
						setStore({ alert: { text: 'La contraseña necesita al menos 8 caracteres', background: 'danger', visible: true } })
					}
					if (response.status == 401) {
						setStore({ alert: { text: 'La contraseña necesita tener un caracter especial', background: 'danger', visible: true } })
					}
					if (response.status == 404) {
						setStore({ alert: { text: 'Usuario que intenta registrar ya existe', background: 'danger', visible: true } })
					}
					return
				}
				const datos = await response.json();
				setStore({ currentMascota: datos.results })
				getActions().getUsersMascotas()
			},
			deleteMascota: async (id) => {
				const token = localStorage.getItem("token");
				if (!token) return false;

				const uri = `${process.env.BACKEND_URL}/mascotasApi/mascotas/${id}`;
				const options = {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};

				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						if (response.status == 403) {
							setStore({ alert: { text: `No tienes permisos para eliminar la mascota`, background: 'danger', visible: true } })
						}
						return
					}

					const updatedMascotas = getStore().mascotas.filter(mascota => mascota.id !== id);
					setStore({ mascotas: updatedMascotas });
					getActions().getUsersMascotas();

					return true;
				} catch (error) {
					console.log("Error en deleteMascota:", error);
					return false;
				}
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

				if (dataToSend.foto_analysis == null) {
					setStore({ alert: { text: `Necesitas ingresar una foto del analisis`, background: 'danger', visible: true } })
					return;
				}

				const response = await fetch(uri, options);
				if (!response.ok) {
					if (response.status == 401) {
						setStore({ alert: { text: 'El Analysis que intenta registrar ya existe', background: 'danger', visible: true } })
					}
					return
				}

				getActions().getAnalysis(dataToSend.mascota_analysis_id);
			},
			deleteAnalysis: async (id) => {
				const token = localStorage.getItem("token");
				if (!token) return false;

				const uri = `${process.env.BACKEND_URL}/analysisApi/analysis/${id}`;
				const options = {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};

				try {
					const response = await fetch(uri, options);
					if (!response.ok) throw new Error("No tienes permisos para eliminar este analysis");

					const updatedAnalysis = getStore().analysis.filter(analysis => analysis.id !== id);
					setStore({ analysis: updatedAnalysis });

					return true;
				} catch (error) {
					console.log("Error en deleteAnalysis:", error);
					return false;
				}
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
					setStore({ metricas: data.results });
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
			deleteMetrica: async (id) => {
				const token = localStorage.getItem("token");
				if (!token) return false;

				const uri = `${process.env.BACKEND_URL}/metricasApi/metricas/${id}`;
				const options = {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};

				try {
					const response = await fetch(uri, options);
					if (!response.ok) throw new Error("No tienes permisos para eliminar esta metrica");

					const updatedMetricas = getStore().metricas.filter(metrica => metrica.id !== id);
					setStore({ metricas: updatedMetricas });

					return true;
				} catch (error) {
					console.log("Error en deleteMetrica:", error);
					return false;
				}
			},
			getIncidencias: async () => {
				const uri = `${process.env.BACKEND_URL}/incidenciasApi/incidencias`;

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
			getIncidenciasUser: async () => {
				const token = localStorage.getItem("token");
				if (!token) return;

				const uri = `${process.env.BACKEND_URL}/incidenciasApi/usuarios/incidencias`;

				try {
					const response = await fetch(uri, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`
						}
					});
					if (!response.ok) {
						console.log("Error obteniendo la lista de incidencias");
						return;
					}
					const data = await response.json();
					setStore({ incidenciasUser: data.results });
				} catch (error) {
					console.log("Error en getIncidenciasUser:", error);
				}
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

				if (dataToSend.foto_incidencia == null) {
					setStore({ alert: { text: 'Necesitas Ingresar una foto de la Incidencia', background: 'danger', visible: true } })
					return;
				}

				const response = await fetch(uri, options);
				if (!response.ok) {
					if (response.status == 401) {
						setStore({ alert: { text: 'La Incidencia que intenta registrar ya existe', background: 'danger', visible: true } })
					}
					return
				}

				getActions().getIncidencia(dataToSend.mascota_incidencia_id);
			},
			deleteIncidencia: async (id) => {
				const token = localStorage.getItem("token");
				if (!token) return false;

				const uri = `${process.env.BACKEND_URL}/incidenciasApi/incidencias/${id}`;
				const options = {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};

				try {
					const response = await fetch(uri, options);
					if (!response.ok) throw new Error("No tienes permisos para eliminar esta incidencia");

					const updatedIncidencias = getStore().incidencias.filter(incidencia => incidencia.id !== id);
					setStore({ incidencias: updatedIncidencias });

					return true;
				} catch (error) {
					console.log("Error en deleteIncidencia:", error);
					return false;
				}
			},
			getAlerts: async () => {
				const uri = `${process.env.BACKEND_URL}/alertsApi/alerts`;

				try {
					const response = await fetch(uri, {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (!response.ok) {
						console.log("Error obteniendo la lista de alertas");
						return;
					}
					const data = await response.json();
					setStore({ alerts: data.results });
				} catch (error) {
					console.log("Error en getAlerts:", error);
				}
			},
			postAlert: async (dataToSend) => {
				const token = localStorage.getItem("token");
				if (!token) return;

				const uri = `${process.env.BACKEND_URL}/alertsApi/alerts`;
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
						setStore({ alert: { text: 'La Alerta que intenta registrar ya existe', background: 'danger', visible: true } })
					}
					return
				}
			},
			getFood: async (id) => {
				const uri = `${process.env.BACKEND_URL}/foodApi/mascotas/${id}/food`;

				try {
					const response = await fetch(uri, {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (!response.ok) {
						console.log("Error obteniendo la lista de comidas");
						return;
					}
					const data = await response.json();
					setStore({ foods: data.results });
				} catch (error) {
					console.log("Error en getFood:", error);
				}
			},
			postFood: async (dataToSend) => {
				const token = localStorage.getItem("token");
				if (!token) return;

				const uri = `${process.env.BACKEND_URL}/foodApi/food`;
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(dataToSend)
				};

				if (dataToSend.foto_food == null) {
					setStore({ alert: { text: 'Necesitas Ingresar una foto de la comida', background: 'danger', visible: true } })
					return;
				}

				const response = await fetch(uri, options);
				if (!response.ok) {
					if (response.status == 401) {
						setStore({ alert: { text: 'La Comida que intenta registrar ya existe', background: 'danger', visible: true } })
					}
					return
				}

				getActions().getFood(dataToSend.mascota_comida_id);
			},
			deleteFood: async (id) => {
				const token = localStorage.getItem("token");
				if (!token) return false;

				const uri = `${process.env.BACKEND_URL}/foodApi/foods/${id}`;
				const options = {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};

				try {
					const response = await fetch(uri, options);
					if (!response.ok) throw new Error("No tienes permisos para eliminar esta comida");

					const updatedFoods = getStore().foods.filter(food => food.id !== id);
					setStore({ foods: updatedFoods });

					return true;
				} catch (error) {
					console.log("Error en deleteFood:", error);
					return false;
				}
			},
			getReportes: async () => {
				const uri = `${process.env.BACKEND_URL}/reportesApi/reportes`;

				try {
					const response = await fetch(uri, {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (!response.ok) {
						console.log("Error obteniendo la lista de reportes");
						return;
					}
					const data = await response.json();
					setStore({ reportes: data.results });
				} catch (error) {
					console.log("Error en getReports:", error);
				}
			},
			getReport: async (id) => {
				const uri = `${process.env.BACKEND_URL}/reportesApi/mascotas/${id}/reportes`;

				try {
					const response = await fetch(uri, {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (!response.ok) {
						console.log("Error obteniendo la lista de reportes");
						return;
					}
					const data = await response.json();
					setStore({ reportes: data.results });
				} catch (error) {
					console.log("Error en getReport:", error);
				}
			},
			postReport: async (dataToSend) => {
				const token = localStorage.getItem("token");
				if (!token) return;

				const uri = `${process.env.BACKEND_URL}/reportesApi/reportes`;
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
						setStore({ alert: { text: 'El Reporte que intenta registrar ya existe', background: 'danger', visible: true } })
					}
					return
				}

				getActions().getReport(dataToSend.mascota_reports_id);
			},
			putReadReport: async (dataToSend, id) => {
				const uri = `${process.env.BACKEND_URL}/reportesApi/reportes/${id}`;
				const options = {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					if (response.status == 400) {
						setStore({ alert: { text: 'No se pudo leer el reporte', background: 'danger', visible: true } })
					}
					return
				}
				getActions().getReportes()
			},
			putReadAlert: async (dataToSend, id) => {
				const uri = `${process.env.BACKEND_URL}/alertsApi/alerts/${id}`;
				const options = {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					if (response.status == 400) {
						setStore({ alert: { text: 'No se pudo leer la Alerta', background: 'danger', visible: true } })
					}
					return
				}
				getActions().getAlerts()
			},
			getStoredToken: () => {
				return localStorage.getItem('token') || null;
			},
			parseJwt: (token) => {
				if (!token) return null;
				try {
					const parts = token.split('.');
					if (parts.length < 2) return null;
					const payload = parts[1];
					const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
					return decoded;
				} catch (e) {
					return null;
				}
			},
			isTokenValid: (token) => {
				const payload = getActions().parseJwt(token);
				if (!payload) return false;
				if (!payload.exp) return true; // si no viene exp asumimos válido (no ideal)
				const now = Math.floor(Date.now() / 1000);
				return payload.exp > now;
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
					if (response.status == 400) {
						setStore({ alert: { text: 'La contraseña necesita al menos 8 caracteres', background: 'danger', visible: true } })
					}
					if (response.status == 401) {
						setStore({ alert: { text: 'La contraseña necesita tener un caracter especial', background: 'danger', visible: true } })
					}
					if (response.status == 404) {
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
				getActions().getUsersMascotas()
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
					if (response.status == 400) {
						setStore({ alert: { text: 'La contraseña necesita al menos 8 caracteres', background: 'danger', visible: true } })
					}
					if (response.status == 401) {
						setStore({ alert: { text: 'La contraseña necesita tener un caracter especial', background: 'danger', visible: true } })
					}
					if (response.status == 404) {
						setStore({ alert: { text: 'Usuario que intenta registrar es erroneo o no existe', background: 'danger', visible: true } })
					}
					return
				}

				const datos = await response.json();
				if (dataToSend.remember) {
					localStorage.setItem('token', datos.access_token);
				} else {
					localStorage.removeItem('token');
				}
				setStore({
					isLogged: true,
					usuario: datos.results,
					alert: { text: 'Loggeado correctamente', background: 'primary', visible: true }
				})
				if (getStore().usuario.is_veterinario) {
					setStore({ isVeterinario: true })
				}
				localStorage.setItem('token', datos.access_token)
				getActions().getUsersMascotas()
			},
			logout: () => {
				setStore({
					isLogged: false,
					isVeterinario: false,
					usuario: {},
					userMascotas: [],
					activeKey: null
				})
				localStorage.removeItem('token')
			},
			checkAuth: async () => {
				const token = getActions().getStoredToken();
				if (!token) {
					// usuario no logeado
					setStore({ isLogged: false, usuario: null });
					return;
				}

				// validar expiración del token (sin llamar al backend)
				if (!getActions().isTokenValid(token)) {
					// token expirado -> limpiar y salir
					localStorage.removeItem('token');
					setStore({ isLogged: false, usuario: null });
					return;
				}

				const uri = `${process.env.BACKEND_URL}/usersApi/remember-user`; // devuelve user actual según token
				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					}
				};
				const resp = await fetch(uri, options);
				if (resp.ok) {
					const result = await resp.json();
					setStore({ isLogged: true, usuario: result.results });
					if (result.results.is_veterinario) setStore({ isVeterinario: true });
					getActions().getUsersMascotas();
				} else {
					// si la verificación falla en backend, limpiar
					localStorage.removeItem('token');
					setStore({ isLogged: false, usuario: null });
				}

				if (getStore().isVeterinario) {
					getActions().setActiveKey('alerts')
				} else if (getStore().userMascotas.length < 1) {
					getActions().setActiveKey('register')
				} else {
					getActions().setActiveKey('existing')
				}
			},
			paymentIntent: async (dataToSend) => {
				const token = localStorage.getItem("token");
				if (!token) return;

				const uri = `${process.env.BACKEND_URL}/stripeApi/create-subscription-session`;
				const options = {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(dataToSend),
					Authorization: `Bearer ${token}`
				};
				const response = await fetch(uri, options);

				const data = await response.json();
				if (data.url) {
					window.location.href = data.url; // redirige a Stripe
				} else {
					console.error("Error al crear sesión:", data.error);
				}
			},
			setIsLogged: (value) => {
				setStore({ isLogged: value })
			},
			setIsVeterinario: (value) => {
				setStore({ isVeterinario: value })
			},
			setNuevaMascota: (value) => {
				setStore({ isNuevaMascota: value })
			},
			updateUsuario: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/usersApi/users`;
				const token = localStorage.getItem("token");
				if (!token) return;

				const options = {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
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
			updateVeterinario: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/veterinariosApi/veterinarios`;
				const token = localStorage.getItem("token");
				if (!token) return;

				const options = {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					if (response.status == 401) {
						setStore({ alert: { text: 'Los datos del Veterinario no se han podido guardar', background: 'danger', visible: true } })
					}
					return
				}
				const datos = await response.json();
				setStore({
					veterinario: datos.results,
					isVeterinario: true
				})
			},
			getShareUsers: async (id) => {
				const uri = `${process.env.BACKEND_URL}/mascotasApi/mascotas/${id}/usuarios`;

				try {
					const response = await fetch(uri, {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (!response.ok) {
						console.log("Error obteniendo la lista de usuarios de la mascota");
						return;
					}
					const data = await response.json();
					setStore({ mascotUsers: data.results });
				} catch (error) {
					console.log("Error en getShareUsers:", error);
				}
			},
			getMascotShareUsers: async (id) => {
				const uri = `${process.env.BACKEND_URL}/mascotasApi/usuarios/${id}/share-mascot`;

				try {
					const response = await fetch(uri, {
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					});
					if (!response.ok) {
						console.log("Error obteniendo la lista de mascotas del usuario");
						return;
					}
					const data = await response.json();
					setStore({ userMascotas: data.results });
				} catch (error) {
					console.log("Error en getMascotShareUsers:", error);
				}
			},
			shareMascot: async (dataToSend, mascotId, userId) => {
				const uri = `${process.env.BACKEND_URL}/mascotasApi/mascotas/${mascotId}/share`;
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
						setStore({ alert: { text: 'La Mascota que intenta compartir ya se compartio con este usuario', background: 'danger', visible: true } })
					}
					return
				}

				getActions().getShareUsers(mascotId);
				getActions().getMascotShareUsers(userId);
			},
			deleteShareMascot: async (mascotaId, userId) => {
				const token = localStorage.getItem("token");
				if (!token) return;

				const uri = `${process.env.BACKEND_URL}/mascotasApi/mascotas/${mascotaId}/delete-share/${userId}`;
				const options = {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				};
				try {
					const response = await fetch(uri, options);
					if (!response.ok) throw new Error("No tienes permisos para eliminar esta usuario");

					const updatedMascotUsers = getStore().mascotUsers.filter(users => users.id !== userId);
					setStore({ mascotUsers: updatedMascotUsers });

					return true;
				} catch (error) {
					console.log("Error en deleteShareMascot:", error);
					return false;
				}
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
			},
			defaultUsuarios: async () => {
				const uri = `${process.env.BACKEND_URL}/api/default-users`;
				const options = {
					method: 'POST',
				};

				await fetch(uri, options);
			},
			defaultMetricas: async () => {
				const uri = `${process.env.BACKEND_URL}/api/default-metricas`;
				const options = {
					method: 'POST',
				};

				await fetch(uri, options);
			}
		}
	};
};

export default getState;

// Revisar este gist para más detalles sobre la sintaxis dentro del archivo flux.js
// https://gist.github.com/hchocobar/25a43adda3a66130dc2cb2fed8b212d0
