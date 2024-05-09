import axios from "axios";

export default {
    state: {
        podcasts: null,
        breadcrumbs: [
            {"title": "Home", "route": null},
        ]
    },
    mutations: {
        setPodcasts(state, podcasts){
            state.podcasts = podcasts
        },
        setBreadcrumbs(state, breadcrumbs){
            state.breadcrumbs = breadcrumbs
        }
    },
    getters: {
        podcasts: s => s.podcasts,
        breadcrumbs: s => s.breadcrumbs,

    },
    actions: {
        async getPodcasts({commit}) {
            const response = await axios.get(`podcasts/`, )
            if (response){
                commit('setPodcasts', response.data.payload)
                return response.data.payload
            }
        },
        async getPodcastDetails({commit}, podcastID) {
            console.log(commit)
            const response = await axios.get(`podcasts/${podcastID}/`, )
            if (response){
                return response.data.payload
            }
        },
        async getEpisodes({commit}, {podcastID, offset}) {
            console.log(commit)
            const response = await axios.get(`podcasts/${podcastID}/episodes/`, {params: {"limit": 20, "offset": offset}} )
            if (response){
                return {
                    items: response.data.payload.items,
                    hasNext: response.data.payload.has_next,
                }
            }
        },
        async getEpisodeDetails({commit}, episodeID) {
            console.log(commit, episodeID)
            const response = await axios.get(`episodes/${episodeID}/`, )
            if (response){
                return response.data.payload
            }
        },
    }
}
