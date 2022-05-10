import { createStore } from 'vuex'

export default createStore({
  state: {
    userId: window.localStorage.getItem('userId'),
  },
  mutations: {
    setUserId(state: any, userId: any) {
      
    },
    removeUserId(state: any) {
     
    }
  },
  actions: {
  },
  modules: {
  }
})
