import Vue from 'vue'
import App from './App.vue'
import Vuelidate from "vuelidate"
import router from './router'
import store from '@/store'
import interceptorsSetup from '@/utils/interceptors'
import {dateFilter, sizeFilter, audioLengthFilter, humanStatusFilter, cutString} from "@/utils/filters";
import {Dialog, Form, FormItem, Input, Button, Switch, MessageBox, Message, Upload, Select, Option} from 'element-ui';

Vue.component(Dialog.name, Dialog);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Button.name, Button);
Vue.component(Switch.name, Switch);
Vue.component(Upload.name, Upload);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message

Vue.config.productionTip = false
Vue.filter('date', dateFilter)
Vue.filter('size', sizeFilter)
Vue.filter('length', audioLengthFilter)
Vue.filter('status', humanStatusFilter)
Vue.filter('cut', cutString)
Vue.use(Vuelidate)
interceptorsSetup()

const app = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

export default app
