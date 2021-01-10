import Vue from 'vue'
import App from './App.vue'
import router from './router'
import dateFilter from "@/filters/date.filter";

Vue.config.productionTip = false
Vue.filter('date', dateFilter)

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
