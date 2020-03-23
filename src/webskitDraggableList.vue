<template>
  <ul class="wk-ul" ref="ul">
    <li v-for="(item) in list" @mousedown="mousedown" :key="`item-${item.id}`" :class="{ 'wk-dl-opacity-zero' : item.opacityZero, 'wk-dl-item-width' : item.width }">
      <slot v-bind:item="item">
        {{ item[Object.keys(item)[0]] }}
      </slot>
    </li>
  </ul>
</template>

<script>
import WebsKitTool from 'webskit-nearest-elements'
import WebsKitInViewport from 'webskit-is-element-in-viewport'
import WebsKitOverlaps from 'webskit-get-overlaps-elements'
import WebsKitAutoScroll from 'webskit-auto-scroll-on-edges'

export default {
  name: 'WebskitDraggableList',
  data () {
    return {
      list: [],
      blocked: true,
      canScroll: false,
      current: null,
      clientX: 0,
      clientY: 0,
      clone: null,
      dragging: false,
      dragAction: 'STOP',
      initialPos: null,
      dummyInserted: false,
      listBackup: '',
      opts: {},
      dragEventFired: false,
      defaultOptions: {
        scrollTopEdge: false,
        scrollBottomEdge: false,
        scrollLeftEdge: false,
        scrollRightEdge: false,
        scrollContainer: false,
        limitSortableX: 100,
        minPixelsToDrag: 2,
        accepts: [],
        lockAxis: false,
        disableRemoteDrop: false,
        dragHandle: false,
        horizontal: false,
        cloneClass: 'wk-dl-clone--custom',
        cloneTransition: '300ms linear',
        disableDragFromChildElements: false
      }
    }
  },
  props: {
    value: {
      type: Array
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  mounted () {
    const me = this
    me.list = [...me.value]

    if (!me.options.widgetID) console.warn('WebsKit Draggable List: widgetID value is required ')

    me.$refs.ul.widgetID = me.options.widgetID
    me.$refs.ul.listData = me.options

    this.$nextTick(() => {
      let finalIndex
      let data = []
      let multi = false
      let linkList = false
      let scroll = new WebsKitAutoScroll()

      me.setTransitionEnd()

      const mousemove = e => {
        me.clientX = e.clientX
        me.clientY = e.clientY
        if ((me.dragAction === 'PRE-MOVE') && (e.clientX > me.initialPos.x + me.opts.minPixelsToDrag || e.clientY > me.initialPos.y + me.opts.minPixelsToDrag || e.clientX < me.initialPos.x - me.opts.minPixelsToDrag || e.clientY < me.initialPos.y - me.opts.minPixelsToDrag)) {
          me.dragging = true
          let x = me.clientX - me.initialPos.x
          let y = me.clientY - me.initialPos.y
          if (me.opts.lockAxis === 'x') {
            x = 0
          }
          if (me.opts.lockAxis === 'y') {
            y = 0
          }
          me.clone.style.transform = `translate3d(${x}px, ${y}px, 0px)`
          me.$emit('dragging', me.current, me.list[me.getIndex(me.current)])
          if (!me.dragEventFired) {
            me.$emit('start-drag', me.current, me.list[me.getIndex(me.current)])
            me.dragEventFired = true
          }
        }
      }

      const checker = async () => {
        if (document.querySelector('.wk-dl-clone--active')) {
          let o = WebsKitOverlaps.getOverlaps(document.querySelector('.wk-dl-clone--active'), document.querySelectorAll('ul:not(.wk-dl-ul-active)'))
          if (o.length === 1) {
            if (o[0] === me.$refs.ul && !me.opts.disableRemoteDrop && me.opts.accepts.find(w => w === document.querySelector('.wk-dl-clone--active').listData.widgetID)) {
              if (!me.dummyInserted) {
                me.blocked = true
                me.listBackup = JSON.stringify(me.list)
                let data = JSON.parse(document.querySelector('.wk-dl-clone--active').nodeData)
                data.opacityZero = true
                await me.list.push(data)
                me.$nextTick(() => {
                  me.dummyInserted = true
                })
              } else {
                me.$delete(me.list[me.list.length - 1], 'opacityZero')
                me.dragging = true
                multi = true
                me.initialPos = { x: 0, y: 0 }
                me.clone = document.querySelector('.wk-dl-clone--active')
                me.current = me.getElementByIndex(me.list.length - 1)
                me.current.classList.add('wk-dl-current')
              }
            } else if (o[0] && o[0].listData && o[0].listData.accepts && !o[0].listData.disableRemoteDrop && o[0].listData.accepts.find(w => w === document.querySelector('.wk-dl-clone--active').listData.widgetID)) {
              linkList = true
            }
          } else {
            multi = false
            linkList = false
            if (me.$refs.ul && !me.$refs.ul.classList.contains('wk-dl-ul-active')) {
              multi = false
              scroll.stop()
              me.dragging = false;
              [].forEach.call(me.$refs.ul.querySelectorAll('li'), (el) => {
                el.busy = false
                el.moved = false
                el.style.pointerEvents = ``
                el.style.transform = `translate3d(0px, 0px, 0px)`
              })
            }
          }
        } else {
          scroll.stop()
          requestAnimationFrame(checker)
          return
        }

        if (!me.initialPos || !me.dragging) {
          scroll.stop()
          requestAnimationFrame(checker)
          return
        }

        let checkLimit
        if (me.opts.horizontal) {
          checkLimit = false
        } else {
          checkLimit = (me.clientX > me.initialPos.x + me.opts.limitSortableX || me.clientX < me.initialPos.x - me.opts.limitSortableX)
        }

        if (checkLimit && !multi) {
          scroll.stop()
          finalIndex = me.getIndex(me.current);
          [].forEach.call(me.$refs.ul.querySelectorAll('li'), (el) => {
            if (el) {
              el.busy = false
              el.moved = false
              el.style.pointerEvents = ``
              el.style.transform = `translate3d(0px, 0px, 0px)`
            }
          })
          if (!me.current.reverted && !WebsKitInViewport.isInViewport(me.current, me.$refs.ul).inView) {
            me.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
            me.current.reverted = true
          }
        } else {
          let elements = me.$refs.ul.querySelectorAll('li:not(.wk-dl-current)')
          let x = me.clone.getBoundingClientRect().left
          let y = me.clone.getBoundingClientRect().top

          me.current.reverted = false
          data = []

          let o = WebsKitTool.getNearestAndFurthestElements(elements, me.opts.horizontal ? x + me.clone.offsetWidth / 2 : x, !me.opts.horizontal ? y + me.clone.offsetHeight / 2 : y).nearest

          if (!o.el) {
            scroll.stop()
            requestAnimationFrame(checker)
            return
          }

          o = WebsKitTool.getNearestAndFurthestElements(elements, me.opts.horizontal ? x + me.clone.offsetWidth / 2 : x, !me.opts.horizontal ? y + me.clone.offsetHeight / 2 : y).nearest

          let overlaps = WebsKitOverlaps.getOverlaps(me.clone, elements)

          if (overlaps.length === 1) {
            o.el = overlaps[0]
          }

          const collideElement = o.el
          const collideIndex = me.getIndex(collideElement)
          const rect1 = collideElement.getBoundingClientRect()
          const rect2 = me.clone.getBoundingClientRect()
          let currentIndex = me.getIndex(me.current)

          let mode = {}
          if (me.opts.horizontal) {
            mode.position = 'left'
            mode.size = 'width'
            mode.offset = 'offsetWidth'
          } else {
            mode.position = 'top'
            mode.size = 'height'
            mode.offset = 'offsetHeight'
          }

          if (!collideElement.busy) {
            if (rect1[mode.position] + rect1[mode.size] / 2 > rect2[mode.position] && rect2[mode.position] + rect2[mode.size] > rect1[mode.position] + rect1[mode.size] / 2) {
              if (currentIndex < collideIndex) {
                if (collideElement.moved) {
                  data.push({ index: collideIndex, side: 'INIT' })
                } else {
                  data.push({ index: collideIndex, side: 'POST' })
                }
              } else {
                if (collideElement.moved) {
                  data.push({ index: collideIndex, side: 'INIT' })
                } else {
                  data.push({ index: collideIndex, side: 'PRE' })
                }
              }
            }
          }

          if (data.length) {
            let currentIndex = me.getIndex(me.current)
            let intersectIndex = data[0].index
            let lastNode = data[0]
            let side
            let start = currentIndex < intersectIndex ? currentIndex : intersectIndex
            let end = currentIndex > intersectIndex ? currentIndex : intersectIndex
            side = currentIndex > lastNode.index ? 'PRE' : 'POST'
            const pool = {}
            const poolArr = []
            for (let i = start; i <= end; i++) {
              pool[i] = { index: i, side: side }
              poolArr.push({ index: i, side: side })
            }

            if (side === 'PRE') {
              pool[start].side = data[0].side
              poolArr[0].side = data[0].side
              let prePool = poolArr.filter(i => i.side === 'PRE')
              if (prePool) {
                finalIndex = prePool[0].index
              } else {
                finalIndex = currentIndex
              }
            } else {
              pool[end].side = data[0].side
              poolArr[poolArr.length - 1].side = data[0].side
              let prePool = poolArr.filter(o => o.side === 'POST')
              if (prePool) {
                finalIndex = prePool[prePool.length - 1].index
              } else {
                finalIndex = currentIndex
              }
            }

            [].forEach.call(elements, (el) => {
              let uuid = me.getIndex(el)
              let item = pool[uuid]
              if (item && item.side === 'INIT' && el.moved) {
                el.moved = false
                el.busy = true
                el.style.transform = `translate3d(0px, 0px, 0px)`
              }
              if (item && item.side === 'PRE' && side === 'POST' && el.moved) {
                el.moved = false
                el.busy = false
                el.style.transform = `translate3d(0px, 0px, 0px)`
              }
              if (item && item.side === 'POST' && side === 'PRE' && el.moved) {
                el.moved = false
                el.busy = false
                el.style.transform = `translate3d(0px, 0px, 0px)`
              }
              if (currentIndex > uuid && item && item.side === 'PRE' && el !== me.current && el !== me.clone && !el.moved) {
                el.busy = true
                el.moved = true
                el.style.transform = me.opts.horizontal ? `translate3d(${me.current.offsetWidth}px, 0px, 0px)` : `translate3d(0px, ${me.current.offsetHeight}px, 0px)`
              } else if (currentIndex < uuid && item && item.side === 'POST' && el !== me.current && el !== me.clone && !el.moved) {
                el.busy = true
                el.moved = true
                el.style.transform = me.opts.horizontal ? `translate3d(-${me.current.offsetWidth}px, 0px, 0px)` : `translate3d(0px, -${me.current.offsetHeight}px, 0px)`
              } else if (!item) {
                el.moved = false
                el.busy = false
                el.style.transform = `translate3d(0px, 0px, 0px)`
              }
            })
          }

          let checkScrollLimit
          if (me.opts.horizontal) {
            checkScrollLimit = (me.clientX > me.initialPos.x + rect2.width || me.clientX < me.initialPos.x - rect2.width)
          } else {
            checkScrollLimit = (me.clientY > me.initialPos.y + rect2.height || me.clientY < me.initialPos.y - rect2.height)
          }

          if (checkScrollLimit || me.canScroll) {
            me.canScroll = true
            scroll.handle({ clientX: rect2.left, clientY: rect2.top }, me.opts.scrollContainer || me.$refs.ul, me.opts.scrollTopEdge || rect2.height, me.opts.scrollLeftEdge || rect2.width, me.opts.scrollBottomEdge || rect2.height, me.opts.scrollRightEdge || rect2.width, rect2.height, rect2.width)
          } else {
            scroll.stop()
          }
        }

        requestAnimationFrame(checker)
      }

      document.addEventListener('mouseup', () => {
        me.dragAction = 'STOP'
        me.dragEventFired = false
        scroll.stop()

        if (linkList) {
          linkList = false
          multi = false
          me.dragging = false
          me.dummyInserted = false
          me.canScroll = false
          me.$refs.ul.classList.remove('wk-dl-ul-active')
          let currentIndex = me.getIndex(me.current)
          this.list.splice(currentIndex, 1);
          [].forEach.call(me.$refs.ul.querySelectorAll('li'), (el) => {
            el.busy = false
            el.moved = false
            el.classList.remove('wk-dl-current')
            el.style.transform = ``
          })
          me.setTransitionEnd()
          me.$emit('input', JSON.parse(JSON.stringify(me.list)))
          me.$emit('origin-update', me.current, me.list, me.list[me.getIndex(me.current)])
          return
        }
        if (!me.dragging && me.$refs.ul) {
          if (me.dummyInserted) {
            me.$set(me, 'list', JSON.parse(me.listBackup))
            me.dummyInserted = false
          }
          me.$nextTick(() => {
            [].forEach.call(me.$refs.ul.querySelectorAll('li'), async (el) => {
              if (el) {
                el.classList.remove('wk-dl-current')
              }
            })
            if (me.$refs.ul.classList.contains('wk-dl-ul-active')) {
              me.clone && me.clone.parentNode && document.body.removeChild(me.clone)
            }
          })
          return
        }

        me.dragging = false

        let cloneRect = me.clone.getBoundingClientRect()
        me.clone.style.transform = `translate3d(${cloneRect.left - parseFloat(me.clone.style.left)}px, ${cloneRect.top - parseFloat(me.clone.style.top)}px, 0px)`

        let currentIndex = me.getIndex(me.current)
        if (finalIndex === undefined) finalIndex = currentIndex
        me.update(currentIndex, finalIndex)

        me.$nextTick(() => {
          me.clone.classList.remove('wk-dl-clone--active');
          [].forEach.call(me.$refs.ul.querySelectorAll('li'), (el) => {
            el.busy = false
            el.moved = false
            el.classList.remove('wk-dl-current')
            el.style.transitionDuration = `0s`
            el.style.transform = ``
            setTimeout(() => {
              el.style.transitionDuration = ``
            }, 1)
          })
          let current = me.getElementByIndex(finalIndex)
          me.$refs.ul.classList.remove('wk-dl-ul-active')
          multi = false
          me.dummyInserted = false
          me.canScroll = false
          current.style.visibility = `hidden`
          current.style.opacity = `0`

          me.$nextTick(() => {
            me.clone.style.transition = me.opts.cloneTransition
            me.clone.addEventListener('transitionend', function () {
              current.style.transitionDuration = `0s`
              current.style.visibility = ``
              current.style.opacity = ``
              setTimeout(() => {
                current.style.transitionDuration = ``
                me.clone && me.clone.parentNode && document.body.removeChild(me.clone)
              }, 1)
            }, false)
            let originalRect = current.getBoundingClientRect()
            me.clone.style.transform = `translate3d(${originalRect.left - parseFloat(me.clone.style.left)}px, ${originalRect.top - parseFloat(me.clone.style.top)}px, 0px)`
            me.setTransitionEnd()
            if (currentIndex !== finalIndex) {
              me.$emit('input', JSON.parse(JSON.stringify(me.list)))
              me.$emit('drop', current, me.list, me.list[me.getIndex(current)])
            }
          })
        })
      })

      document.addEventListener('mousemove', mousemove)

      requestAnimationFrame(checker)
    })
  },
  destroyed () {
  },
  watch: {
    options: {
      immediate: true,
      deep: true,
      handler: function () {
        let opts = { ...this.defaultOptions, ...this.options }
        opts.accepts = [...this.defaultOptions.accepts, ...this.options.accepts || []]
        this.$set(this, 'opts', opts)
      }
    }
  },
  methods: {
    update (from, to) {
      this.list.splice(to, 0, this.list.splice(from, 1)[0])
    },
    getElementByIndex (index) {
      return [...this.$refs.ul.querySelectorAll('li')][index]
    },
    mousedown (e) {
      const me = this
      let target = e.target

      if (me.opts.dragHandle && !target.classList.contains(me.opts.dragHandle)) {
        return
      } else if (!me.opts.dragHandle && me.opts.disableDragFromChildElements) {
        if (me.getIndex(target) < 0) {
          return
        }
      }

      if (me.opts.dragHandle) {
        target = target.closest('LI')
      } else {
        if (target.tagName !== 'LI') {
          target = target.closest('LI')
        }
      }

      me.$emit('element-mousedown', target, me.list[me.getIndex(target)]);

      [].forEach.call(me.$refs.ul.querySelectorAll('li'), (el) => {
        el.style.visibility = ``
        el.style.opacity = ``
      })

      me.$refs.ul.classList.add('wk-dl-ul-active');
      [].forEach.call(document.querySelectorAll('.wk-dl-clone'), el => {
        document.body.removeChild(el)
      })
      me.current = target
      me.clientX = e.clientX
      me.clientY = e.clientY
      const rect = me.current.getBoundingClientRect()
      me.clone = target.cloneNode(true)
      me.clone.classList.add(me.opts.cloneClass)
      me.clone.classList.add('wk-dl-clone')
      me.clone.classList.add('wk-dl-clone--active')
      me.clone.style.top = `${rect.top}px`
      me.clone.style.left = `${rect.left}px`
      me.clone.style.width = `${me.current.offsetWidth}px`
      me.clone.style.heith = `${me.current.offsetHeight}px`
      me.clone.nodeData = JSON.stringify(me.list[me.getIndex(me.current)])
      me.clone.listData = me.options
      document.body.appendChild(me.clone)
      me.initialPos = { x: e.clientX, y: e.clientY }
      me.current.classList.add('wk-dl-current')
      me.dragAction = 'PRE-MOVE'
    },
    getIndex (el) {
      return [...this.$refs.ul.querySelectorAll('li')].indexOf(el)
    },
    setTransitionEnd () {
      const me = this;
      [].forEach.call(me.$refs.ul.querySelectorAll('li'), (el) => {
        const ontransitionend = function (e) {
          if (e.propertyName === 'transform') {
            e.target.busy = false
            e.target.style.pointerEvents = ``
          }
        }
        el.removeEventListener('transitionend', ontransitionend, false)
        el.addEventListener('transitionend', ontransitionend, false)
      })
    }
  },
  computed: {
  }
}
</script>

<style lang="scss">
  .wk-dl-clone {
    z-index: 999999999 !important;
    position: fixed !important;
    transition: none;
    pointer-events: none !important;
  }

  .wk-dl-current {
    transition: none;
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
  }

  .wk-dl-opacity-zero {
    opacity: 0 !important;
  }
</style>
