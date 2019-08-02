import Vue from 'vue';
import Router from 'vue-router';
import Layout from './views/Layout.vue';
import Wallet from './views/Wallet.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout,
    },
    {
      path: '/balance',
      name: 'balance',
      component: Wallet,
    },
    {
      path: '/wallet',
      name: 'wallet',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Wallet.vue'),
    },
  ],
});
