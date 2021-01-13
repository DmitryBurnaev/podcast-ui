import axios from "axios";
import config from "@/config";

export default {
    actions: {
        async signIn({dispatch, commit}, {email, password}) {
            console.log(dispatch, commit)
            const url = config.apiURL + "auth/sign-in/"
            try {
                console.log("Send sign-in request... ", email, password)
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
        }
    }
}