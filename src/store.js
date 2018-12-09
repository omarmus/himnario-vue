import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false,
    tipo: 'NOTAS',
    himno: null,
    position: 0
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
    },
    setHimno (state, himno)  {
      state.himno = himno
    },
    setPosition (state, position) {
      state.position = position
    },
    addPosition (state) {
      state.position++
    },
    lessPosition (state) {
      state.position--
    }
  }
})
