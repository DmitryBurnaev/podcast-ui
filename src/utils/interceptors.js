import axios from 'axios';
import store from '@/store'
import config from "@/config";
import router from "@/router";
import app from '@/main'

axios.defaults.baseURL = config.apiURL


export default function setup() {
    console.log(`interceptor | setup`)
    axios.interceptors.request.use(
        (config) => {
            console.log(`interceptor | request`)
            const token = store.getters.accessToken;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                delete config.headers.Authorization
            }
            return config;
        }
    );
    axios.interceptors.response.use(
        (response) => {return response},
        (error) => {
            console.log(`interceptor | ${error}`)
            const status = error.response ? error.response.status : null
            if (status === 401) {
                if (error.response.data.details.includes("Signature has expired")) {
                    console.log("interceptor | refresh", store.getters.refreshToken)
                    axios
                        .post("auth/refresh-token/", {'refresh_token': store.getters.refreshToken})
                        .then((response) => {
                            console.log('interceptor | token refreshed. response:', response)
                            store.commit('setTokens', response.data)
                            return axios.request(error.config)
                        })
                        .catch((error) => {
                            console.log('interceptor | catch err:', error)
                            router.push({name: 'signIn', query: {'message': 'session-expired'}}).then(() => {})
                        })
                }
                else {
                    router.push({name: 'signIn', query: {'message': 'need-sign-in'}}).then(() => {})
                }
            }
            if (error.response){
                store.commit('setError', error.response.data)
                app.$message({type: 'warning', message: error.response.data.details});
                // console.error("Catch error response: ", error.response.data)
            } else {
                store.commit('setError', error.toString())
                app.$message({type: 'warning', message: `Catch unknown error: ${error}`});
                //TODO: use Vue.$error instead ?!
                // console.error("Catch error response: ", error)
            }
            return null
        }
    );
}
