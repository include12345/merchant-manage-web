import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  // {path: '/cmp/consumer', component: () => import('@/views/cmp/consumer'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home'}
    }]
  },
  {
    path: '/cmp',
    component: Layout,
    redirect: '/cmp/listConsumer',
    name: 'cmp',
    meta: {title: '会员', icon: 'example'},
    children: [{
      path: 'listConsumer',
      name: 'listConsumer',
      component: () => import('@/views/cmp/listConsumer'),
      meta: {title: '会员管理', icon: 'product-list'},
    },{
      path: 'consumer',
      name: 'consumer',
      component: () => import('@/views/cmp/consumer'),
      meta: {title: '会员', icon: 'product-list'},
      hidden: true
    }]
  },
  {
    path: '/productmp',
    component: Layout,
    redirect: '/productmp/listProduct',
    name: 'productmp',
    meta: {title: '商品', icon: 'example'},
    children: [{
      path: 'listProduct',
      name: 'listProduct',
      component: () => import('@/views/productmp/listProduct'),
      meta: {title: '商品管理', icon: 'product-list'},
    },{
      path: 'product',
      name: 'product',
      component: () => import('@/views/productmp/product'),
      meta: {title: '商品', icon: 'product-list'},
      hidden: true
    }]
  },
  // {
  //   path: '/omp',
  //   component: Layout,
  //   redirect: '/omp/omp',
  //   name: 'omp',
  //   meta: {title: '订单管理', icon: 'example'},
  //   children: [{
  //     path: 'omp',
  //     name: 'omp',
  //     component: () => import('@/views/omp/index'),
  //     meta: {title: '订单列表', icon: 'product-list'}
  //   },{
  //     path: 'omp',
  //     name: 'omp',
  //     component: () => import('@/views/omp/index'),
  //     meta: {title: '订单列表', icon: 'product-list'}
  //   }]
  // },
  {path: '*', redirect: '/404', hidden: true}

]

export default new Router({
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
