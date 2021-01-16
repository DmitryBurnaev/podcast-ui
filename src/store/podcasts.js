import axios from "axios";
import config from "@/config";

export default {
    state: {
        podcasts: null
    },
    mutations: {
        setPodcasts(state, podcasts){
            state.podcasts = podcasts
        }
    },
    getters: {
        podcasts: s => s.podcasts,
    },
    actions: {
        async getPodcasts({dispatch, commit, state}) {
            console.log(dispatch)
            let response
            try {
                //TODO:
                //  1. use localstorage
                //  2. use interceptors
                response = await axios.get(config.apiURL + "podcasts/", {headers: {'Authorization': `Bearer ${state.accessToken}`}})
            } catch (err) {
                commit('setError', err.response.data)
                return false
            }
            console.log("Save podcast list", response)
            commit('setPodcasts', response.data)
            return true
        },

    }
}