<template>
  <h1>{{content}}</h1>
</template>
<style scoped>
  h1 {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    font-weight: 200;
    font-size: 100px;
    color: #414141;
  }
</style>
<script>
  exports = {
    props: ['content']
  }
</script>
