import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'
import driver from './routes/driver'

import 'firebase/auth'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        pageTitle: 'Home',
        requiresAuth: true,
      },
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/user/Contact.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/Login.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/register',
      name: 'auth-register-v1',
      component: () => import('@/views/auth/Register.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/setting/Index.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/secret',
      name: 'secret',
      component: () => import('@/views/auth/Secret.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('@/views/auth/Logout.vue'),
    },
    ...driver,
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})
router.beforeEach((to, form, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = firebase.auth().currentUser
  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
