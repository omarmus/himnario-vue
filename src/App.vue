<template>
  <div id="app">
    <main>
      <app-header></app-header>
      <router-view></router-view>
      <app-footer></app-footer>
    </main>
  </div>
</template>

<script>
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'

export default {
  name: 'app',
  components: {
    AppHeader,
    AppFooter
  }
}
</script>

<style lang="scss">
@import './assets/scss/index.scss';
</style>
