import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from './main.vue'
import test_0 from './test_0.vue'
import test_1 from './test_1.vue'
import test_2 from './test_2.vue'
import test_3 from './test_3.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/test_0'
  },
  { path: '/test_0', component: test_0 },
  { path: '/test_1', component: test_1 },
  { path: '/test_2', component: test_2 },
  { path: '/test_3', component: test_3 },
]

const router = new VueRouter({
  routes
})

new Vue({
  render: h => h(Main),
  router
}).$mount('#app')
