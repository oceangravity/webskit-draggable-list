<template>
    <div id="app">
        <webskit-draggable-list v-model="list_A" class="lock-axis test" :options="options_A" @start-drag="startDrag" @drop="drop">
            <template slot-scope="{ item }">
                <strong>{{ item.name }}</strong>
            </template>
        </webskit-draggable-list>
    </div>
</template>

<script>
import webskitDraggableList from '../src/webskitDraggableList'

export default {
  name: 'App',
  data () {
    return {
      options_A: {
        widgetID: 'list-A',
        accepts: ['list-B'],
        horizontal: true,
        lockAxis: 'y'
      },
      list_A: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2', isComplete: true },
        { id: 3, name: 'Item 3' },
        { id: 4, name: 'Item 4', width: true },
        { id: 5, name: 'Item 5' },
        { id: 6, name: 'Item 6' },
        { id: 7, name: 'Item 7' },
        { id: 8, name: 'Item 8' },
        { id: 9, name: 'Item 9' },
        { id: 10, name: 'Item 10' }
      ]
    }
  },
  watch: {
    list_A: function (data) {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(data))
    }
  },
  components: { webskitDraggableList },
  methods: {
    startDrag (a, b) {
      // eslint-disable-next-line no-console
      console.log(a, b)
    },
    drop (a, b, c) {
      // eslint-disable-next-line no-console
      console.log(a, b, c)
    }
  }
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

    body {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        display: flex;
    }

    .wk-ul {
        margin: 0 100px;
    }

    ul.lock-axis {
      position: relative;
      background-color: #f3f3f3;
      border: 1px solid #efefef;
      margin: 0 auto;
      padding: 0;
      width: 500px;
      max-height: 300px;
      overflow: auto;
      white-space: nowrap;

      li {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        box-sizing: border-box;
        list-style-type: none;
        z-index: 0;
        transition: 300ms;
        pointer-events: all;
        padding: 20px;
        background-color: #fff;
        user-select: none;
        color: #333;
        font-weight: 400;
        white-space: nowrap;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border: solid 1px lightblue;
        width: auto;
      }
    }

    .wk-dl-clone {
      font-family: "Avenir", Helvetica, Arial, sans-serif;
      box-sizing: border-box;
      list-style-type: none;
      z-index: 0;
      pointer-events: all;
      padding: 20px;
      background-color: #fff;
      user-select: none;
      color: #333;
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      border: solid 1px lightblue;
    }
</style>
