<template>
    <div id="app">
        <webskit-draggable-list v-model="list_A" :options="options_A">
            <template slot-scope="{ item }">
                <span v-if="item.isComplete">✓</span>
                {{ item.name }}
                <p>
                    <value v-model="item.value"></value>
                </p>
            </template>
        </webskit-draggable-list>
        <webskit-draggable-list v-model="list_A" :options="options_B">
            <template slot-scope="{ item }">
                {{ item.name }} <strong style="padding-left: 10px"> {{ item.value ? item.value : 0 }}</strong>
            </template>
        </webskit-draggable-list>
    </div>
</template>

<script>
import webskitDraggableList from '../src/webskitDraggableList'
import value from './value'

export default {
  name: 'App',
  data () {
    return {
      options_A: {
        widgetID: 'list-A',
        disableDragFromChildElements: true
      },
      options_B: {
        widgetID: 'list-B'
      },
      list_A: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2', isComplete: true },
        { id: 3, name: 'Item 3' },
        { id: 4, name: 'Item 4' },
        { id: 5, name: 'Item 5' },
        { id: 6, name: 'Item 6' },
        { id: 7, name: 'Item 7' },
        { id: 8, name: 'Item 8' },
        { id: 9, name: 'Item 9' },
        { id: 10, name: 'Item 10' }
      ],
      list_B: [
        { id: 11, name: 'Item A' },
        { id: 12, name: 'Item B' },
        { id: 13, name: 'Item C' },
        { id: 14, name: 'Item D' },
        { id: 15, name: 'Item E' },
        { id: 16, name: 'Item F' },
        { id: 17, name: 'Item G' },
        { id: 18, name: 'Item H', isComplete: true },
        { id: 19, name: 'Item I' },
        { id: 20, name: 'Item J' }
      ]
    }
  },
  methods: {
    test () {
    }
  },
  watch: {
    list_A: function (data) {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(data))
    },
    list_B: function (data) {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(data))
    }
  },
  components: { webskitDraggableList, value }
}
</script>

<style lang="scss" scoped>
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
