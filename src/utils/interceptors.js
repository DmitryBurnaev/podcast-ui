import axios from 'axios';
import store from '@/store'


export default function setup() {
    axios.interceptors.request.use(function(config) {
        const token = store.getters.accessToken;
        if(token) {
            console.log("interceptors", token)
            config.headers.Authorization = `Bearer ${token}`;
        }else {
            console.log("interceptors: remove token")
            delete config.headers.Authorization
        }
        return config;
    }, function(err) {
        return Promise.reject(err);
    });
}