import Vue from 'vue'
import ws from  '@/utils/wsRequest'
import { listFriends, listFriendReq, listUnReadMessages } from '@/api/api'


const param = {
    state: {

        consumer: {},
        sessions: [],
        currentSession: {},
        currentMessages: [],
        messages:{},
        unreadReqCount: 0,
        unreadMsgCount: 0,
        contacts: [],
        requestContacts:[],
        nearbyPeoples: [],
        connected: false,
        active: 'message',
        currentFrom: null,
        lostConnect: false,
        unSendMsg:[],
        isAlertTips:false,
        gender: localStorage.gender || null
    },

    mutations: {
        SET_CONSUMER: (state, consumer) => {
            state.consumer = consumer
        },
        SET_ACTIVE: (state, active) => {
            state.active = active
        },
        SWITCH_SESSION: (state, from) => {
            console.log("state:" + JSON.stringify(state.sessions) + "from:" + from)
            state.currentSession = {}
            for (var i = 0; i < state.sessions.length; i++) {
                if(state.sessions[i].from == from) {
                    console.log("state.sessions[i]:" + JSON.stringify(state.sessions[i]))
                    state.currentSession = state.sessions[i]
                }
            }
            console.log("state.currentSession:" + JSON.stringify(state.currentSession))
            if(state.currentSession.unreadMsgCount != null && state.currentSession.unreadMsgCount > 0 ) {
                state.unreadMsgCount -= state.currentSession.unreadMsgCount
                if (state.currentSession.unreadMsgCount > 0) {
                    // ws.remarkHasRead(from)
                }
                state.currentSession.unreadMsgCount = 0
            }
           
        },

        CLEAR_SESSION: (state) => {
            state.currentSession = null
        },

        ADD_SEND_MSG: (state, message) => {
            console.log("message:"+JSON.stringify(message))
            if(state.currentSession != null && state.currentSession.messages != null) {
                state.currentSession.messages.push(message)
            } else {
                state.currentSession = {
                    from: message.to,
                    messages: [message]
                }
            }
            
        },
        
        GET_UNREAD_MESSAGES: (state, unReadMessagesMap) => {
            state.sessions = []
            state.unreadMsgCount = 0
            console.log("unReadMessagesMap:" + JSON.stringify(unReadMessagesMap))
            for(var from in unReadMessagesMap) {
                state.unreadMsgCount = state.unreadMsgCount + unReadMessagesMap[from].length
                var contact = null
                for (var i = 0; i < state.contacts.length; i++) {
                    if(state.contacts[i].friendname == from) {
                        contact = state.contacts[i]
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
                    lastMessage: unReadMessagesMap[from][0],
                    unreadMsgCount: unReadMessagesMap[from].length
                }
                state.sessions.push(session)
            }
        },
        GET_CONTACTS: (state, contacts) => {
            state.contacts = contacts
        },
        GET_REQUEST_CONTACTS: (state, requestContacts) =>{
            if(state.requestContacts.length > 0) {
                for (var i = 0; i < state.requestContacts.length; i++) {
                    for (var j = 0; j < requestContacts.length; j++) {
                        if(requestContacts[i].friendname == state.requestContacts[j].friendname) {
                            requestContacts.splice(j, 1)
                        }
                    }
                }
                state.requestContacts = state.requestContacts.concat(requestContacts)
                state.unreadReqCount = state.requestContacts.length
            } else {
                state.requestContacts = requestContacts
                state.unreadReqCount = requestContacts.length
            }
            
            
            
        },
        SET_REMARK: (state, {friendName, remark}) => {
            var tag = friendName.substring(0, 1)
            state.contacts.forEach(contact => {
                if(contact.tag === tag) {
                    contact.friendsInfo.forEach(friendInfo => {
                        if(friendInfo.friendname === friendName) {
                            friendInfo.remark === remark
                        }
                    })
                }
            })
            commit('GET_CONTACTS', state.contacts)
            
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
        getContacts({commit}) {
            listFriends().then(response => {
                    console.log(JSON.stringify(response))
                    commit('GET_CONTACTS', response)
                })
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
            return new Promise((resolve, reject) => {
              api.setRemark(payload, (res) => {
                if (res) {
                  commit('SET_REMARK', payload)
                  resolve()
                } else {
                  reject()
                }
              })
            })
        },
        subscribeMsg({commit}) {
            ws.subscribe('test') 
        }
    }
}


function createSession(state, from, remark) {
    Vue.set(state.param.sessions, from, {
        from,
        remark, 
        messages: [],
        lastMessage: null,
        unreadReqCount: 0
    })
}

function addMessage(state, message) {
    console.log(message)
    let from = message.isMe ? message.to : message.from
    message.isRead = from === state.param.currentFrom
    const session = state.param.sessions[from]
    if(!session.messages.some(id => id === message.id)) {
        session.messages.push(message.id)
        session.lastMessage = message
        if(!message.isRead) {
            ++session.unreadReqCount
            ++state.param.unreadReqCount
        }
    }
    if(!message.isMe && message.isRead) {
        ws.remarkHasRead(from)
    }
    state.param.sessions[from].unreadReqCount = 0
}

export default param