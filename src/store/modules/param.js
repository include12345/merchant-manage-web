const param = {
    state: {
        consumer: {}
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