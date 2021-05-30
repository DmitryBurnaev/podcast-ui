import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import podcasts from './podcasts'
import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        error: null,
        me: null,
        globalLoading: true,
        sidebarIsOpen: false
    },
    mutations: {
        setError(state, error){
            state.error = error;
        },
        clearError(state){
            state.error = null;
        },
        setMe(state, me){
            state.me = me
        },
        setLoading(state, isLoading){
            state.globalLoading = isLoading
        },
        setSidebarOpen(state, navbarIsOpen){
            state.sidebarIsOpen = navbarIsOpen
        }
    },
    getters: {
        error: s => s.error,
        me: s => s.me,
        globalLoading: s => s.globalLoading,
        sidebarIsOpen: s => s.sidebarIsOpen,
    },
    actions: {
        async getMe({commit, state}) {
            console.log("Getting 'me'...")
            if (state.me){ console.log("Me from store..."); return state.me }

            console.log("Going to get 'me' from server...")
            commit('setLoading', true)
            const response = await axios.get('auth/me/', )
            if (response && response.data.status === 'OK'){
                commit('setMe', response.data.payload)
                commit('setLoading', false)
                return response.data.payload
            }
        },

    },
    modules: {auth, podcasts}
})