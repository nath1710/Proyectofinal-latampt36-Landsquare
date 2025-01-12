
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: undefined,
			countries: [],
			preset_name: 'landsquare',
			cloud_name: 'dgbakagwe',
			favorites: [],
			userId: null,
			user: null,
			isAdmin: false,
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			findCountryByCode: (code) => {
				const store = getStore();
				const country = store.countries.find(c => c.code === code);
				return country || { code: "", name: "Not found" };
			},
			setToken: async (token) => {
				setStore({ token: token })
				localStorage.setItem('token', token)

				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/user', {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${token}`,
							'Content-Type': 'application/json'
						}
					})
					if (response.ok) {
						const userData = await response.json()
						console.log('user dataaaaaaaaaaaaaa', userData)
						getActions().setUser(userData)
					} else {
						console.error('Error fetching user data')
					}
				} catch (error) {
					console.error('Error:', error)
				}
			},

			clearToken: () => {
				setStore({ token: undefined, isAdmin: false })
				localStorage.removeItem('token')
				getActions().clearUser()
			},
			reloadToken: () => {
				const token = localStorage.getItem('token')
				if (token) {
					setStore({ token: token })
					getActions().reloadUser()
				}
			},
			getCountries: () => {
				fetch("https://restfulcountries.com/api/v1/countries", {
					headers: {
						"Authorization": "Bearer 1903|TB1KfaeQjwRLKcXFoKcxpvqLprsinKWYy2F9GS45",
						"Accept": "application/json",
					},
				})
					.then((res) => {
						if (!res.ok) {
							if (res.status === 401) {
								throw new Error("Unauthorized: Check your API token.");
							}
							throw new Error(`HTTP error! Status: ${res.status}`);
						}
						return res.json();
					})
					.then((data) => {
						if (!Array.isArray(data.data)) {
							throw new Error("Invalid response format: Expected an array of results");
						}
						const transformedCountries = data.data.map((country) => ({
							name: country.name,
							currency: country.currency,
							flag: country.href.flag,
							iso3: country.iso3,
						}));
						setStore({ countries: transformedCountries });
					})
					.catch((err) => {
						console.error("Could not load countries", err);
						setStore({ countries: [] }); // Evitar que el componente falle.
					});
			},
			addFavorite: (id, land) => {
				setStore((prevStore) => {
					// Verifica si el terreno ya está en favoritos
					if (!prevStore.favorites.some((fav) => fav.id === id)) {
						return {
							...prevStore,
							favorites: [...prevStore.favorites, { id, land }],
						};
					}
					return prevStore;
				});
			},
			removeFavorite: (id) => {
				setStore((prevStore) => ({
					...prevStore,
					favorites: prevStore.favorites.filter((fav) => fav.id !== id),
				}));
			},
			setUser: (userData) => {
				setStore({ user: userData, userId: userData.id })
				localStorage.setItem('user', JSON.stringify(userData))
			},
			clearUser: () => {
				setStore({ user: null, userId: null })
				localStorage.removeItem('user')
			},
			reloadUser: () => {
				const userStr = localStorage.getItem('user')
				if (userStr) {
					const userData = JSON.parse(userStr)
					setStore({ user: userData, userId: userData.id })
				}
			},


			fetchIsAdmin: async () => {
				const store = getStore();
				if (!store.token) return;

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/user`, {
						headers: {
							Authorization: `Bearer ${store.token}`,
						},
					});
					if (!response.ok) throw new Error("Error al cargar usuario");
					const data = await response.json();
					setStore({ isAdmin: data.role === "Admin" });
				} catch (error) {
					console.error("Error al cargar el rol del usuario:", error);
				}
			},

			setToken: (token) => {
				setStore({ token });
				getActions().fetchIsAdmin();
			},
		}
	}
};

export default getState;
