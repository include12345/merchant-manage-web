import { login, logout, checkToken } from '@/api/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import ws from  '@/utils/wsRequest'

const user = {
    state: {
        tokens: {},
        name: '',
        avatar: '',
        roles: []
    },

    mutations: {
        SET_TOKEN: (state, tokens) => {
            state.tokens = tokens
          }
        //   SET_AVATAR: (state, avatar) => {
        //     state.avatar = avatar
        //   },
        //   SET_ROLES: (state, roles) => {
        //     state.roles = roles
        //   }
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                login(username, userInfo.password).then(response => {
                // const data = response.data
                    this.tokens = {
                        token: response.token,
                        username: username,
                        imageUrl: response.imageUrl
                    }
                    
                    setToken(JSON.stringify(this.tokens))
                    commit('SET_TOKEN', this.tokens)
                    // commit('SET_NAME',response.name)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取用户信息
        CheckToken() {
            return new Promise((resolve, reject) => {
                checkToken().then(response => {
                    // const data = response.data
                    // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                    //   commit('SET_ROLES', data.roles)
                    // } else {
                    //   reject('getInfo: roles must be a non-null array !')
                    // }
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.tokens).then(() => {
                    commit('SET_TOKEN', null)
                    // commit('SET_ROLES', [])
                    removeToken()
                    resolve()
                    ws.disconnect()
                }).catch(error => {
                    reject(error)
                })
            })
        },
  
        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', null)
                removeToken()
                ws.disconnect()
                resolve()
            })
        }
    }
}

export default user