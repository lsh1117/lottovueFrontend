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
        path: 'plan-upgrade',
        name: 'PlanUpgradeView',
        component: () => import(/* webpackChunkName: "planUpgrade" */ '../views/PlanUpgrade.vue'),
        meta: { hidden: true }
      },
      {
        path: 'terms',
        name: 'TermsView',
        component: () => import(/* webpackChunkName: "terms" */ '../views/TermsView.vue'),
        meta: { hidden: true }
      },
      {
        path: 'privacy-policy',
        name: 'PrivacyPolicyView',
        component: () => import(/* webpackChunkName: "privacyPolicy" */ '../views/PrivacyPolicyView.vue'),
        meta: { hidden: true }
      },
      {
        path: 'my-winning-number',
        name: 'MyWinningNumberView',
        component: () => import(/* webpackChunkName: "myWinningNumber" */ '../views/MyWinningNumberView.vue'),
        meta: { hidden: true }
      },
      {
        path: 'notice/list',
        name: 'NoticeListView',
        component: () => import(/* webpackChunkName: "noticeList" */ '../views/NoticeListView.vue'),
        meta: { hidden: true }
      },
      {
        path: 'notice/:noticeId',
        name: 'NoticeDetailView',
        component: () => import(/* webpackChunkName: "noticeDetail" */ '../views/NoticeDetailView.vue'),
        meta: { hidden: true }
      },
      {
        path: 'inquiry/list',
        name: 'InquiryListView',
        component: () => import(/* webpackChunkName: "inquiryList" */ '../views/InquiryListView.vue'),
        meta: { hidden: true }
      },
      {
        path: 'inquiry/create',
        name: 'InquiryCreateView',
        component: () => import(/* webpackChunkName: "inquiryCreate" */ '../views/InquiryCreateView.vue'),
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
