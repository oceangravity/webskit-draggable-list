<template>
    <div id="app">
        <webskit-draggable-list v-model="list_A">
            <template slot-scope="{ item }">
                <span v-if="item.isComplete">✓</span>
                {{ item.name }}
                <p>
                    <value v-model="item.value"></value>
                </p>
            </template>
        </webskit-draggable-list>
        <webskit-draggable-list v-model="list_B">
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
      list_A: [
        { name: 'Item 1', value: 100 },
        { name: 'Item 2', value: 100, isComplete: true },
        { name: 'Item 3', value: 100 },
        { name: 'Item 4', value: 100 },
        { name: 'Item 5', value: 100 },
        { name: 'Item 6', value: 100 },
        { name: 'Item 7', value: 100 },
        { name: 'Item 8', value: 100 },
        { name: 'Item 9', value: 100 },
        { name: 'Item 10', value: 100 }
      ],
      list_B: [
        { name: 'Item A' },
        { name: 'Item B' },
        { name: 'Item C' },
        { name: 'Item D' },
        { name: 'Item E' },
        { name: 'Item F' },
        { name: 'Item G' },
        { name: 'Item H' },
        { name: 'Item I' },
        { name: 'Item J' }
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
