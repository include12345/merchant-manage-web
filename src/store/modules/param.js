const param = {
    state: {
        consumer: {},
        active: 'message',
        unreadReqCount: 0,
        unreadMsgCount: 0,
    },

    mutations: {
        SET_CONSUMER: (state, consumer) => {
            state.consumer = consumer
          },
    },

    actions: {
        setConsumer ({ commit }, consumer) {
            commit('SET_CONSUMER', consumer)
        }
    }
}

export default param