<template>
    <div>
      <div class="menu">
        <router-link to="/test_0">Single</router-link>
        <router-link to="/test_1">Multi</router-link>
        <router-link to="/test_2">UI</router-link>
        <router-link to="/test_3">Lock Axis</router-link>
      </div>
      <router-view></router-view>
    </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style lang="scss">
    html, body {
        font-family: Montserrat, Helvetica Neue, Helvetica, arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: rgba(244, 245, 249, .7);
        margin: 0;
        padding: 0;
        height: 100%;
    }

    .menu {
      display: grid;
      grid-auto-flow: column;
      grid-gap: 1em;
      position: absolute;
      top: 0;
      left: 0;
      padding: 1em;
    }
</style>
