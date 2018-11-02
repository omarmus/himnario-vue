<template>
  <header class="header grid grid-header">
    <h1>
      Himnario Internacional SMI<br>
      <small>Movimiento de Reforma</small>
    </h1>
    <div class="himnario-tipo">
      <button
        type="button"
        @click="cambiar('NOTAS')"
        class="btn"
        :class="{ 'btn-success': tipo === 'NOTAS'}">NOTAS</button>
      <button
        type="button"
        disabled
        @click="cambiar('LETRAS')"
        class="btn"
        :class="{ 'btn-success': tipo === 'LETRAS'}">LETRAS</button>
    </div>
  </header>
</template>

<script>
export default {
  data () {
    return {
      tipo: 'NOTAS',
      stick: false
    }
  },
  methods: {
    cambiar (tipo) {
      this.tipo = tipo
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/_variables.scss';
.header {
  background-color: $primary;
  height: 60px;

  h1 {
    color: white;
    height: 60px;
    line-height: 18px;
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    padding: 14px 0 0 70px;
    background: transparent url(../../assets/logo.png) no-repeat;
    background-position: 10px 5px;
    background-size: auto 90%;

    .pull-right {
      margin: 12px 15px 0 0;
    }

    small {
      font-size: .9rem;
      display: inline-block;
      letter-spacing: 7.7px;
      text-transform: uppercase;
      font-weight: 300;
      padding-left: 1px;
    }
  }

  .himnario-tipo {
    text-align: right;
    padding: 11px 15px 0 0px;
  }
}

.grid {
  &.grid-header {
    grid-template-columns: 1fr 190px;
  }
}

body.fullscreen {
  .header {
    display: none;
  }
}
</style>
