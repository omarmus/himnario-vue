<template>
  <section>
    <buscador></buscador>
  </section>
</template>

<script>
import Buscador from '@/components/Buscador'

export default {
  data () {
    return {
      tipo: 'NOTAS'
    }
  },
  components: {
    Buscador
  }
}
</script>
