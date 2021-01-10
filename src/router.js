import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    meta: {layout: 'auth'},
    component: () => import('./views/SignIn.vue')
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    meta: {layout: 'auth'},
    component: () => import('./views/SignUp.vue')
  },
  {
    path: '/progress',
    name: 'Progress',
    meta: {layout: 'main'},
    component: () => import('./views/Progress.vue')
  },
  {
    path: '/podcasts',
    name: 'PodcastList',
    meta: {layout: 'main'},
    component: () => import('./views/PodcastList.vue')
  },
  {
    path: '/podcasts/:id',
    name: 'PodcastList',
    meta: {layout: 'main'},
    props: true,
    component: () => import('./views/PodcastDetails.vue')
  },
  {
    path: '/episodes/:id',
    name: 'EpisodeDetails',
    meta: {layout: 'main'},
    component: () => import('./views/EpisodeDetails.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
