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
      "token":getToken().token
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
      "token": getToken().token
    }
  })
}


export function deleteMerchantConsumer(id) {
  return request({
    url: '/api/merchant/consumer/deleteMerchantConsumer/'+id,
    method: 'delete',
    params: {},
    headers:{
      "token": getToken().token
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
      "token": getToken().token
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
      "token": getToken().token
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
      "token":getToken().token
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
      "token": getToken().token
    }
  })
}


export function deleteProduct(id) {
  return request({
    url: '/api/merchant/product/deleteMerchantProduct/'+id,
    method: 'delete',
    params: {},
    headers:{
      "token": getToken().token
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
      "token": getToken().token
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
      "token": getToken().token
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
      "token":getToken().token
    }
  })
}

export function listIndustrys() {
  return request({
    url: '/api/industry/listIndustryAll',
    method: 'get',
    headers:{
      "token":getToken().token
    }
  })
}


export function listMerchantOrderPaging(form) {
  return request({
    url: '/api/merchant/order/listMerchantOrderPaging',
    method: 'get',
    params: {
      "orderSn": form.orderSn,
      "name":form.name,
      "type": form.type,
      "status": form.status,
      "pageNo":form.pageNo-1,
      "pageSize":form.pageSize
    },
    headers:{
      "token": getToken().token
    }
  })
}

export function listOrderTransaction(orderId) {
  return request({
    url: '/api/merchant/order/listOrderTransaction',
    method: 'get',
    params: {
      "orderId":orderId
    },
    headers:{
      "token": getToken().token
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
      "token":getToken().token+'-'+'uploadPictureToken'
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


//friend
export function listFriends() {
  return request({
    url: '/friend/listFriends',
    method: 'get',
    headers:{
      "token": getToken().token
    }
  })
}


export function listFriendReq() {
  return request({
    url: '/friend/listFriendReq',
    method: 'get',
    headers:{
      "token": getToken().token
    }
  })
}


export function listUnReadMessages() {
  return request({
    url: '/record/listUnReadMessages',
    method: 'get',
    headers:{
      "token": getToken().token
    }
  })
}




export function searchFriend(friendName) {
  return request({
    url: '/friend/searchFriend',
    method: 'get',
    headers:{
      "token": getToken().token
    },
    params: {
      "friendName": friendName
    }
  })
}

//添加好友请求
export function addFriendRequest(friendName) {
  return request({
    url: '/friend/addFriendRequest',
    method: 'post',
    headers:{
      "token": getToken().token
    },
    data: {
      "friendName": friendName
    }
  })
}
//处理好友请求
export function dealFriendReq(friendName, status) {
  return request({
    url: '/friend/dealFriendReq',
    method: 'post',
    headers:{
      "token": getToken().token
    },
    data: {
      "friendName": friendName,
      "isAgree": status
    }
  })
}
//删除好友
export function deleteFriend(friendName) {
  return request({
    url: '/friend/deleteFriend/'+ friendName,
    method: 'delete',
    headers:{
      "token": getToken().token
    }
  })
}
        
