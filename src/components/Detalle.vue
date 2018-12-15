<template>
  <div v-if="detalle">
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
  </div>
</template>

<script>
export default {
  computed: {
    detalle () {
      if (this.$store.state.himno) {
        return this.$store.state.himno.detalle
      }
      return null
    }
  }
}
</script>

<style lang="scss">
.himno-title {
  margin: 0 0 10px;
  font-size: 1.5rem;
  text-align: center;
}

.himno-detalle {
  font-size: .8rem;
  margin-bottom: 20px;
}
</style>
