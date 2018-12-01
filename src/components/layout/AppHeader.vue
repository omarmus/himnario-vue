<template>
  <header class="header grid grid-header">
    <h1>Himnario SMI</h1>
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
    font-weight: 400;
    padding: 20px 0 0 55px;
    background: transparent url(../../../public/img/icons/windows/windowsphone-storelogo-70-70.png) no-repeat;
    background-position: 6px 7px;
    background-size: auto 80%;

    .pull-right {
      margin: 12px 15px 0 0;
    }

    small {
      font-size: .9rem;
      display: inline-block;
      letter-spacing: 7.2px;
      text-transform: uppercase;
      font-weight: 300;
      padding-left: 1px;
    }
  }

  .himnario-tipo {
    text-align: right;
    padding: 11px 15px 0 0px;
  }

  .btn {
    margin-left: 2px;
  }
}

.grid {
  &.grid-header {
    grid-template-columns: 1fr 200px;
  }
}

body.fullscreen {
  .header {
    display: none;
  }
}

@media (max-width: 768px) {
  .header {
    h1 {
      font-size: 1.2rem;
      padding-top: 21px;
      padding-left: 48px;
      background-size: auto 70%;
      background-position: 6px 10px;
    }

    .btn {
      padding: 10px 8px;
    }
  }

  .grid {
    &.grid-header {
      grid-template-columns: 1fr 170px;
    }
  }
}
</style>
