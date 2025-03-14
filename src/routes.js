
import { createRouter, createWebHistory } from 'vue-router'
import {useAuthStore} from './store/auth'

const routes = [
  { path: '/', component: () => import('./pages/Home.vue'), meta: { requiresAuth: true } },
  { path: '/login', component: () => import('./pages/Login.vue'), meta: { requiresAuth: false } },
  { path: '/register', component: () => import('./pages/Register.vue'), meta: { requiresAuth: false } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const user = await authStore.checkUser()

  if (to.meta.requiresAuth && !user) {
    return '/login'
  }

  if (to.path === '/login' && user) {
    return '/'
  }
})

export default router
