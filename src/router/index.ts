import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Login from '../view/Login.vue';
import Home from '../view/home/index.vue';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      keepAlive: false,
    },
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      keepAlive: true,
      title: '',
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
