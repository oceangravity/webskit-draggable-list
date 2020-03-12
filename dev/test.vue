<template>
    <div id="app">
        <webskit-draggable-list v-model="list_A">
            <template slot-scope="{ item }">
                <span v-if="item.isComplete">✓</span>
                {{ item.name }}
                <p>
                    <keep-alive>
                        <value :key="item.id"></value>
                    </keep-alive>
                </p>
            </template>
        </webskit-draggable-list>
        <webskit-draggable-list v-model="list_B"></webskit-draggable-list>
    </div>
</template>

<script>
import webskitDraggableList from '../src/webskitDraggableList'
import value from './value'

export default {
  name: 'App',
  data () {
    return {
      list_A: [
        { id: 'N348DF43TH', name: 'Item 1' },
        { id: 'W4D9MJ57TS', name: 'Item 2', isComplete: true },
        { id: '98S57YGJT9', name: 'Item 3' },
        { id: 'O345UHGXGW', name: 'Item 4' },
        { id: 'D354Y23D4Y', name: 'Item 5' },
        { id: 'D5Y2DY2Y2Y', name: 'Item 6' },
        { id: 'DCH45BYUH3', name: 'Item 7' },
        { id: '5B245YTV4F', name: 'Item 8' },
        { id: 'YD3465U45D', name: 'Item 9' },
        { id: 'GV4Y524F5Y', name: 'Item 10' }
      ],
      list_B: [
        { id: 'N348DF43TH', name: 'Item A' },
        { id: 'W4D9MJ57TS', name: 'Item B' },
        { id: '98S57YGJT9', name: 'Item C' },
        { id: 'O345UHGXGW', name: 'Item D' },
        { id: 'D354Y23D4Y', name: 'Item E' },
        { id: 'D5Y2DY2Y2Y', name: 'Item F' },
        { id: 'DCH45BYUH3', name: 'Item G' },
        { id: '5B245YTV4F', name: 'Item H' },
        { id: 'YD3465U45D', name: 'Item I' },
        { id: 'GV4Y524F5Y', name: 'Item J' }
      ]
    }
  },
  methods: {
    test () {
    }
  },
  watch: {
    list_A: function (data) {
      console.log(JSON.stringify(data))
    },
    list_B: function (data) {
      console.log(JSON.stringify(data))
    }
  },
  components: { webskitDraggableList, value }
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
