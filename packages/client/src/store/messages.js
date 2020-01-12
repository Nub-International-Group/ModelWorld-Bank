const messages = {
  namespaced: true,
  state: {
    queue: []
  },
  mutations: {
    addMessage: (state, message) => {
      state.queue.push(message)
    }
  },
  actions: {
    handleError: ({ commit }, { err }) => {
      console.log(err)
      commit('addMessage', {
        title: 'Something went wrong',
        type: 'error',
        message: err
      })
    }
  }
}

export default messages
