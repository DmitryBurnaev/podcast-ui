import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {layout: 'main', auth: true},
    component: () => import('./views/Home')
  },
  {
    path: '/sign-in',
    name: 'signIn',
    meta: {layout: 'auth'},
    component: () => import('./views/SignIn')
  },
  {
    path: '/sign-up',
    name: 'signUp',
    meta: {layout: 'auth'},
    component: () => import('./views/SignUp')
  },
  {
    path: '/profile',
    name: 'profilePage',
    meta: {layout: 'main', auth: true},
    component: () => import('./views/ProfilePage')
  },
  {
    path: '/progress',
    name: 'progress',
    meta: {layout: 'main', auth: true},
    component: () => import('./views/ProgressPage')
  },
  {
    path: '/podcasts',
    name: 'podcastList',
    meta: {layout: 'main', auth: true},
    component: () => import('./views/PodcastList')
  },
  {
    path: '/podcasts/:id',
    name: 'podcastDetails',
    meta: {layout: 'main', auth: true},
    props: true,
    component: () => import('./views/PodcastDetails')
  },
  {
    path: '/podcasts/create',
    name: 'podcastCreate',
    meta: {layout: 'main', auth: true},
    props: true,
    component: () => import('./views/PodcastDetails')
  },
  {
    path: '/podcasts/:podcastID/episodes/:episodeID',
    name: 'episodeDetails',
    meta: {layout: 'main', auth: true},
    component: () => import('./views/EpisodeDetails')
  },
  {
    path: '/podcasts/:podcastID/playlist',
    name: 'playlist',
    meta: {layout: 'main', auth: true},
    component: () => import('./views/Playlist')
  },
  {
    path: '/podcasts/:podcastID/uploads',
    name: 'uploads',
    meta: {layout: 'main', auth: true},
    component: () => import('./views/Upload')
  },
  {
    path: '/404',
    name: 'notFound',
    meta: {layout: 'auth', auth: false},
    component: () => import('./views/PageNotFound')
  },
  {
    path: '*',
    name: 'other',
    meta: {layout: 'auth', auth: false},
    component: () => import('./views/PageNotFound')
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
