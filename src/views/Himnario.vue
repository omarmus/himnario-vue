<template>
  <section>
    <notas v-if="tipo === 'NOTAS'"></notas>
    <letras v-if="tipo === 'LETRAS'"></letras>
  </section>
</template>

<script>
import Notas from '@/components/Notas'
import Letras from '@/components/Letras'

export default {
  data () {
    return {
      tipo: 'NOTAS'
    }
  },
  components: {
    Notas,
    Letras
  }
}
</script>
