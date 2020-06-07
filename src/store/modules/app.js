import Cookies from 'js-cookie'
import Vue from 'vue'
import ws from  '@/api/ws'


const app = {
    state: {
        sidebar: {
            opened: !+Cookies.get('sidebarStatus'),
            withoutAnimation: false
        },
        device: 'desktop'
    },
    mutations: {
        TOGGLE_SIDEBAR: state => {
            if(state.sidebar.opened){
                Cookies.set('sidebarStatus', 1)
            } else {
                Cookies.set('sidebarStatus', 0)
            }
            state.sidebar.opened = !state.sidebar.opened
        },
        CLOSE_SIDEBAR: (state, withoutAnimation) => {
            Cookies.set('sidebarStatus', 1)
            state.sidebar.opened = false
            state.sidebar.withoutAnimation = withoutAnimation
        },
        TOGGLE_DEVICE: (state, device) => {
            state.device = device
        },

        //chat
        CREATE_SESSION: (state, {remark, from}) => {
            createSession(state, from, remark)
        },
        
        RECEIVE_MESSAGE: (state, {message}) => {
            if(!state.param.sessions[message.from]) {
                createSession(state, message.from)
            }
            addMessage(state, message)
        },
        GET_CONTACTS: (state, contacts) => {
            state.param.contacts = contacts
        },
        GET_FRIEND_INFO: (state, {friendName, friendInfo}) => {
            Vue.set(state.param.friendInfo, friendName, friendInfo)
        },
        CLEAR_FRIEND_INFO: state => {
            state.param.friendInfo = {}
        },
        SWITCH_SESSION: (state, {from, remark}) => {
            setCurrentSession(state, from, remark)
        },
        CLEAR_SESSION: state => {
            state.param.currentFrom = null
        },
        SET_CONNECTED: (state, connected) => {
            state.param.connected = connected
        },
        // SET_GENDER: (state, {gender}) => {
        //     state.param.gender = gender
        //     try {
        //         if (gender === null) {
        //             localStorage.removeItem('gender')
        //         } else {
        //             localStorage.gender = gender
        //         }
        //     } catch (e) {
        //         alertTips(state)
        //     }
        // },
        SET_MASK: (state, {friendName, remark}) => {
            let info = state.param.friendInfo[friendName]
            if(info) {
                Vue.set(state.param.friendInfo[friendName], 'remark', remark)
            } else {
                Vue.set(state.param.friendInfo, friendName, {remark})
            }
        },
        ADD_REQ_CONTACT: (state, username) => {
            if(username instanceof Array) {
                username.forEach(u => {
                    state.param.requestContacts.push(u)
                    ++state.unreadReqCount
                })
                return
            }
            state.param.requestContacts.push(username)
            ++state.unreadReqCount
        },
        DEAL_FRIEND_REQ: (state, username) => {
            state.param.requestContacts = state.param.requestContacts.filter(u => u !== username)
            --state.param.unreadReqCount
        },
        ACCEPTED_FRIEND_REQ: (state, message) => {
            let contact = {friendName: message.from}
            let index = state.param.contacts[message.content]
            if(index) {
                state.param.contacts[message.content].push(contact)
            } else {
                Vue.set(state.param.contacts, message.content, [contact])
            }
            Vue.set(state.param.friendInfo, message.from, {username: message.from})
        },
        DELETE_FRIEND: (state, message) => {
            const removed = state.param.contacts[message.content].filter(c => {
                return c.friendName != message.from
            })
            if(removed.length === 0) {
                Vue.delete(state.param.contacts, message.content)
            } else {
                Vue.set(state.param.contacts, message.content, removed)
            }
        },
        LOST_CONNECT: (state, lost) => {
            state.param.lostConnect = lost
        },
        ADD_UN_SEND_MSG: (state, message) => {
            state.param.unSendMsg.push(message)
        },
        SET_MESSAGE_SENT: (state, id) => {
            state.param.messages[id].sent = true
        },
        SET_MESSAGE_TIMEOUT: (state, {id, timeout, timestamp}) => {
            state.param.messages[id].timeout = timeout
            if(timestamp) {
                state.param.messages[id].timestamp = timestamp
            }
        },
        REMOVE_UNSENT_MESSAGE: (state, id) => {
            state.param.unSendMsg.splice(id, 1)
        },
        GET_NEARBY_PEOPLE: (state, nearbyPeoples) => {
            state.param.nearbyPeoples = nearbyPeoples
        }


    },
    actions: {
        ToggleSideBar: ({commit}) => {
            commit('TOGGLE_SIDEBAR')
        },
        CloseSideBar({commit}, {withoutAnimation}) {
            commit('CLOSE_SIDEBAR', withoutAnimation)
        },
        ToggleDevice({commit}, device) {
            commit('TOGGLE_DEVICE', device)
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




export default app