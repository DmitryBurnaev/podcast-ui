export default {
    install(Vue){
        Vue.prototype.$message = function (msg){
            console.log("[MESSAGE]: " + msg)
        }
        Vue.prototype.$error = function (msg){
            console.warn("[ERROR]: " + msg)
        }
    }
}