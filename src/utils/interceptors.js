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
                    let requestCanceled = false;
                    return axios
                        .post("auth/refresh-token/", {'refresh_token': store.getters.refreshToken})
                        .then((response) => {
                            console.log('interceptor | token refreshed. response:', response)
                            store.commit('setTokens', response.data)
                            if (error.config.method === 'get') {
                                return axios.request(error.config)
                            } else {
                                // we have to prevent non-get requests (because there are various callbacks)
                                app.$message({type: 'warning', message: 'Please, retry your action', showClose: true});
                                requestCanceled = true
                            }
                        })
                        .catch((error) => {
                            console.log('interceptor | catch err:', error)
                            router.push({name: 'signIn', query: {'message': 'session-expired'}}).then(() => {})
                        }).finally( () => {
                            if (requestCanceled){
                                throw error
                            }
                        })
                }
                else {
                    router.push({name: 'signIn', query: {'message': 'need-sign-in'}}).then(() => {})
                }
            } else {
                let errorMessage;
                if (error.response){
                    errorMessage = error.response.data.details || error.response.data
                } else {
                    errorMessage = error.toString()
                }
                app.$message({type: 'error', message: errorMessage, showClose: true});
            }
            return null
        }
    );
}
