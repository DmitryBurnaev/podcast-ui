import axios from "axios";

export default {
    state: {
        accessToken: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
    },
    getters: {
        accessToken: s => s.accessToken,
        refreshToken: s => s.refreshToken,
    },
    mutations: {
        setTokens(state, payload){
            console.log("setTokens", payload)
            localStorage.setItem('accessToken', payload.access_token)
            localStorage.setItem('refreshToken', payload.refresh_token)
            state.accessToken = payload.access_token
            state.refreshToken = payload.refresh_token
        },
        clearToken(state){
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            state.accessToken = null
            state.refreshToken = null
        }
    },
    actions: {
        async signIn({commit}, {email, password}) {
            let response
            response = await axios.post("auth/sign-in/", {'email': email, 'password': password})
            if (!response){ throw Error }
            commit('setTokens', response.data.payload)
        },
        async signUp({commit}, {email, password_1, password_2, token}){
            let response
            response = await axios.post("auth/sign-up/", {
                'email': email,
                'password_1': password_1,
                'password_2': password_2,
                'invite_token': token
            })
            if (!response){ throw Error }
            commit('setTokens', response.data.payload)
        },
        async signOut({commit}){
            await axios.delete("auth/sign-out/")
            commit('clearToken')
        },
        async refreshToken({commit}) {
            let response
            response = await axios.post("auth/refresh-token/", {'refresh_token': this.refreshToken})
            if (response){
                commit('setTokens', response.data.payload)
                return true
            }
        },
    }
}