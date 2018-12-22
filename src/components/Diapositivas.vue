<template>
  <div class="diapositiva" id="diapositiva">
    <div class="diapositiva-container" v-if="!$store.state.loading">
      <h2 class="diapositiva-title" v-if="$store.state.position">{{ title }}</h2>
      <div
        v-if="estrofa"
        class="diapositiva-letra"
        :style="{ 'font-size': fontSize }">
        <strong v-if="estrofa.type === 'STROPHE'" class="diapositiva-number">{{ estrofa.order }}. </strong>
        <strong v-if="estrofa.type === 'CHORUS'"><em>Coro: </em><br></strong>
        <span
          v-if="estrofa.type === 'STROPHE'"
          v-html="estrofa.content">
        </span>
        <strong
          v-if="estrofa.type === 'TITLE'"
          class="diapositiva-title-main"
          v-html="estrofa.content">
        </strong>
        <span
          v-if="estrofa.type === 'CHORUS'"
          v-html="estrofa.content"
          class="diapositiva-coro">
        </span>
      </div>
      <div class="diapositiva-state">
        {{ $store.state.position + 1 }} de {{ letra.length }}
      </div>
      <div class="diapositiva-buttons" v-if="letra">
        <button
          type="button"
          class="btn-link"
          :disabled="$store.state.position === 0"
          title="Anterior"
          @click="prev"><i class="icon-circle-left"></i>
        </button>
        <button
          type="button"
          class="btn-link"
          :disabled="$store.state.position === letra.length - 1"
          title="Siguiente"
          @click="next"><i class="icon-circle-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      position: 0,
      diapositivas: [],
      fontSize: '12px'
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
    },
    setFontSize (size) {
      this.fontSize = size
    }
  },
  computed: {
    estrofa () {
      if (this.letra) {
        let letra = this.letra[this.$store.state.position]
        if (letra) {
          if (this.$store.state.position) {
            var diapositiva = document.getElementById('diapositiva')
            var el = diapositiva.getBoundingClientRect()
            let size = letra.content.match(/<br \/>/gi)
            if (size) {
              size = size.length + (letra.type === 'CHORUS' ? 2 : 1)
              let fontSize = (((el.height - 100) / size) - 10)
              console.log('font-size original', size, fontSize, letra.type)
              if (fontSize > 60) {
                fontSize = 60
              }
              this.setFontSize(fontSize + 'px')
            }
            console.log('font-size', this.fontSize, el.height)
          }
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
        let diapositiva = [{ content: this.title, type: 'TITLE' }]
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
  }
}
</script>

<style lang="scss">
@import '../assets/scss/_variables.scss';

$link: lighten($warning, 10%);

.diapositiva {
  position: relative;
  background-color: #222222;
  color: #f5f5f5;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;

  .btn-link {
    &:disabled,
    &[disabled] {
      cursor: not-allowed;

      i {
        color: darken($warning, 35%);
      }
    }

    i {
      color: $warning;
      font-size: 3.2rem;
    }
  }
}
.diapositiva-title {
  color: $link;
  font-size: 1.2rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.diapositiva-title-main {
  font-size: 4rem;
  color: $link;
}
.diapositiva-container {
  padding: 50px 20px 20px 20px;
  margin: 0 auto;
  width: 100%;
  // max-width: 960px;
}
.diapositiva-letra {
  // font-size: 2.4rem;
  // line-height: 2.8rem;
}
.diapositiva-state {
  position: absolute;
  left: 25px;
  bottom: 25px;
  color: $link;
  font-size: 1.8rem;
}
.diapositiva-buttons {
  position: absolute;
  right: 25px;
  bottom: 25px;
}
.diapositiva-number {
  color: $link;
}
.diapositiva-coro {
  color: $link;
}
</style>
