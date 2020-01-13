import api from '@/api'
import jsonwebtoken from 'jsonwebtoken'

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
    login: async ({ commit, dispatch }, jwt) => {
      try {
        if (!jwt) {
          console.log('fetching login from API')
          const { data } = await api.request({
            url: '/v1/auth/jwt',
            method: 'get'
          })

          jwt = data.jwt
        }
        commit('setJWT', jwt)
        commit('setUserDetails', jsonwebtoken.decode(jwt))

        await dispatch('accounts/fetchPersonal', {}, { root: true })
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    }
  },
  mutations: {
    setJWT: (state, jwt) => {
      localStorage.jwt = jwt

      state.jwt = jwt
    },
    setUserDetails: (state, userDetails) => {
      state.userDetails = userDetails
    }
  }
}

export default user
