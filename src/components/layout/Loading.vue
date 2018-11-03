<template>
  <div class="loading">
    <div class="loading__text">Cargando página</div>
  </div>
</template>

<style lang="scss">
@import '../../assets/scss/_variables.scss';

.loading {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba($primary, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading__text {
  color: #fafafa;
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .loading__text {
    font-size: 1.2rem;
  }
}
</style>
