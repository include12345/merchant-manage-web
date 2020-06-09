import Vue from 'vue'
import ws from  '@/api/ws'

const param = {
    state: {
        consumer: {},
        sessions: {},
        messages:{},
        unreadReqCount: 0,
        unreadMsgCount: 0,
        contacts: [],
        friendsInfo: {},
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
            setCurrentSession(state, from, remark)
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
        },
        CLEAR_FRIEND_INFO: (state) => {
            state.friendsInfo = {}
        },
        GET_FRIEND_INFO: (state, {friendName, friendInfo}) => {
            Vue.set(state.friendsInfo, friendName, friendInfo)
        },
        SET_MASK: (state, {friendName, remark}) => {
            let info = state.friendsInfo[friendName]
            if (info) {
              Vue.set(state.friendsInfo[friendName], 'remark', remark)
            } else {
              Vue.set(state.friendsInfo, friendName, {remark})
            }
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
            var contacts = [
                {
                    remark: "T",
                    friendsInfo: [{
                        username: 'test',
                    },{
                        username: 'test2',
                    },{
                        username: 'test3',
                    }]
                },
                {
                    remark: "L",
                    friendsInfo: [{
                        username: 'test',
                    },{
                        username: 'test2',
                    },{
                        username: 'test3',
                    }]
                },{
                    remark: "L1",
                    friendsInfo: [{
                        username: 'test',
                    },{
                        username: 'test2',
                    },{
                        username: 'test3',
                    }]
                },{
                    remark: "L2",
                    friendsInfo: [{
                        username: 'test',
                    },{
                        username: 'test2',
                    },{
                        username: 'test3',
                    }]
                },{
                    remark: "L3",
                    friendsInfo: [{
                        username: 'test',
                    },{
                        username: 'test2',
                    },{
                        username: 'test3',
                    }]
                }
            ]
            // api.getContacts(contacts => {
                commit('GET_CONTACTS', contacts)
                // commit('CLEAR_FRIEND_INFO')
                // for (let index in contacts) {
                //     let contact = contacts[index]
                //     contact.forEach(c => {
                //         if (c.friendsInfo) {
                //             const friendName = c.friendsInfo.username
                //             const friendInfo = c.friendInfo
                //             friendInfo.remark = c.remark;
                //             commit('GET_FRIEND_INFO', {friendName, friendInfo})
                //         }
                //     })
                // }
            // })
        },
        setRemark({commit}, payload){
            return new Promise((resolve, reject) => {
              api.setRemark(payload, (res) => {
                if (res) {
                  commit('SET_MASK', payload)
                  resolve()
                } else {
                  reject()
                }
              })
            })
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

function setCurrentSession(state, from, remark) {
    state.currentFrom = from
    if (!state.sessions[from]) {
      createSession(state, from, remark)
    }
    // mark session as read
    if (state.sessions[from].lastMessage) {
      state.sessions[from].lastMessage.isRead = true
    }
    state.unreadMsgCount -= state.sessions[from].unreadMsgCount
    if (state.sessions[from].unreadMsgCount > 0) {
        ws.remarkHasRead(from)
    }
  
    state.sessions[from].unreadMsgCount = 0
  }

export default param