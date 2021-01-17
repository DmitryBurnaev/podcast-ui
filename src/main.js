import Vue from 'vue'
import App from './App.vue'
import Vuelidate from "vuelidate"
import router from './router'
import store from '@/store'
import dateFilter from '@/filters/date.filter'
import messagePlugin from '@/utils/message.plugin'
import interceptorsSetup from '@/utils/interceptors'


Vue.config.productionTip = false
Vue.filter('date', dateFilter)
Vue.use(Vuelidate)
Vue.use(messagePlugin)
interceptorsSetup()

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
