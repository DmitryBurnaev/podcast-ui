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
    path: '/podcasts/create',
    name: 'podcastCreate',
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
  {
    path: '/podcasts/:podcastID/playlist',
    name: 'playlist',
    meta: {layout: 'main', auth: true},
    component: () => import('./views/Playlist.vue')
  },
  {
    path: '/404',
    name: 'notFound',
    meta: {layout: 'auth', auth: false},
    component: () => import('./views/PageNotFound.vue')
  },
  {
    path: '*',
    name: 'other',
    meta: {layout: 'auth', auth: false},
    component: () => import('./views/PageNotFound.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'nav-item active',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  console.log("router:", `${from.path} -> ${to.path}`)
  const signInRequired = to.matched.some(record => record.meta.auth)
  // const accessToken = store.getters.accessToken;
  const idsFields = ['id', 'podcastID', 'episodeID']
  if (to.params){
    for (let field in to.params){
      if (idsFields.includes(field) && isNaN(to.params[field])){
        next({name: 'notFound'})
        return
      }
    }
  }

  if (signInRequired) {
    store.dispatch('getMe').then(() => {
      console.log('ME was given | all-right! go to the next page: ', `${from.path} -> ${to.path}`)
      next()
    })
  }
  else {
    console.log('router.beforeEach | no signInRequired go to the next page: ', `${from.path} -> ${to.path}`)
    next()
  }
})
export default router
