import axios from "axios";

export default {
    state: {
        podcasts: null,
        // todo: use this for:
        //  - committing actual breadcrumbs,
        //  - drawing main breadcrumbs,

        breadcrumbs: [{"title": "Podcasts", "url": "podcasts/"}]
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
        async getPodcasts({commit}) {
            const response = await axios.get(`podcasts/`, )
            if (response){
                commit('setPodcasts', response.data)
                return response.data
            }
        },
        async getPodcastDetails({commit}, podcastID) {
            console.log(commit)
            const response = await axios.get(`podcasts/${podcastID}/`, )
            if (response){
                return response.data
            }
        },
        async getEpisodes({commit}, podcastID) {
            console.log(commit)
            const response = await axios.get(`podcasts/${podcastID}/episodes/`, )
            if (response){
                return response.data
            }
        },
        async getEpisodeDetails({commit}, episodeID) {
            console.log(commit, episodeID)
            const response = await axios.get(`episodes/${episodeID}/`, )
            if (response){
                return response.data
            }
        },
    }
}