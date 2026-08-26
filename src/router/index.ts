import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import { isAuthenticated } from '../services/storage';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        component: () => import('@/views/HomePage.vue')
      },
      {
        path: 'sobre',
        component: () => import('@/views/AboutPage.vue')
      },
    ]
  },
  { path: '/login', component: () => import('@/views/LoginPage.vue') },
  { path: '/cadastro', component: () => import('@/views/RegisterPage.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
router.beforeEach(async (to) => {
  if (to.path.startsWith('/tabs') && !(await isAuthenticated())) return '/login';
  if ((to.path === '/login' || to.path === '/cadastro') && await isAuthenticated()) return '/tabs/home';
  return true;
});

export default router
