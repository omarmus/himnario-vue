import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    tipo: 'NOTAS'
  },
  mutations: {
    showLoading (state) {
      state.loading = true
    },
    hideLoading (state) {
      state.loading = false
    },
    setTipo (state, tipo) {
      state.tipo = tipo
    }
  },
  actions: {

  }
})
