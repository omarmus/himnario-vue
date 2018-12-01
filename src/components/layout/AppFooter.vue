<template>
  <footer class="footer">
    <a href="https://omarmus.com" target="_blank">omarmus.com</a>
  </footer>
</template>

<style lang="scss">
.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 5px 10px;
  font-size: .7rem;
  background-color: rgba(255, 255, 255, .6);
  border-radius: 10px 0 0 0;

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
