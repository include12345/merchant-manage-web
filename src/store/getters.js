const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    tokens: state => state.user.tokens,
    avatar: state => state.user.acatar,
    name: state => state.user.name,
    consumer: state => state.param.consumer,

    sessions: state => state.param.sessions,

    active: state => state.param.active,
    unreadReqCount: state => state.param.unreadReqCount,
    unreadMsgCount: state => state.param.unreadMsgCount,
    contacts: state => state.param.contacts,
    requestContacts: state => state.param.requestContacts,
    connected: state => state.param.connected,
    lostConnect: state => state.param.lostConnect,
    unSendMsg: state => state.param.unSendMsg,
    friendsInfo: state => state.param.friendsInfo,
    isAlertTips: state => state.param.isAlertTips,
    nearbyPeoples: state => state.param.nearbyPeoples,
    currentFrom: state => state.param.currentFrom,
    messages: state => state.param.messages,
    gender: state => state.gender === null ? null : parseInt(state.gender),
    currentSession: () => {
        return currentFrom
        ? sessions[currentFrom] : {}
    },
    currentMessages: state => {
        const session = currentSession(state)
        return session.messages
        ? session.messages.map(id => messages[id]) : []
    }
}

export default getters