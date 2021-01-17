import axios from 'axios';
import store from '@/store'


export default function setup() {
    axios.interceptors.request.use(function(config) {
        const token = store.getters.accessToken;
        console.log("interceptors", store.getters.accessToken)
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, function(err) {
        return Promise.reject(err);
    });
}