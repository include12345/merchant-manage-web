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

export function getInfo(token) {
  return request({
    url: '/user/getMenus',
    method: 'get',
    params: {token}
  })
}






export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'get',
    params: {token}
  })
}


export function getArticleList(form) {
  return request({
    url: '/blog/listBlog',
    method: 'post',
    data: {
      "page":form.page,
      "pageSize":form.pageSize
    },
    headers:{
      "token":getToken()+'-'+'getArticleList'
    }
  })
}


export function removeOneArticle(id) {
  return request({
    url: '/api/blog/deleteBlog',
    method: 'get',
    params: {id},
    headers:{
      "token":getToken()+'-'+'deleteBlog'
    }
  })
}

export function getOneArticle(id) {
  return request({
    url: '/blog/getBlog',
    method: 'get',
    params: {id},
    headers:{
      "token":getToken()+'-'+'getOneArticle'
    }
  })
}
export function createArticle(param) {
  return request({
    url: '/api/blog/createBlog',
    method: 'post',
    data: param,
    headers:{
      "token":getToken()+'-'+'createBlog'
    }
  })
}

export function editArticle(param) {
  return request({
    url: '/api/blog/updateBlog',
    method: 'post',
    data: param,
    headers:{
      "token":getToken()+'-'+'updateBlog'
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


        
