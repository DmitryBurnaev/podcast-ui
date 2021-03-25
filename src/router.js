import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {layout: 'main', auth: true},
    component: () => import('./views/Home.vue')
  },
  {
    path: '/sign-in',
    name: 'signIn',
    meta: {layout: 'auth'},
    component: () => import('./views/SignIn.vue')
  },
  {
    path: '/sign-up',
    name: 'signUp',
    meta: {layout: 'auth'},
    component: () => import('./views/SignUp.vue')
  },
  {
    path: '/progress',
    name: 'progress',
    meta: {layout: 'main', auth: true},
    component: () => import('./views/Progress.vue')
  },
  {
    path: '/podcasts',
    name: 'podcastList',
    meta: {layout: 'main', auth: true},
    component: () => import('./views/PodcastList.vue')
  },
  {
    path: '/podcasts/:id',
    name: 'podcastDetails',
    meta: {layout: 'main', auth: true},
    props: true,
    component: () => import('./views/PodcastDetails.vue')
  },
  {
    path: '/podcasts/:podcastID/episodes/:episodeID',
    name: 'episodeDetails',
    meta: {layout: 'main', auth: true},
    component: () => import('./views/EpisodeDetails.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'nav-item active',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const signInRequired = to.matched.some(record => record.meta.auth)

  if (signInRequired) {
    console.log("=> signInRequired ->")
    store.dispatch('getMe').then(() => {
      console.log('ME was given | all-right! go to the next page: ', `${from.path} -> ${to.path}`)
      next()
    })
  } else {
    console.log('router.beforeEach | all-right! go to the next page: ', `${from.path} -> ${to.path}`)
    next()
  }
  // todo: redirect from sign-in if token exists
})
export default router
