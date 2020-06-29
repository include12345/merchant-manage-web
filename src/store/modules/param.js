import Vue from 'vue'
import ws from  '@/utils/wsRequest'
import { listFriends, listFriendReq } from '@/api/api'


const param = {
    state: {
        consumer: {},
        sessions: {username: "test"},
        currentSession: {},
        currentMessages: [],
        messages:{},
        unreadReqCount: 0,
        unreadMsgCount: 0,
        contacts: [],
        friends:[],
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
        SWITCH_SESSION: (state, {from, remark}) => {
            console.log("state:" + JSON.stringify(state) + "from:" + JSON.stringify(from))
            state.currentFrom = from
            if (!state.sessions[from]) {
                Vue.set(state.sessions, from, {
                    from,
                    remark, 
                    messages: [],
                    lastMessage: null,
                    unreadReqCount: 0
                })
            }
            state.currentSession = state.sessions[state.currentFrom]
            // mark session as read
            if (state.sessions[from].lastMessage) {
                state.sessions[from].lastMessage.isRead = true
            }
            state.unreadMsgCount -= state.sessions[from].unreadMsgCount
            if (state.sessions[from].unreadMsgCount > 0) {
                ws.remarkHasRead(from)
            }
  
            state.sessions[from].unreadMsgCount = 0
        },

        CLEAR_SESSION: (state) => {
            state.currentFrom = null
        },
        
        RECEIVE_ALL: (state, {messages}) => {
            let latestMessage
            messages.forEach(message => {
                if(!state.param.sessions[message.from]) {
                    createSession(state, message.from)
                }

                if(!latestMessage || message.timestamp > latestMessage.timestamp) {
                    latestMessage = message
                }

                addMessage(state, message)
            })
        },
        GET_CONTACTS: (state, contacts) => {
            state.contacts = contacts
            var friendList = []
            contacts.forEach(contact => {
                contact.friendsInfo.forEach(friendInfo => {
                    friendList.push(friendInfo.friendname)
                })
            })
            state.friends = friendList
            console.log("state.friends:" + JSON.stringify(state.friends))
        },
        GET_REQUEST_CONTACTS: (state, requestContacts) =>{
            state.requestContacts = requestContacts
            state.unreadReqCount = requestContacts.length;
        },
        GET_FRIEND_INFO: (state, {friendName, friendInfo}) => {
            Vue.set(state.friendsInfo, friendName, friendInfo)
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
        switchSession({commit}, payload) {
            commit('SWITCH_SESSION', payload)
        },
        clearSession({commit}){
            commit('CLEAR_SESSION')
        },
        getUnReadMessages({commit}){
            return new Promise((resolve) => {
              api.getUnReadMessages(messages => {
                if (messages === -1) {
                  resolve(false)
                } else {
                  if (messages && messages.length > 0) {
                    commit('RECEIVE_ALL', {messages})
                  }
                  resolve(true)
                }
              })
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
                    console.log(JSON.stringify(response))
                    commit('GET_REQUEST_CONTACTS', response)
                })
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
            ws.subscribe() 
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