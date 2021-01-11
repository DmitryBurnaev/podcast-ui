import Vue from 'vue'
import App from './App.vue'
import Vuelidate from "vuelidate";
import router from './router'
import dateFilter from "@/filters/date.filter";
import messagePlugin from "@/utils/message.plugin"


Vue.config.productionTip = false
Vue.filter('date', dateFilter)
Vue.use(Vuelidate)
Vue.use(messagePlugin)

new Vue({
  router,
  render: h => h(App),
  data: {
    podcastItems: [
      { title: 'Learn JavaScript' },
      { title: 'Learn Vue' },
      { title: 'Build something awesome' }
    ]
  }
}).$mount('#app')
