import Vue from 'vue'
import App from './App.vue'
import Vuelidate from "vuelidate"
import router from './router'
import store from '@/store'
import messagePlugin from '@/utils/message.plugin'
import interceptorsSetup from '@/utils/interceptors'
import {dateFilter, sizeFilter, audioLengthFilter} from "@/utils/filters";

// todo: is it necessary?!
// import '@/assets/js/core/jquery.min'
// import '@/assets/js/core/popper.min'
// import '@/assets/js/core/bootstrap.min'
// import '@/assets/js/plugins/perfect-scrollbar.jquery.min'
// import '@/assets/js/paper-dashboard'

Vue.config.productionTip = false
Vue.filter('date', dateFilter)
Vue.filter('size', sizeFilter)
Vue.filter('length', audioLengthFilter)
Vue.use(Vuelidate)
Vue.use(messagePlugin)
interceptorsSetup()

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
