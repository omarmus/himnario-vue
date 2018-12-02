<template>
  <section class="himno">
    <div class="himno-detalle" v-if="detalle">
      <h2>{{ detalle.number }}. {{ detalle.title }}</h2>
      <span v-if="detalle.author"><strong>Autor:</strong> {{ detalle.author }} <br></span>
      <span v-if="detalle.arranger"><strong>Arreglo:</strong> {{ detalle.arranger }} <br></span>
      <span v-if="detalle.adapted"><strong>Adaptación:</strong> {{ detalle.adapted }} <br></span>
      <span v-if="detalle.traductor"><strong>Traductor:</strong> {{ detalle.traductor }} <br></span>
      <span v-if="detalle.reference"><strong>Referencia:</strong> {{ detalle.reference }} <br></span>
      <span v-if="detalle.tone"><strong>Tono:</strong> {{ detalle.tone }} <br></span>
    </div>
    <div v-for="detalle in himno" class="himno-estrofa">
      <strong v-if="detalle.type === 'STROPHE'">{{ detalle.order }}. </strong>
      <span v-else>Coro: <br></span>
      <span v-html="detalle.content"></span>
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
    console.log('number letra', this.number);
    if (this.number) {
      this.cargarHimno(this.number)
    }
  },
  methods: {
    cargarHimno (number) {
      let himnos = this.$storage.get('himnos');
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
}
.himno-estrofa {
  margin-bottom: 10px;
}
</style>
