import Vue from 'vue'
import Router from 'vue-router'
import Himnario from './views/Himnario.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'himnario',
      component: Himnario
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
