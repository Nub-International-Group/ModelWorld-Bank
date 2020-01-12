import api from '@/api'
import jwt from 'jsonwebtoken'

const user = {
  namespaced: true,
  state: {
    jwt: null,
    userDetails: {
      admin: null,
      name: null
    }
  },
  actions: {
    fetchJWT: ({ commit, dispatch }) => {
      api.request({
        url: '/v1/auth/jwt',
        method: 'get'
      }).then(res => {
        commit('setJWT', { jwt: res.data.jwt })
      }).catch(err => { dispatch('messages/handleError', { err }, { root: true }) })
    }
  },
  mutations: {
    setJWT: (state, payload) => {
      localStorage.jwt = payload.jwt

      state.jwt = payload.jwt
      state.userDetails = jwt.decode(payload.jwt)
    }
  }
}

export default user
