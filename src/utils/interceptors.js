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
            const errorStatus = error.response.data.status;
            if (status === 404 && errorStatus.startsWith('EXPECTED_')){
                console.log(`Detected ${errorStatus} for request. SKIP error`)
                return error.response
            }
            if (status === 401) {
                const errorMsg = error.response.data.payload.error;
                if (errorStatus === 'INVALID_PARAMS'){
                    app.$message({type: 'error', message: errorMsg, showClose: true});
                    return null
                }
                if (errorStatus === 'SIGNATURE_EXPIRED') {
                    console.log('SIGNATURE_EXPIRED: interceptor | refresh', store.getters.refreshToken)
                    let requestCanceled = false;
                    return axios
                        .post('auth/refresh-token/', {'refresh_token': store.getters.refreshToken})
                        .then((response) => {
                            console.log('interceptor | token refreshed. response:', response)
                            store.commit('setTokens', response.data.payload)
                            if (error.config.method === 'get') {
                                return axios.request(error.config)
                            } else {
                                // we have to prevent non-get requests (because there are various callbacks)
                                app.$message({type: 'warning', message: 'Please, retry your action', showClose: true});
                                requestCanceled = true
                            }
                        })
                        .catch((error) => {
                            console.log('interceptor | refresh-token | catch err:', error)
                            store.commit('clearToken')
                        }).finally( () => {
                            if (requestCanceled){
                                throw error
                            }
                        })
                }
                else {
                    store.commit('clearToken')
                    if (router.currentRoute.name !== 'signIn'){
                        router.push({name: 'signIn', query: {'message': 'need-sign-in'}}).then(() => {}).catch(() => {})
                    }
                }
            } else {
                let errorMessage;
                if (error.response){
                    try {
                        errorMessage = error.response.data.payload.error
                        store.commit('setError', error.response.data.payload)
                    } catch (e) {
                        errorMessage = 'Unexpected error happened'
                        console.error(`Unexpected response format`)
                    }
                } else {
                    errorMessage = error.toString()
                }
                if (typeof errorMessage === 'object'){
                    console.error('Couldn\'t request', errorMessage )
                    app.$message({type: 'error', message: 'Sorry... Request could not be processed', showClose: true});
                } else {
                    app.$message({type: 'error', message: errorMessage, showClose: true});
                }
                throw error
            }
            throw error
        }
    );
}
