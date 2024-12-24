const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: undefined,
			countries: [
				{ code: "AF", name: "Afganistán" },
				{ code: "AL", name: "Albania" },
				{ code: "DE", name: "Alemania" },
				{ code: "AD", name: "Andorra" },
				{ code: "AO", name: "Angola" },
				{ code: "AR", name: "Argentina" },
				{ code: "AM", name: "Armenia" },
				{ code: "AU", name: "Australia" },
				{ code: "AT", name: "Austria" },
				{ code: "BE", name: "Bélgica" },
				{ code: "BR", name: "Brasil" },
				{ code: "CA", name: "Canadá" },
				{ code: "CL", name: "Chile" },
				{ code: "CN", name: "China" },
				{ code: "CO", name: "Colombia" },
				{ code: "CR", name: "Costa Rica" },
				{ code: "CU", name: "Cuba" },
				{ code: "DK", name: "Dinamarca" },
				{ code: "EG", name: "Egipto" },
				{ code: "ES", name: "España" },
				{ code: "US", name: "Estados Unidos" },
				{ code: "FR", name: "Francia" },
				{ code: "IT", name: "Italia" },
				{ code: "JP", name: "Japón" },
				{ code: "MX", name: "México" },
				{ code: "PE", name: "Perú" },
				{ code: "PT", name: "Portugal" },
				{ code: "GB", name: "Reino Unido" },
				{ code: "RU", name: "Rusia" },
				{ code: "ZA", name: "Sudáfrica" },
				{ code: "SE", name: "Suecia" },
				{ code: "CH", name: "Suiza" },
				{ code: "UY", name: "Uruguay" },
				{ code: "VE", name: "Venezuela" }
			],
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

			getCountries: () => {
				const store = getStore();
				console.log("Countries available:", store.countries);
				return store.countries;
			},

			findCountryByCode: (code) => {
				const store = getStore();
				const country = store.countries.find(c => c.code === code);
				return country || { code: "", name: "Not found" };
			},
			setToken:(token) =>{
				setStore({ token: token })
				localStorage.setItem("token", token)
			},
			clearToken: () => {
				setStore({ token: undefined })
				localStorage.removeItem("token")
			}
		}
	};
};

export default getState;
