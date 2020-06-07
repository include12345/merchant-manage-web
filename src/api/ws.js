import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import {MessageBox} from "element-ui";
import store from '../store'
import {getToken} from '@/utils/auth'
import {uuidv4} from '@/utils/toolUtil'


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
            headers['token'] = getToken().token
            this.webSocket.unsubscribe()
            this.webSocket.disconnect(() => {}, headers)
            this.webSocket = null
        }
    },

    subscribe() {
        let sockJs = new SockJS('/websocketchat')
        this.webSocket = Stomp.over(sockJs)
        const headers = {}
        headers['token'] = getToken().token
        this.webSocket.connect(headers, function() {
            connectCallback()
        }, function() {
            errorCallback()
        })
    },

    connectCallback() {
        store.commit('SET_CONNECTED', true)
        this.webSocket.subscribe('/user/' + getToken().username + '/chat', function(response) {
            if(response.body && response.body.data) {
                let message = JSON.parse(res.body.data)
                onMessage(message)
            } else {
                errorCallback()
            }
        })
        resendAllMsg()
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
        let type = message.MessageTypeEnum
        switch(type) {
            case 'DELETE_FRIEND':
                store.commit('DELETE_FRIEND', message)
                return
            case 'ADD_FRIEND':
                store.commit('ADD_REQ_CONTACT', message.from)
                return
            case 'MEDIA':
                store.dispatch('onMessage', {message})
                return
            case 'SMS':
                store.dispatch('onMessage', {message})
                return
            case 'PUSH_OUT':
                this.onPushOut()
                return
            case 'DEAL_ADD_FRIEND_REQ':
                return
            case 'ACCEPTED_FRIEND_REQ':
                store.commit('ACCEPTED_FRIEND_REQ', message)
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

    createMessage({content, session, data, duration}) {
        const message = {
            id: 'm_' + uuidv4(),
            from: getToken().username,
            isMe: true,
            to: session.from,
            content,
            remark: session.remark,
            timestamp: Date.now(),
            MessageTypeEnum: duration ? 'MEDIA': 'SMS',
            data,
            duration,
            sent: false,
            timeout: false
        }
        if(!store.getters.lostConnect) {
            if(duration) {
                this.webSocket.send('/voiceNotify', {}, JSON.stringify(message))
            } else {
                this.webSocket.send('/notify', {}, JSON.stringify(message))
            }
            message.sent = true
        } else {
            store.commit('ADD_UN_SEND_MSG', message)
        }
    },

    resend(message) {
        store.commit('SET_MESSAGE_TIMEOUT', {id: message.id, timeout: false, timestamp: Date.now()})
        if(!store.getters.lostConnect) {
            if(message.duration) {
                this.webSocket.send('/voiceNotify', {}, JSON.stringify(message))
            } else {
                this.webSocket.send('/notify', {}, JSON.stringify(message))
            }
            message.sent = true
        } else {
            store.commit('ADD_UN_SEND_MSG', message)
        }
    },
    remarkHasRead(friendName) {
        let username = getToken().username
        let param = {from:friendName, to: username, MessageTypeEnum: 'HAS_READ'}
        this.webSocket.send('/notify', {}, JSON.stringify(param))
    },

    resendAllMsg() {
        let messages = store.getters.unSendMsg
        if(messages.length > 0) {
            for(let i = messages.length -1; i >= 0; i--) {
                let message = messages[i]
                if(Date.now() - message.timestamp > 60000) {
                    store.commit('SET_MESSAGE_TIMEOUT', {id: message.id, timeout: true})
                    store.commit('REMOVE_UNSENT_MESSAGE', i)
                    continue
                }
                if(store.getters.connected) {
                    if(message.duration) {
                        this.webSocket.send('/voiceNotify', {}, JSON.stringify(message))
                    } else {
                        this.webSocket.send('/notify', {}, JSON.stringify(message))
                    }
                    store.commit('SET_MESSAGE_SENT', message.id)
                    store.commit('REMOVE_UNSENT_MESSAGE', i)
                    continue
                }
                break
            }
        }
    }
    
}

export default ws


