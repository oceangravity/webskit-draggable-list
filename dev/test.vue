<template>
    <div id="app">
        <webskit-draggable-list></webskit-draggable-list>
        <webskit-draggable-list></webskit-draggable-list>
    </div>
</template>

<script>
import webskitDraggableList from '../src/webskitDraggableList'

export default {
  name: 'App',
  data () {
    return {
    }
  },
  methods: {
    test () {
    }
  },
  components: { webskitDraggableList }
}
</script>

<style>
    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 160px;
        display: flex;
    }

    .wk-ul {
        margin: 0 100px;
    }
</style>
