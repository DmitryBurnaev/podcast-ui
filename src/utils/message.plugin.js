import app from "@/main";

export default {
    install(Vue){
        Vue.prototype.$message = function (msg){
            app.$message({type: 'success', message: msg});
        }
        Vue.prototype.$error = function (msg){
            app.$message({type: 'error', message: msg});
        }
    }
}