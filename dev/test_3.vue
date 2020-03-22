<template>
    <div id="app">
        <webskit-draggable-list v-model="list_A" :options="options_A" @start-drag="startDrag" @drop="drop">
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
        horizontal: true
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
      console.log(JSON.stringify(data))
    }
  },
  components: { webskitDraggableList },
  methods: {
    startDrag (a, b) {
      console.log(a, b)
    },
    drop (a, b, c) {
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

    ul {
        position: relative;
        background-color: #f3f3f3;
        border: 1px solid #efefef;
        margin: 0 auto;
        padding: 0;
        width: 500px;
        max-height: 300px;
        overflow: auto;
        white-space: nowrap;
    }

    li {
        box-sizing: border-box;
        list-style-type: none;
        z-index: 0;
        transition: 300ms;
        pointer-events: all;
        padding: 20px;
        background-color: #fff;
        border-bottom: 1px solid #efefef;
        user-select: none;
        color: #333;
        font-weight: 400;
        white-space: nowrap;
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }

    .list-B-drag-handle {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        background-color: #2c3e50;
    }

    .wk-dl-item-width {
        width: 200px;
    }
</style>
