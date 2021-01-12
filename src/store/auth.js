export default {
    actions: {
        async signIn({dispatch, commit}, {email, password}) {
            console.log(dispatch, commit)
            try {
                console.log("Send sign-in request... ", email, password)
            } catch (e) {
                console.error("Catch error:", e)
            }
        }
    }
}