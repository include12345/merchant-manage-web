import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { Notification } from 'element-ui';
import {getToken} from '@/utils/auth'
import {uuidv4} from '@/utils/toolUtil'

import store from '../store'

let ws = {
  webSocket: null,
  reconnecting: false,
  cleanId: -1,

  disconnect() {
      if (this.cleanId !== -1) {
          clearInterval(this.cleanId)
          this.cleanId = -1
      }
      if (this.webSocket && this.webSocket.connected) {
          const headers = {};
          // headers['token'] = getToken().token
          this.webSocket.unsubscribe()
          this.webSocket.disconnect(() => {}, headers)
          this.webSocket = null
      }
  },

  subscribe(username) {
      let sockJs = new SockJS(process.env.BASE_API +'/websocketchat')
      this.webSocket = Stomp.over(sockJs)
      const headers = {}
      // headers['token'] = 'getToken().token'
      let vm = this
      this.webSocket.connect(headers, function() {
        vm.connectCallback(username)
      }, function() {
        vm.errorCallback(username)
      })
  },

  connectCallback(username) {
      let vm = this
      vm.webSocket.subscribe('/user/'+username+'/chat', function(response) {
          console.log("response:" +JSON.stringify(response.body))
          if(response.body != null) {
            vm.onMessage(JSON.parse(response.body))
          } else {
            vm.errorCallback()
          }
      })
  },

  errorCallback() {
      if (!store.getters.expiredTime || store.getters.expiredTime < Date.now()) {
          return
      }
      store.commit('LOST_CONNECT', true)
      store.commit('SET_CONNECTED', false)
      this.checkUnsentMsgTimeout()
      if (this.cleanId === -1) {
          this.reconnect()
      }
  },

  checkUnsentMsgTimeout() {
      let messages = store.getters.unSendMsg
      if(messages.length > 0) {
          for(let i = messages.length - 1; i >= 0; i--) {
              let message = messages[i]
              if(Date.now() - message.timestamp > 60000) {
                  store.commit('SET_MESSAGE_TIMEOUT', {id: message.id, timeout: true})
                  store.commit('REMOVE_UNSENT_MESSAGE', i)
                  continue
              }
          }
      }
  },

  reconnect() {
      this.cleanId = setInterval(() => {
          if(this.reconnecting || this.cleanId === -1) {
              return
          }
          this.reconnecting = true
          store.dispatch('subscribe_msg', getToken().username).then(()=> {
              clearInterval(this.cleanId)
              this.cleanId = -1
              store.commit('LOST_CONNECT', false)
              store.dispatch('getContacts')
              store.dispatch('getUnReadMessage')
              this.reconnecting = false
          }).catch(() => {
              this.reconnecting = false
          }, 1000 * 5)
      })
  },

  onMessage(message) {
    console.log("message:" +JSON.stringify(message))
    // requestContact = JSON.parse(message)

      if (message.type == null) {
        this.errorCallback(message)
      }
      switch(message.type) {
          case 'DELETE_FRIEND':
              // store.commit('DELETE_FRIEND', message)
              return
          case 'ADD_FRIEND':
            // var requestContacts = []
            // requestContacts.push(requestContact)
            console.log("requestContact:"+message.from)
            // store.commit('SET_CONTACT', requestContacts)
            Notification({
                title: '好友添加请求',
                message: message.from+"请求添加好友",
                type: 'success',
                duration: 0
              });
              return;
            // store.dispatch("getContacts");
          case 'MEDIA':
              // store.dispatch('onMessage', {message})
              return
          case 'SMS':
            var loadMessage = JSON.parse(message.message)

            store.commit('GET_NEW_MESSAGE', loadMessage)
              return
          case 'PUSH_OUT':
              // this.onPushOut()
              return
          case 'DEAL_ADD_FRIEND_REQ':
            console.log("DEAL_ADD_FRIEND_REQ:"+message)
            Notification({
                title: '好友通过添加',
                message: friend.friendname+"通过您的好友添加",
                type: 'success',
                duration: 0
              });
            return
          case 'ACCEPTED_FRIEND_REQ':
            // var friend = JSON.parse(message.content)

            // Notification({
            //     title: '成功',
            //     message: friend.friendname+"通过您的好友添加",
            //     type: 'success'
            //   });
              // store.commit('ACCEPTED_FRIEND_REQ', message)
              return
          default:
              this.errorCallback(message)
              return
      }
  },

  onPushOut() {
      store.dispatch('LogOut')
      MessageBox.alert('登录超时', '确定登出', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      this.disconnect()
  },

  sendMessage(content, to) {
      const message = {
          messageId: 'm_' + uuidv4(),
          from: getToken().username,
          to: to,
          content: content,
          type: 'SMS',
          ctime: Date.now(),
          sent: false
      }
      if(!store.getters.lostConnect) {
          // if(duration) {
          //     this.webSocket.send('/voiceNotify', {}, JSON.stringify(message))
          // } else {
            console.log("chat:"+ JSON.stringify(message))
              this.webSocket.send('/chat', {}, JSON.stringify(message))
          // }
          message.sent = true
          store.commit('ADD_SEND_MSG', message)
      } else {
          store.commit('ADD_UN_SEND_MSG', message)
      }
  },

//   resend(content, to) {
//       store.commit('SET_MESSAGE_TIMEOUT', {id: message.id, timeout: false, timestamp: Date.now()})
//       if(!store.getters.lostConnect) {
//           if(message.duration) {
//               this.webSocket.send('/voiceNotify', {}, JSON.stringify(message))
//           } else {
//               this.webSocket.send('/notify', {}, JSON.stringify(message))
//           }
//           message.sent = true
//       } else {
//           store.commit('ADD_UN_SEND_MSG', message)
//       }
//   },
  remarkHasRead(friendName) {
      // let username = getToken().username
      let param = {from:friendName, to: getToken().username, type: 'HAS_READ'}
      console.log("param:"+param)
      this.webSocket.send('/chat', {}, JSON.stringify(param))
  },

//   resendAllMsg() {
//       let messages = store.getters.unSendMsg
//       if(messages.length > 0) {
//           for(let i = messages.length -1; i >= 0; i--) {
//               let message = messages[i]
//               if(Date.now() - message.timestamp > 60000) {
//                   store.commit('SET_MESSAGE_TIMEOUT', {id: message.id, timeout: true})
//                   store.commit('REMOVE_UNSENT_MESSAGE', i)
//                   continue
//               }
//               if(store.getters.connected) {
//                   if(message.duration) {
//                       this.webSocket.send('/voiceNotify', {}, JSON.stringify(message))
//                   } else {
//                       this.webSocket.send('/notify', {}, JSON.stringify(message))
//                   }
//                   store.commit('SET_MESSAGE_SENT', message.id)
//                   store.commit('REMOVE_UNSENT_MESSAGE', i)
//                   continue
//               }
//               break
//           }
//       }
//   }
  
}

export default ws
