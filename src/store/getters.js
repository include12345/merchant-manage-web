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
    friends: state => state.param.friends,
    requestContacts: state => state.param.requestContacts,
    connected: state => state.param.connected,
    lostConnect: state => state.param.lostConnect,
    unSendMsg: state => state.param.unSendMsg,
    isAlertTips: state => state.param.isAlertTips,
    nearbyPeoples: state => state.param.nearbyPeoples,
    currentFrom: state => state.param.currentFrom,
    messages: state => state.param.messages,
    gender: state => state.gender === null ? null : parseInt(state.gender),
    currentSession: state => state.param.currentSession,
    currentMessages: state => state.param.currentMessages,
}

export default getters