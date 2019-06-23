<template>
  <header class="header grid grid-header">
    <h1>Himnario SMI</h1>
    <div class="himnario-tipo">
      <button
        type="button"
        @click="cambiar('NOTAS')"
        class="btn"
        title="Notas"
        :class="{ 'btn-success': $store.state.tipo === 'NOTAS'}">
          <i class="icon-music"></i> <span>NOTAS</span>
      </button>
      <button
        type="button"
        @click="cambiar('LETRAS')"
        class="btn"
        title="Letras"
        :class="{ 'btn-success': $store.state.tipo === 'LETRAS'}">
          <i class="icon-text-color"></i> <span>LETRAS</span>
      </button>
      <button
        type="button"
        @click="cambiar('DIAPOSITIVAS')"
        class="btn"
        title="Presentación"
        :class="{ 'btn-success': $store.state.tipo === 'DIAPOSITIVAS'}">
          <i class="icon-film"></i> <span>DIAPOSITIVAS</span>
      </button>
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
      this.$store.commit('setTipo', tipo)
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/_variables.scss';

.header {
  background-color: $primary;
  height: 60px;
  position: relative;

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
    padding: 12px 15px 8px 10px;
    min-width: 52px;

    i {
      font-size: 1.3rem;
    }

    span {
      display: inline-block;
      margin: 0 0 0 5px;
      vertical-align: top;
    }
  }
}

.grid {
  &.grid-header {
    grid-template-columns: 1fr 420px;
  }
}

body.fullscreen {
  .header {
    display: none;
  }
}

@media (max-width: 768px) {
  .header {
    height: 48px;

    h1 {
      font-size: 1.1rem;
      padding-top: 15px;
      padding-left: 42px;
      background-size: auto 60%;
      background-position: 5px 6px;
    }

    .btn {
      padding: 8px 0;
      margin: 0 1px;
      min-width: 42px;

      i {
        margin: 0;
        font-size: 1.2rem;
      }
    }

    .himnario-tipo {
      padding: 6px 8px 0 0;
      span {
        display: none;
      }
    }
  }

  .grid {
    &.grid-header {
      grid-template-columns: 1fr 160px;
    }
  }

  .himnario-tipo {
    .btn span {
      display: none;
    }
  }
}
</style>
