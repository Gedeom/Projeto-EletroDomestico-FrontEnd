import Vue from 'vue'
import App from './App.vue'
import 'vuetify/dist/vuetify.css'
import '/src/assets/css/main.css'
import Vuetify from 'vuetify'
import router from './router'
import Axios from 'axios'
import store from './store'
import { Simplert } from 'vue2-simplert-plugin'
import 'vue2-simplert-plugin/dist/vue2-simplert-plugin.min.css'



router.beforeEach((to, from, next) => {
  let isLogado = localStorage.getItem('token') != null;
  console.log(isLogado);
  if (!isLogado && to.name != 'Login' && to.name != 'Cadastro') {
    next({name: 'Login'});
  }

  next();
});

Vue.prototype.$http = Axios;
Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
Vue.config.productionTip = false
Vue.use(Vuetify);
Vue.use(Simplert)

new Vue({
  vuetify: new Vuetify(),
  router,
  store,
  render: h => h(App)
}).$mount('#app')
