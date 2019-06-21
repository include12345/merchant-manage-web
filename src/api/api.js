import request from '@/utils/request'
// import file from '@/utils/file'

import md5 from 'js-md5'
import {getToken} from '@/utils/auth'

export function login(username, password) {
  const salt = '78683a7a-f258-11e5-ab7f-00163e0043c9';
  password = md5(password+salt);
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      'username':username,
      'password':password
    }
  })
}

export function checkToken() {
  return request({
    url: '/user/api/check',
    method: 'get',
    headers:{
      "token":getToken()
    }
    // params: {token}
  })
}






export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'get',
    params: {token}
  })
}


export function listMerchantConsumerPaging(form) {
  return request({
    url: '/api/merchant/listMerchantConsumerPaging',
    method: 'get',
    params: {
      "name":form.name,
      "cellphone": form.cellphone,
      "pageNo":form.pageNo-1,
      "pageSize":form.pageSize
    },
    headers:{
      "token": getToken()
    }
  })
}


export function deleteMerchantConsumer(id) {
  return request({
    url: '/api/merchant/deleteMerchantConsumer/'+id,
    method: 'delete',
    params: {},
    headers:{
      "token": getToken()
    }
  })
}

export function addMerchantConsumer(form) {
  return request({
    url: '/api/merchant/addMerchantConsumer',
    method: 'post',
    data: {
      "name":form.name,
      "cellphone": form.cellphone,
      "email":form.email,
      "wechat":form.wechat
    },
    headers:{
      "token": getToken()
    }
  })
}

export function getMerchantConsumer(id) {
  return request({
    url: '/api/merchant/getMerchantConsumer',
    method: 'get',
    params: {
      "consumerId":id
    },
    headers:{
      "token":getToken()
    }
  })
}

export function editMerchantConsumerWallet(json) {
  return request({
    url: '/api/merchant/editMerchantConsumerWallet',
    method: 'post',
    data: json,
    headers:{
      "token":getToken()
    }
  })
}

export function getClassify() {
  return request({
    url: '/blog/getClassify',
    method: 'get',
    headers:{
      "token":getToken()+'-'+'getClassify'
    }
  })
}


export function getFileUploadToken(filename, size) {
  return request({
    url: '/file/uploadPictureToken',
    method: 'get',
    params: {filename, size},
    headers:{
      "token":getToken()+'-'+'uploadPictureToken'
    }
  })
}

// export function fileUpload(formData) {
//   return file({
//     url: '/api/alien/upload',
//     method: 'post',
//     data: formData,
//     headers:{
//       "Content-Type":'multipart/form-data'
//     }
//   })
// }


        
