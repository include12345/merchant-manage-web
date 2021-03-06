import Vue from 'vue'
import ws from  '@/utils/wsRequest'
import { listFriends, listFriendReq, listUnReadMessages, listMessages} from '@/api/api'
import {getToken} from '@/utils/auth'
import { Notification } from 'element-ui';

const param = {
    state: {

        consumer: {},
        sessions: {},
        currentSession: {},
        currentMessages: [],
        messages:{},
        unreadReqCount: 0,
        unreadMsgCount: 0,
        contacts: [],
        contactMsg:{},
        requestContacts:[],
        nearbyPeoples: [],
        active: 'message',
        currentFrom: null,
        lostConnect: true,
        unSendMsg:[],
        isAlertTips:false,
        gender: localStorage.gender || null,
        endTime: Date.now()
    },

    mutations: {
        SET_CONSUMER: (state, consumer) => {
            state.consumer = consumer
        },
        SET_ACTIVE: (state, active) => {
            state.active = active
        },
        SET_LOSTCONNECT: (state, lostConnect) => {
            console.log("lostConnect:" + lostConnect)
            state.lostConnect = lostConnect
        },
        SWITCH_SESSION: (state, from) => {
            state.endTime = Date.now()
            console.log("state:" + JSON.stringify(state.sessions) + "from:" + from)
            state.currentSession = state.sessions[from]    
            console.log("state.currentSession:" + JSON.stringify(state.currentSession))
            if(state.currentSession != null) {
                if( state.currentSession.unreadMsgCount != null && state.currentSession.unreadMsgCount > 0 ) {
                    if(state.unreadMsgCount != null && state.unreadMsgCount > 0) {
                        state.unreadMsgCount -= state.currentSession.unreadMsgCount
                    }
                    
                    if (state.currentSession.unreadMsgCount > 0) {
                        ws.remarkHasRead(from)
                    }
                    state.currentSession.unreadMsgCount = 0
                }
                if(state.currentSession.messages!= null && state.currentSession.messages.length > 0) {
                    state.endTime = state.currentSession.messages[0].ctime - 1
                }
            } else {
                var contact = null
                for (var i = 0; i < state.contacts.length; i++) {
                    if(state.contacts[i].friendname == from) {
                        contact = state.contacts[i]
                        break;
                    }
                }
                var imageUrl = null
                var remark = null
                if(contact) {
                    imageUrl = contact.imageUrl
                    remark = contact.remark
                }
                state.currentSession = {
                    from: from,
                    imageUrl: imageUrl,
                    remark: remark
                } 
            }
           
        },

        CLEAR_SESSION: (state) => {
            state.currentSession = {}
        },

        ADD_SEND_MSG: (state, message) => {
            console.log("message:"+JSON.stringify(message))
            if(state.currentSession.messages != null) {
                state.currentSession.messages.push(message)
            } else {
                state.currentSession = {
                    from: message.to,
                    messages: [message]
                }
            }
            state.currentSession.lastMessage = message.content
            if(!state.sessions[message.to]) {
                Vue.set(state.sessions, message.to, state.currentSession)
            }
            
        },

        GET_NEW_MESSAGE: (state, message) => {
           if(state.sessions[message.from] != null) {
               if(state.currentSession.imageUrl == null) {
                var contact = null
                for (var i = 0; i < state.contacts.length; i++) {
                    if(state.contacts[i].friendname == message.from) {
                        contact = state.contacts[i]
                        break;
                    }
                }
                var imageUrl = null
                var remark = null
                if(contact) {
                    imageUrl = contact.imageUrl
                    remark = contact.remark
                }
                state.currentSession.imageUrl = imageUrl
               }
                if(state.currentSession.from == message.from) {
                    state.currentSession.messages.push(message)
                    state.currentSession.lastMessage = message.content
                } else {
                    Notification({
                        title: '新消息',
                        message: message.content,
                        type: 'success'
                      });
                    state.sessions[message.from].messages.push(message)
                    state.unreadMsgCount = state.unreadMsgCount + 1
                    state.sessions[message.from].unreadMsgCount ++
                }
            } else {
                var contact = null
                for (var i = 0; i < state.contacts.length; i++) {
                    if(state.contacts[i].friendname == message.from) {
                        contact = state.contacts[i]
                        break;
                    }
                }
                var imageUrl = null
                var remark = null
                if(contact) {
                    imageUrl = contact.imageUrl
                    remark = contact.remark
                }
                var session = {
                    from: message.from,
                    imageUrl: imageUrl,
                    remark: remark,
                    messages: [message],
                    lastMessage: message.content,
                    unreadMsgCount: 1
                }
                state.unreadMsgCount = state.unreadMsgCount + 1
                Vue.set(state.sessions, message.from, session)
                Notification({
                    title: '新消息',
                    message: message.content,
                    type: 'success'
                });
            }
            
            console.log("message:"+JSON.stringify(message))
        },
        GET_MESSAGES: (state, responseMessage) => {
            var from = responseMessage.from
            var messages = responseMessage.messages
            state.currentSession = state.sessions[from]
           
           if(state.currentSession) {
                var allMessages = messages.concat(state.currentSession.messages)
                console.log("messages:"+JSON.stringify(allMessages))
                state.currentSession.messages = allMessages
            } else {
                var contact = null
                for (var i = 0; i < state.contacts.length; i++) {
                    if(state.contacts[i].friendname == from) {
                        contact = state.contacts[i]
                        break;
                    }
                }
                var imageUrl = null
                var remark = null
                if(contact) {
                    imageUrl = contact.imageUrl
                    remark = contact.remark
                }
                var lastMessage = null
                if(messages != null && messages.length > 0) {
                    lastMessage = messages[messages.length -1].content
                }
                var session = {
                    from: from,
                    imageUrl: imageUrl,
                    remark: remark,
                    messages: messages,
                    lastMessage: lastMessage,
                    unreadMsgCount: 0
                }
                state.currentSession = session
            }
            Vue.set(state.sessions, from, state.currentSession) 
            if (state.currentSession != null 
                && state.currentSession.messages != null 
                && state.currentSession.messages.length > 0) {
                state.endTime = state.currentSession.messages[0].ctime - 1
            }
        },
        GET_UNREAD_MESSAGES: (state, unReadMessagesMap) => {
            state.sessions = {}
            state.unreadMsgCount = 0
            console.log("unReadMessagesMap:" + JSON.stringify(unReadMessagesMap))
            for(var from in unReadMessagesMap) {
                state.unreadMsgCount = state.unreadMsgCount + unReadMessagesMap[from].length
                var contact = null
                for (var i = 0; i < state.contacts.length; i++) {
                    if(state.contacts[i].friendname == from) {
                        contact = state.contacts[i]
                        break;
                    }
                }
                var imageUrl = null
                var remark = null
                if(contact) {
                    imageUrl = contact.imageUrl
                    remark = contact.remark
                }
                var session = {
                    from: from,
                    imageUrl: imageUrl,
                    remark: remark,
                    messages: unReadMessagesMap[from],
                    lastMessage: unReadMessagesMap[from][unReadMessagesMap[from].length - 1],
                    unreadMsgCount: unReadMessagesMap[from].length
                }
                Vue.set(state.sessions, from, session)
            }
        },
        GET_CONTACTS: (state, contacts) => {
            state.contacts = contacts
        },
        GET_CONTACT: (state, friendName) => {
            state.contacts.forEach(contact => {
                if(friendName == contact.friendname) {
                    console.log("param1:getContact:" + friendName)
                    state.contactMsg = contact;
                    return;
                }
            })
        },
        GET_REQUEST_CONTACTS: (state, requestContacts) =>{
            state.requestContacts = requestContacts;
            state.unreadReqCount = requestContacts.length
        },
        SET_REMARK: (state, {friendName, remark}) => {
            state.contacts.forEach(contact => {
                if(contact.friendname == friendName) {
                    contact.remark = remark
                    state.contactMsg = contact
                }
            })
        }
    },

    actions: {
        setConsumer ({ commit }, consumer) {
            commit('SET_CONSUMER', consumer)
        },
        setActive({ commit }, active) {
            commit('SET_ACTIVE', active)
        },
        switchSession({commit}, from) {
            commit('SWITCH_SESSION', from)
        },
        clearSession({commit}){
            commit('CLEAR_SESSION')
        },
        getUnReadMessages({commit}){
            listUnReadMessages().then(response => {
                commit('GET_UNREAD_MESSAGES', response)
            })
        },
        listMessages({commit}, param){
            console.log("startTime:"+ param.endTime - 1000 * 60 * 60 * 24 * 30 + "time:" + param.endTime + "from:" + param.from)
            listMessages(param.from, param.endTime - 1000 * 60 * 60 * 24 * 30, param.endTime).then(response => {
                console.log("response:"+JSON.stringify(response))

                var responseMessage = {
                    from:param.from,
                    messages:response.content
                }
                commit('GET_MESSAGES', responseMessage)
            })
        },
        getContacts({commit}) {
            listFriends().then(response => {
                    console.log(JSON.stringify(response))
                    commit('GET_CONTACTS', response)
                })
        },
        getContact({commit}, friendName) {
            console.log("param:getContact:" + friendName)
            commit('GET_CONTACT', friendName)
        },
        listFriendReq({commit}) {
            listFriendReq().then(response => {
                    commit('GET_REQUEST_CONTACTS', response)
                })
        },
        sendMessage({commit}, payload) {
            console.log("payload:"+JSON.stringify(payload))
            ws.sendMessage(payload.content, payload.to)
            
        },
        setRemark({commit}, payload){
            commit('SET_REMARK', payload)
        },
        subscribeMsg() {
            ws.subscribe(getToken().username) 
        }
    }
}


export default param