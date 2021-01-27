import Vue from 'vue'
import App from './App.vue'
import Vuelidate from "vuelidate"
import router from './router'
import store from '@/store'
import dateFilter from '@/filters/date.filter'
import messagePlugin from '@/utils/message.plugin'
import interceptorsSetup from '@/utils/interceptors'

// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main'


Vue.config.productionTip = false
Vue.filter('date', dateFilter)
Vue.use(Vuelidate)
Vue.use(messagePlugin)
Vue.use(LightBootstrap)
interceptorsSetup()

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
