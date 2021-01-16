import axios from "axios";
import config from "@/config";

export default {
    state: {
        accessToken: null,
        refreshToken: null,
    },
    getters: {
        accessToken: s => s.accessToken,
        refreshToken: s => s.refreshToken,
    },
    mutations: {
        setTokens(state, response){
            console.log("setTokens", response)
            state.accessToken = response.access_token
            state.refreshToken = response.refresh_token
        }
    },
    actions: {
        async signIn({dispatch, commit}, {email, password}) {
            console.log(dispatch)
            const url = config.apiURL + "auth/sign-in/"
            let response
            try {
                console.log("Send sign-in request... ")
                response = await axios.post(url, {'email': email, 'password': password})
            } catch (err) {
                commit('setError', err.response.data)
                return false
            }
            console.log("Save authToken", response)
            commit('setTokens', response.data)
            return true
        },
        async signUp({dispatch, commit}, {email, password_1, password_2, token}){
            console.log(dispatch)
            const url = config.apiURL + "auth/sign-up/"
            let response
            try {
                console.log("Send sign-up request... ")
                const payload = {
                    'email': email,
                    'password_1': password_1,
                    'password_2': password_2,
                    'invite_token': token
                }
                response = await axios.post(url, payload)
            } catch (err) {
                commit('setError', err.response.data)
                return false
            }
            console.log("Save authToken", response)
            commit('setTokens', response.data)
            return true
        },
        async signOut({state}){
            const url = config.apiURL + "auth/sign-out/"
            let response = await axios.get(url, {headers: {'Authorization': `Bearer ${state.accessToken}`}})
            console.log(response)
        }
    }
}