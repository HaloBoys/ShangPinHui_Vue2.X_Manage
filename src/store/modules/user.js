// 引入登录|退出登录|获取用户信息的接口函数
import {
  login,
  logout,
  getInfo
} from '@/api/user'
// 获取token|设置token|删除token的函数
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
// 路由模块当中重置路由的方法
import {
  resetRouter,
  asyncRoutes,
  constantRoutes,
  anyRoutes
} from '@/router'

import router from "@/router"

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],
    buttons: [],
    roles: [],
    // 对比之后【项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的理由】
    resAsyncRoutes: [],
    // 合并后的路由。【用户最终需要展示的路由】
    resAllRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.routes = userInfo.routes;
    state.buttons = userInfo.buttons;
    state.roles = userInfo.roles;
  },
  // 最终计算出的路由
  SET_RESASYNCROUTES: (state, asyncRoutes) => {
    state.resAsyncRoutes = asyncRoutes
    state.resAllRoutes = constantRoutes.concat(state.resAsyncRoutes, anyRoutes)
    router.addRoutes(state.resAllRoutes)
  }
}

const actions = {
  // user login
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password }).then(response => {
  //       const { data } = response
  //       commit('SET_TOKEN', data.token)
  //       setToken(data.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
  async login({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    let res = await login({
      username: username.trim(),
      password: password
    });
    if (res.code == 200 || res.code == 20000) {
      commit('SET_TOKEN', res.data.token)
      setToken(res.data.token)
    } else {
      return Promise.reject(new Error(res.message))
    }
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {
          data
        } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        // const {
        //   name,
        //   avatar
        // } = data
        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)

        commit('SET_USERINFO', data)
        commit('SET_RESASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

// 定义一个函数：两个数组进行对比，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  return asyncRoutes.filter(item => {
    if (routes.indexOf(item.name) != -1) {
      // 递归：每一个 item 还有子路由
      if (item.children && item.children.length) {
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
