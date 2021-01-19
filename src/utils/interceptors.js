import axios from 'axios';
import store from '@/store'
import config from "@/config";
import router from "@/router";

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

                    store
                        .dispatch('refreshToken')
                        .then(() => { return axios.request(error.config)})
                        .catch(() => { return router.push("/sign-in?message=session-expired")})
                }
                else {
                    router.push("/sign-in?message=session-expired").then(() => {})
                }
            }
            return Promise.reject(error);
        }
    );
}
