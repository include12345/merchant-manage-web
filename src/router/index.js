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
    name: '会员管理',
    meta: {title: '会员管理', icon: 'example'},
    children: [{
      path: 'listConsumer',
      name: 'listConsumer',
      component: () => import('@/views/cmp/listConsumer'),
      meta: {title: '会员列表', icon: 'product-list'},
    },{
      path: 'consumer',
      name: 'consumer',
      component: () => import('@/views/cmp/consumer'),
      meta: {title: '会员添加', icon: 'product-list'},
      // hidden: true
    }]
  },
  {
    path: '/productmp',
    component: Layout,
    redirect: '/productmp/productmp',
    name: 'productmp',
    meta: {title: '商品管理', icon: 'example'},
    children: [{
      path: 'listProduct',
      name: 'listProduct',
      component: () => import('@/views/productmp/listProduct'),
      meta: {title: '商品列表', icon: 'product-list'},
    },{
      path: 'addProduct',
      name: 'addProduct',
      component: () => import('@/views/productmp/addProduct'),
      meta: {title: '商品添加', icon: 'product-list'},
    },{
      path: 'updateProduct',
      name: 'updateProduct',
      component: () => import('@/views/productmp/updateProduct'),
      meta: {title: '商品修改', icon: 'product-list'},
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
