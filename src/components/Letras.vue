<template>
  <section class="himno">
    <h2 class="himno-title">{{ detalle.number }}. {{ detalle.title }}</h2>
    <div class="himno-detalle grid grid-detalle" v-if="detalle">
      <div class="text-left">
        <span v-if="detalle.author"><strong>Autor:</strong> {{ detalle.author }} <br></span>
        <span v-if="detalle.arranger"><strong>Arreglo:</strong> {{ detalle.arranger }} <br></span>
        <span v-if="detalle.adapted"><strong>Adaptación:</strong> {{ detalle.adapted }}</span>
      </div>
      <div class="text-right">
        <span v-if="detalle.tone"><strong>Tono:</strong> {{ detalle.tone }} <br></span>
        <span v-if="detalle.traductor"><strong>Traductor:</strong> {{ detalle.traductor }} <br></span>
        <span v-if="detalle.reference"><strong>Referencia:</strong> {{ detalle.reference }}</span>
      </div>
    </div>
    <div
      v-for="detalle in himno"
      :key="detalle.id"
      class="himno-estrofa">
      <strong v-if="detalle.type === 'STROPHE'">{{ detalle.order }}. </strong>
      <strong v-else><em>Coro: </em><br></strong>
      <span v-html="detalle.content" :class="{ 'himno-coro': detalle.type !== 'STROPHE' }"></span>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
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
      himno: [],
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
      axios.get(`${url}api/detalle/${number}`)
        .then(response => {
          let himno = response.data
          himno.map(item => {
            item.content = item.content.replace(/\n/gi, '<br />')
            return item
          })
          this.himno = himno
          this.$storage.set('himno', this.himno)
        })
    }
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

.himno-title {
  margin: 0 0 10px;
  font-size: 1.5rem;
  text-align: center;
}

.himno-detalle {
  font-size: .8rem;
  margin-bottom: 20px;
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
