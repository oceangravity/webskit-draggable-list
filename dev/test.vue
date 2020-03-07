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

<style lang="scss">
    html, body {
        font-family: Montserrat,Helvetica Neue,Helvetica,arial,sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: rgba(244,245,249,.7);
        margin: 0;
        padding: 0;
        height: 100%;
    }

    body {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        display: flex;
    }

    .wk-ul {
        margin: 0 100px;
    }

    ul {
        position: relative;
        background-color: #f3f3f3;
        border: 1px solid #efefef;
        margin: 0 auto;
        padding: 0;
        width: 500px;
        max-height: 300px;
        overflow: auto;

        li {
            box-sizing: border-box;
        }
    }

    li {
        list-style-type: none;
        z-index: 0;
        transition: 300ms;
        pointer-events: all;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        width: 100%;
        padding: 20px;
        background-color: #fff;
        border-bottom: 1px solid #efefef;
        box-sizing: border-box;
        user-select: none;
        color: #333;
        font-weight: 400;
    }
</style>
