import axios from 'axios'
import {Message, MessageBox} from "element-ui";
import store from '../store'

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 15000
})

service.interceptors.request.use(config => {
  return config
}, error => {
  Promise.reject(error)
})

service.interceptors.response.use(response => {
  const res = response.data
  if (res.code === 4) {
    
    MessageBox.alert('登录超时', '确定登出', {
      confirmButtonText: '确定',
      type: 'warning'
    }).then(() => {
      store.dispatch('FedLogOut').then(() => {
        location.reload()// 为了重新实例化vue-router对象 避免bug
      })
    })
    return 
  }
  
  if (res.code != 0) {
    Message({
      message: res.msg,
      type: 'error',
      duration:  1000
    });
    return Promise.reject(res.msg);
  }
  return res.data
}, error => {
    MessageBox.alert('登录超时', '确定登出', {
      confirmButtonText: '确定',
      type: 'warning'
    }).then(() => {
      store.dispatch('FedLogOut').then(() => {
        location.reload()// 为了重新实例化vue-router对象 避免bug
      })
    })
  return Promise.reject(error);
})

export default service
