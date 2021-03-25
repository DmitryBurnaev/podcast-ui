import Vue from 'vue'
import App from './App.vue'
import Vuelidate from "vuelidate"
import router from './router'
import store from '@/store'
import interceptorsSetup from '@/utils/interceptors'
import {dateFilter, sizeFilter, audioLengthFilter, humanStatusFilter} from "@/utils/filters";
import { Dialog, Slider, Form, FormItem, Input, Button, Switch, MessageBox, Message, Progress } from 'element-ui';

Vue.component(Dialog.name, Dialog);
Vue.component(Slider.name, Slider);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Button.name, Button);
Vue.component(Switch.name, Switch);
Vue.component(Progress.name, Progress);

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message

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
Vue.filter('status', humanStatusFilter)
Vue.use(Vuelidate)
interceptorsSetup()

const app = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

export default app
