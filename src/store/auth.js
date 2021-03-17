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
        setTokens(state, response){
            console.log("setTokens", response)
            localStorage.setItem('accessToken', response.access_token)
            localStorage.setItem('refreshToken', response.refresh_token)
            state.accessToken = response.access_token
            state.refreshToken = response.refresh_token
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
            const response = await axios.post("auth/sign-in/", {'email': email, 'password': password})
            if (response){
                commit('setTokens', response.data)
            }
            return true
        },
        async signUp({dispatch, commit}, {email, password_1, password_2, token}){
            console.log(dispatch)
            let response
            const payload = {
                'email': email,
                'password_1': password_1,
                'password_2': password_2,
                'invite_token': token
            }
            response = await axios.post("auth/sign-up/", payload)
            if (response){
                commit('setTokens', response.data)
                return true
            }
            return false
            // try {
            //     const payload = {
            //         'email': email,
            //         'password_1': password_1,
            //         'password_2': password_2,
            //         'invite_token': token
            //     }
            //     response = await axios.post("auth/sign-up/", payload)
            //     if (response){
            //         commit('setTokens', response.data)
            //     }
            // } catch (err) {
            //     commit('setError', err.response.data)
            //     return false
            // }

            // return true
        },
        async signOut({commit}){
            try {
                await axios.delete("auth/sign-out/")
            } catch (err) {
                commit('setError', err.response.data)
            }
            commit('clearToken')
        },
        async refreshToken({dispatch, commit}) {
            console.log(dispatch)
            let response
            response = await axios.post("auth/refresh-token/", {'refresh_token': this.refreshToken})
            commit('setTokens', response.data)
            return true
        },
    }
}