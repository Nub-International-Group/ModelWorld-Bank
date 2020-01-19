import api from '@/api'

const properties = {
  namespaced: true,
  state: {
    all: []
  },
  actions: {
    fetch: async ({ commit, dispatch }) => {
      try {
        const res = await api.request({
          url: '/v1/properties',
          method: 'get'
        })
        commit('setAll', res.data)
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    },
    create: async ({ state, commit, dispatch }, property) => {
      try {
        await api.request({
          url: '/v1/properties',
          method: 'post',
          data: property
        })

        await dispatch('fetch')
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    },
    update: async ({ state, commit, dispatch }, property) => {
      try {
        await api.request({
          url: '/v1/properties/' + property._id,
          method: 'put',
          data: property
        })

        await dispatch('fetch')
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    },
    deleteById: async ({ state, commit, dispatch }, propertyId) => {
      try {
        await api.request({
          url: '/v1/properties/' + propertyId,
          method: 'delete'
        })

        await dispatch('fetch')
      } catch (err) {
        dispatch('messages/handleError', { err }, { root: true })
      }
    }
  },
  mutations: {
    setAll: (state, properties) => {
      state.all = properties
    }
  },
  getters: {
    all: (state) => state.all.map((property) => {
      const length = property.valuations.length
      return {
        ...property,
        lastValuation: length ? property.valuations[length - 1].amount : null
      }
    }),
    propertiesById: (state, getters) => getters['all'].reduce((propertiesById, property) => ({
      ...propertiesById,
      [property._id]: property
    }), {})
  }
}

export default properties
