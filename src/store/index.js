import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import podcasts from './podcasts'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        error: null
    },
    mutations: {
        setError(state, error){
            state.error = error;
        },
        clearError(state){
            state.error = null;
        },
        // setTokens(state, response){
        //     state.authToken = response.token
        //     state.refreshToken = response.refresh_token
        // }
    },
    getters: {
        error: s => s.error,
        // authToken: s => s.authToken,
        // refreshToken: s => s.refreshToken,
    },
    actions: {},
    modules: {auth, podcasts}
})