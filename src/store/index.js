import { createStore } from 'vuex';
import axios from 'axios';


const store = createStore({
    state() {
        return {
            count: 1,
            data: [],
            token: null,
            flightQuality: "",
            flightPrice: "",
            flightDuration: ""
        };
    },
    getters: {
        getData: state => state.data,
        getSelectedItems(state) {
            return state.data.map((airport) => ({
                value: airport.id,
                label: airport.name,
            }));
        },
        getFlightQuality: state => state.flightQuality,
        getFlightPrice: state => state.flightPrice,
        getFlightDuration: state => state.flightDuration,
    },
    mutations: {
        setData(state, data) {
            state.data = data;
        },
        setToken(state, data) {
            state.token = data;
        },
        setFlightQuality(state, data) {
            state.flightQuality = data;
        },
        setFlightPrice(state, data) {
            state.flightPrice = data;
        },
        setFlightDuration(state, data) {
            state.flightDuration = data;
        }

    },

    actions: {
        async fetchData({ commit }, payload) {
            try {
                const url = 'https://api.tequila.kiwi.com/locations/query';


                const params = {
                    ...payload,
                    locale: 'es-ES',
                    location_types: 'airport',
                    limit: 10,
                    active_only: true
                };

                const headers = {
                    'apikey': 'HyvzylbFKHv5wHeLyPJXSe7uZegSr08J'
                };

                const response = await axios.get(url, { params, headers });

                commit('setData', response.data.locations);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async login({ commit, dispatch }, payload) {
            try {
                const url = 'https://cellar.tequila.kiwi.com/barrel/v1/sessions';
                const params = {
                    "brand": "tequila",
                    "email": "antonio.alonso8012@gmail.com",
                    "password": "2BXeH$b9bTP6H@e"
                }
                const response = await axios.post(url, params);

                if (response.status === 200 && response.data.token) {
                    commit('setToken', response.data.token);
                    await Promise.all([
                        dispatch('getFlightsQuality', payload),
                        dispatch('getFlightsPrice', payload),
                        dispatch('getFlightsDuration', payload)
                    ]);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async getFlightsQuality({ commit, state }, payload) {
            try {
                const url = 'https://api.tequila.kiwi.com/flights/multicity?curr=MXN&sort=quality';
                const params = {
                    "adults": 1,
                    "selected_cabins": "M",
                    "vehicle_type": "aircraft",
                    ...payload,
                }

                const headers = {
                    'apikey': 'HyvzylbFKHv5wHeLyPJXSe7uZegSr08J',
                    'Kw-Teql-User-Token': state.token,
                };
                const response = await axios.post(url, params, { headers });
                commit('setFlightQuality', response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async getFlightsPrice({ commit, state }, payload) {
            try {
                const url = 'https://api.tequila.kiwi.com/flights/multicity?curr=MXN&sort=price';
                const params = {
                    "adults": 1,
                    "selected_cabins": "M",
                    "vehicle_type": "aircraft",
                    ...payload,
                }

                const headers = {
                    'apikey': 'HyvzylbFKHv5wHeLyPJXSe7uZegSr08J',
                    'Kw-Teql-User-Token': state.token,
                };
                const response = await axios.post(url, params, { headers });
                commit('setFlightPrice', response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async getFlightsDuration({ commit, state }, payload) {
            try {
                const url = 'https://api.tequila.kiwi.com/flights/multicity?curr=MXN&sort=duration';
                const params = {
                    "adults": 1,
                    "selected_cabins": "M",
                    "vehicle_type": "aircraft",
                    ...payload,
                }

                const headers = {
                    'apikey': 'HyvzylbFKHv5wHeLyPJXSe7uZegSr08J',
                    'Kw-Teql-User-Token': state.token,
                };
                const response = await axios.post(url, params, { headers });
                commit('setFlightDuration', response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }
});

export default store;

