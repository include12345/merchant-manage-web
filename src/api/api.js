import request from '@/utils/request'
// import file from '@/utils/file'

import md5 from 'js-md5'
import {getToken} from '@/utils/auth'

export function login(username, password) {
  const salt = '78683a7a-f258-11e5-ab7f-00163e0043c9';
  // password = md5(password+salt);
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
    url: '/api/merchant/consumer/listMerchantConsumerPaging',
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
    url: '/api/merchant/consumer/deleteMerchantConsumer/'+id,
    method: 'delete',
    params: {},
    headers:{
      "token": getToken()
    }
  })
}

export function addConsumer(form) {
  return request({
    url: '/api/merchant/consumer/addMerchantConsumer',
    method: 'post',
    data: {
      "name":form.consumerName,
      "cellphone": form.consumerCellphone,
      "email":form.consumerEmail,
      "wechat":form.consumerWechat
    },
    headers:{
      "token": getToken()
    }
  })
}

export function updateConsumer(id, form) {
  return request({
    url: '/api/merchant/consumer/updateMerchantConsumer',
    method: 'post',
    data: {
      "id":id,
      "name":form.consumerName,
      "cellphone": form.consumerCellphone,
      "email":form.consumerEmail,
      "wechat":form.consumerWechat
    },
    headers:{
      "token": getToken()
    }
  })
}



export function getConsumer(id) {
  return request({
    url: '/api/merchant/consumer/getMerchantConsumer',
    method: 'get',
    params: {
      "consumerId":id
    },
    headers:{
      "token":getToken()
    }
  })
}


export function listProductPaging(form) {
  return request({
    url: '/api/merchant/product/listMerchantProductPaging',
    method: 'get',
    params: {
      "name":form.name,
      "industryId": form.industryId,
      "status": form.status,
      "pageNo":form.pageNo-1,
      "pageSize":form.pageSize
    },
    headers:{
      "token": getToken()
    }
  })
}


export function deleteProduct(id) {
  return request({
    url: '/api/merchant/product/deleteMerchantProduct/'+id,
    method: 'delete',
    params: {},
    headers:{
      "token": getToken()
    }
  })
}

export function addProduct(form) {
  return request({
    url: '/api/merchant/product/addMerchantProduct',
    method: 'post',
    data: {
      "name":form.name,
      "priority":form.priority,
      "originalPrice": form.originalPrice,
      "price":form.price,
      "count":form.count,
      "image":form.image,
      "context":form.context,
      "industryId":form.industryId
    },
    headers:{
      "token": getToken()
    }
  })
}


export function updateProduct(id, form) {
  return request({
    url: '/api/merchant/product/updateMerchantProduct',
    method: 'post',
    data: {
      "id":id,
      "name":form.name,
      "originalPrice": form.originalPrice,
      "priority":form.priority,
      "status":form.status,
      "price":form.price,
      "count":form.count,
      "image":form.image,
      "context":form.context,
      "industryId":form.industryId
    },
    headers:{
      "token": getToken()
    }
  })
}



export function getProduct(id) {
  return request({
    url: '/api/merchant/product/getMerchantProduct',
    method: 'get',
    params: {
      "productId":id
    },
    headers:{
      "token":getToken()
    }
  })
}

export function listIndustrys() {
  return request({
    url: '/api/industry/listIndustryAll',
    method: 'get',
    headers:{
      "token":getToken()
    }
  })
}


// export function editMerchantConsumerWallet(json) {
//   return request({
//     url: '/api/merchant/consumer/rechargeMerchantConsumerBalance',
//     method: 'post',
//     data: {
//       "consumerId": json.consumerId,
//       "walletId": json.walletId,
//       "amount": json.amount,
//       "remark": json.remark
//     },
//     headers:{
//       "token":getToken()
//     }
//   })
// }



// export function listConsumerWalletTransactionPaging(form) {
//   return request({
//     url: '/api/merchant/listConsumerWalletTransactionPaging/'+ form.consumerId,
//     method: 'get',
//     params: {
//       "pageNo":form.pageNo-1,
//       "pageSize":form.pageSize
//     },
//     headers:{
//       "token": getToken()
//     }
//   })
// }


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

export function fileUpload(formData) {
  return request({
    url: '/file/uploadPicture',
    method: 'post',
    data: formData,
    headers:{
      "Content-Type":'multipart/form-data'
    }
  })
}


        
