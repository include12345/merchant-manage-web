const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    avatar: state => state.user.acatar,
    name: state => state.user.name,
    consumer: state => state.param.consumer
}

export default getters