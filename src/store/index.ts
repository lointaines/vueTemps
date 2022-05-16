import { createStore } from 'vuex'

export default createStore({
  state: {
    userId: window.localStorage.getItem('userId'),
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
