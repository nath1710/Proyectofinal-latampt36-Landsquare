const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: undefined,
			countries: [],
			token: undefined,
			preset_name: 'landsquare',
			cloud_name: 'dgbakagwe'
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
			setToken: (token) => {
				setStore({ token: token })
				localStorage.setItem("token", token)
			},
			clearToken: () => {
				setStore({ token: undefined })
				localStorage.removeItem("token")
			},
			reloadToken: () => {
				if (localStorage.getItem('token')) {
					setStore({ token: localStorage.getItem('token') })
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

		}
	}
};


export default getState;
