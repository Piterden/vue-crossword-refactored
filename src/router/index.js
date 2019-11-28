import Vue from 'vue'
import VueRouter from 'vue-router'

import { Builder } from '@/pages'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes: [
    {
      path: '/',
      redirect: 'builder',
    },
    {
      path: '/builder',
      component: Builder,
    },
  ],
})

export { router }
