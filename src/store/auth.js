import axios from "axios";
import config from "@/config";

export default {
    actions: {
        async signIn({dispatch}, {email, password}) {
            console.log(dispatch)
            const url = config.apiURL + "auth/sign-in/"
            try {
                console.log("Send sign-in request... ")
                let response = await axios.post(url, {'email': email, 'password': password})
                console.log(response)
                return true
            } catch (err) {
                if (err.response) {
                   console.log(err.response.status)
                   console.log(err.response.data)
                }
                return false
            }
        },
        async signUp({dispatch}, {email, password_1, password_2, token}){
            console.log(dispatch)
            const url = config.apiURL + "auth/sign-up/"
            try {
                console.log("Send sign-up request... ")
                const payload = {
                    'email': email,
                    'password_1': password_1,
                    'password_2': password_2,
                    'invite_token': token
                }
                let response = await axios.post(url, payload)
                console.log(response)
                return true
            } catch (err) {
                if (err.response) {
                   console.log(err.response.status)
                   console.log(err.response.data)
                }
                return false
            }
        },
        async signOut(){
            const url = config.apiURL + "auth/sign-out/"
            let response = await axios.get(url)
            console.log(response)
        }
    }
}