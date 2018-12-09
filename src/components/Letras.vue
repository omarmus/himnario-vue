<template>
  <section class="himno" v-if="detalle">
    <detalle></detalle>
    <div
      v-for="detalle in letra"
      :key="detalle.id"
      class="himno-estrofa">
      <strong v-if="detalle.type === 'STROPHE'">{{ detalle.order }}. </strong>
      <strong v-else><em>Coro: </em><br></strong>
      <span
        v-if="detalle.type === 'STROPHE'"
        v-html="detalle.content">
      </span>
      <strong
        v-else
        v-html="detalle.content"
        class="himno-coro">
      </strong>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import Detalle from './Detalle'

const url = process.env.API_URL

export default {
  props: {
    number: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      letra: [],
      detalle: null
    }
  },
  mounted () {
    console.log('number letra', this.number)
    if (this.number) {
      this.cargarHimno(this.number)
    }
  },
  methods: {
    cargarHimno (number) {
      let himnos = this.$storage.get('himnos')
      this.detalle = himnos.filter(item => item.number === number)[0]
      let himno = {
        detalle: this.detalle
      }
      axios.get(`${url}api/detalle/${number}`)
        .then(response => {
          let letra = response.data
          letra.map(item => {
            item.content = item.content.replace(/\n/gi, '<br />')
            return item
          })
          this.letra = letra
          himno.letra = letra
          this.$store.commit('setHimno', himno)
          this.$storage.set('himno', this.himno)
        })
    }
  },
  components: {
    Detalle
  }
}
</script>

<style lang="scss">
.himno {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 30px;
}
.himno-estrofa {
  margin-bottom: 15px;
}
.grid {
  &.grid-detalle {
    grid-template-columns: 1fr 1fr;
  }
}
.himno-coro {
  font-style: italic;
}

@media (max-width: 768px) {
  .himno-title {
    font-size: 1.2rem;
  }
}
</style>
