// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VCharts from 'v-charts'
import '@/styles/index.scss' // global css
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import App from './App'
import router from './router'
import store from './store'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import {Toast, Indicator, Lazyload} from 'mint-ui'



import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, {locale})
Vue.use(VCharts)
Vue.use(mavonEditor);
Vue.use(Mint)

Vue.use(Lazyload, {
  preLoad: 1.3,
  attempt: 1
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
