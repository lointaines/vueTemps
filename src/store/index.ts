import { createStore } from 'vuex'

export default createStore({
  state: {
    userId: "",
  },
  getters: {
    getUserId(state) {
      return state.userId;
    }
  },
  mutations: {
    setUserId(state: any, userId: any) {
      state.userId = userId;
    }
  },
  actions: {
  },
  modules: {
  }
})
