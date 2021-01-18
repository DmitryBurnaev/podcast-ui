import axios from "axios";

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
        async getPodcasts({dispatch, commit}) {
            console.log(dispatch)
            let response
            try {
                response = await axios.get("podcasts/", )
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