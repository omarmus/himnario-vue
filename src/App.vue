<template>
  <div id="app">
    <main>
      <app-header></app-header>
      <router-view></router-view>
      <app-footer></app-footer>
      <loading v-if="$store.state.loading"></loading>
    </main>
  </div>
</template>

<script>
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'
import Loading from '@/components/layout/Loading'

export default {
  name: 'app',
  components: {
    AppHeader,
    AppFooter,
    Loading
  }
}
</script>

<style lang="scss">
@import './assets/scss/index.scss';
</style>
