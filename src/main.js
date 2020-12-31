import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

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
