<template>
  <div class="diapositiva">
    <div class="diapositiva-container">
      <h2 class="diapositiva-title">{{ title }}</h2>
      <div
        v-if="estrofa"
        class="diapositiva-letra">
        <strong v-if="estrofa.type === 'STROPHE'">{{ estrofa.order }}. </strong>
        <strong v-else><em>Coro: </em><br></strong>
        <span
          v-if="estrofa.type === 'STROPHE'"
          v-html="estrofa.content">
        </span>
        <span
          v-else
          v-html="estrofa.content"
          class="himno-coro">
        </span>
      </div>
      <div class="diapositiva-buttons" v-if="letra">
        <button
          type="button"
          class="btn"
          :disabled="$store.state.position === 0"
          title="Anterior"
          @click="prev"><i class="icon-arrow-left"></i>
        </button>
        <button
          type="button"
          class="btn"
          :disabled="$store.state.position === letra.length - 1"
          title="Siguiente"
          @click="next"><i class="icon-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Detalle from './Detalle'

export default {
  data () {
    return {
      position: 0,
      diapositivas: []
    }
  },
  methods: {
    prev () {
      if (this.$store.state.position > 0) {
        this.$store.commit('lessPosition')
      }
    },
    next () {
      if (this.$store.state.position < this.letra.length - 1) {
        this.$store.commit('addPosition')
      }
    }
  },
  computed: {
    estrofa () {
      if (this.letra) {
        let letra = this.letra[this.$store.state.position]
        if (letra) {
          letra.content = letra.content.replace(/\n/gi, '<br />')
        }
        return letra
      }
      return null
    },
    title () {
      if (this.$store.state.himno) {
        const detalle = this.$store.state.himno.detalle
        return detalle.number + '. ' + detalle.title
      }
      return null
    },
    letra () {
      if (this.$store.state.himno) {
        let letra = this.$store.state.himno.letra
        let diapositiva = []
        let coro = null
        for (let i in letra) {
          if (letra[i].type === 'CHORUS') {
            coro = letra[i]
          }

          diapositiva.push(letra[i])

          if (coro && i > 1) {
            diapositiva.push(coro)
          }
        }
        return diapositiva
      }
      return []
    }
  },
  components: {
    Detalle
  }
}
</script>

<style lang="scss">
@import '../assets/scss/_variables.scss';

.diapositiva {
  position: relative;
  background-color: #222222;
  color: #f5f5f5;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
}
.diapositiva-title {
  color: lighten($warning, 10%);
  font-size: 1.2rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.diapositiva-container {
  padding: 50px 20px 20px 20px;
  margin: 0 auto;
  width: 100%;
  max-width: 960px;
}
.diapositiva-letra {
  font-size: 2.4rem;
  line-height: 2.8rem;
}
.diapositiva-buttons {
  position: absolute;
  right: 20px;
  bottom: 25px;
}
</style>
