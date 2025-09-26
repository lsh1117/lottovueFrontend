import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import DefaultLayout from '../components/layout/DefaultLayout.vue'

const routes = [
  {
    path: '/',
    redirect: "/home",
    component: DefaultLayout,
    children: [
      {
        path: 'home',
        name: 'HomeView',
        component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue'),
        meta: { hidden: true }
      },
      {
        path: 'gameResult',
        name: 'GameResultView',
        component: () => import(/* webpackChunkName: "gameResult" */ '../views/GameResultView.vue'),
        meta: { hidden: true }
      },
      {
        path: 'contact',
        name: 'ContactView',
        component: () => import(/* webpackChunkName: "contact" */ '../views/ContactView.vue'),
        meta: { hidden: true }
      },
      {
        path: 'statistics',
        name: 'StatisticsView',
        component: () => import(/* webpackChunkName: "statistics" */ '../views/StatisticsView.vue'),
        meta: { hidden: true }
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue'),
        meta: { hidden: true }
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(), 
  routes,
})

export default router
