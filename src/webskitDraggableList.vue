<template>
  <ul class="wk-ul" ref="ul">
    <li v-for="(item, index) in list" :key="index">{{ item.name }}</li>
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
      dragging: false,
      list: [
        { name: 'Item 1' },
        { name: 'Item 2' },
        { name: 'Item 3' },
        { name: 'Item 4' },
        { name: 'Item 5' },
        { name: 'Item 6' },
        { name: 'Item 7' },
        { name: 'Item 8' },
        { name: 'Item 9' },
        { name: 'Item 10' }
      ]
    }
  },
  computed: {
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    options: {
      type: Object,
      default: function () {
        return {
          edgeSize: 50,
          size: 120,
          arcColor: 'rgb(53, 57, 60)',
          arcBackgroundColor: '#9b9bb5',
          internalCircleBackgroundColor: '#4d4d5a',
          handleColor: 'white',
          setPositionColor: 'gray',
          textColor: '#b4d5d8'
        }
      }
    }
  },
  mounted () {
    const me = this
    this.$nextTick(() => {
      let current
      let initialPos
      let clone
      let clientX = 0
      let clientY = 0
      let dragging = false
      let dragAction = 'STOP'
      let finalIndex
      let data = []
      let scroll = new WebsKitAutoScroll();

      [].forEach.call(me.$refs.ul.querySelectorAll('li'), (el) => {
        el.style.transform = 'translate3d(0px, 0px, 0px)'
        el.addEventListener('transitionend', function (e) {
          if (e.propertyName === 'transform') {
            e.target.busy = false
            e.target.style.pointerEvents = ``
          }
        }, false)
        el.addEventListener('mousedown', e => {
          [].forEach.call(document.querySelectorAll('.wk-dl-clone'), el => {
            document.body.removeChild(el)
          })
          current = el
          clientX = e.clientX
          clientY = e.clientY
          const rect = current.getBoundingClientRect()
          clone = el.cloneNode(true)
          clone.classList.add('wk-dl-clone')
          clone.style.top = `${rect.top}px`
          clone.style.left = `${rect.left}px`
          clone.style.width = `${current.offsetWidth}px`
          clone.style.heith = `${current.offsetHeight}px`
          document.body.appendChild(clone)
          initialPos = { x: e.clientX, y: e.clientY }
          current.classList.add('wk-dl-current')
          dragAction = 'PRE-MOVE'
        })
      })

      const mousemove = e => {
        clientX = e.clientX
        clientY = e.clientY
        if ((dragAction === 'PRE-MOVE') && (e.clientX > initialPos.x + 2 || e.clientY > initialPos.y + 2 || e.clientX < initialPos.x - 2 || e.clientY < initialPos.y - 2)) {
          dragging = true
          let x = clientX - initialPos.x
          let y = clientY - initialPos.y
          clone.style.transform = `translate3d(${x}px, ${y}px, 0px)`
        }
      }

      const getIndex = (el) => [...me.$refs.ul.querySelectorAll('li')].indexOf(el)

      const getElementByIndex = (index) => [...me.$refs.ul.querySelectorAll('li')][index]

      const checker = () => {
        if (!initialPos || !dragging) {
          scroll.stop()
          requestAnimationFrame(checker)
          return
        }

        if ((clientX > initialPos.x + 50 || clientX < initialPos.x - 50)) {
          scroll.stop()
          finalIndex = getIndex(current);
          [].forEach.call(me.$refs.ul.querySelectorAll('li'), (el) => {
            if (el) {
              el.busy = false
              el.moved = false
              el.style.pointerEvents = ``
              el.style.transform = `translate3d(0px, 0px, 0px)`
            }
          })
          if (!current.reverted && !WebsKitInViewport.isInViewport(current, me.$refs.ul).inView) {
            current.scrollIntoView({ block: 'center', behavior: 'smooth' })
            current.reverted = true
          }
        } else {
          let elements = me.$refs.ul.querySelectorAll('li:not(.wk-dl-current)')
          let x = clone.getBoundingClientRect().left
          let y = clone.getBoundingClientRect().top

          current.reverted = false
          data = []

          let o = WebsKitTool.getNearestAndFurthestElements(elements, x, y + clone.offsetHeight / 2).nearest

          if (getIndex(current) > getIndex(o.el)) {
            o = WebsKitTool.getNearestAndFurthestElements(elements, x, y).nearest
          } else {
            o = WebsKitTool.getNearestAndFurthestElements(elements, x, y + clone.offsetHeight).nearest
          }

          let overlaps = WebsKitOverlaps.getOverlaps(clone, elements)

          if (overlaps.length === 1) {
            o.el = overlaps[0]
          }

          const collideElement = o.el
          const collideIndex = getIndex(collideElement)
          const rect1 = collideElement.getBoundingClientRect()
          const rect2 = clone.getBoundingClientRect()
          let currentIndex = getIndex(current)

          if (!collideElement.busy) {
            if (rect1.top < rect2.top && rect2.top < rect1.top + collideElement.offsetHeight / 2) {
              if (collideElement.moved) {
                data.push({ index: collideIndex, side: 'INIT' })
              } else {
                if (overlaps.length > 1) {
                  data.push({ index: getIndex(overlaps[overlaps.length - 2]), side: 'POST' })
                } else {
                  data.push({ index: collideIndex, side: 'PRE' })
                }
              }
            } else if (rect1.top + collideElement.offsetHeight / 2 < rect2.top + clone.offsetHeight) {
              if (collideElement.moved && currentIndex > collideIndex) {
                data.push({ index: collideIndex, side: 'INIT' })
              } else {
                if (overlaps.length > 1) {
                  data.push({ index: getIndex(overlaps[1]), side: 'PRE' })
                } else {
                  data.push({ index: collideIndex, side: 'POST' })
                }
              }
            } else if (rect2.top < rect1.top + collideElement.offsetHeight / 2) {
              data.push({ index: collideIndex, side: 'PRE' })
            } else if (rect1.top + collideElement.offsetHeight / 2 < rect2.top + clone.offsetHeight) {
              data.push({ index: collideIndex, side: 'POST' })
            }
          }

          if (data.length) {
            let currentIndex = getIndex(current)
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
              let uuid = getIndex(el)
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
              if (currentIndex > uuid && item && item.side === 'PRE' && el !== current && el !== clone && !el.moved) {
                el.busy = true
                el.moved = true
                el.style.transform = `translate3d(0px, ${current.offsetHeight}px, 0px)`
              } else if (currentIndex < uuid && item && item.side === 'POST' && el !== current && el !== clone && !el.moved) {
                el.busy = true
                el.moved = true
                el.style.transform = `translate3d(0px, -${ current.offsetHeight }px, 0px)`
              } else if (!item) {
                el.moved = false
                el.busy = false
                el.style.transform = `translate3d(0px, 0px, 0px)`
              }
            })
          }

          if ((clientY > initialPos.y + 50 || clientY < initialPos.y - 50)) {
            scroll.handle({ clientX: clientX, clientY: clientY }, me.$refs.ul, me.options.edgeSize, me.options.edgeSize, me.options.edgeSize, me.options.edgeSize)
          } else {
            scroll.stop()
          }
        }

        requestAnimationFrame(checker)
      }

      document.addEventListener('mouseup', async () => {
        dragAction = 'STOP'
        scroll.stop()
        if (!dragging) {
          [].forEach.call(me.$refs.ul.querySelectorAll('li'), (el) => {
            if (el) {
              el.classList.remove('wk-dl-current')
            }
          })
          clone && clone.parentNode && document.body.removeChild(clone)
          return
        }
        dragging = false
        let currentIndex = getIndex(current)
        await me.update(currentIndex, finalIndex)

        me.$nextTick(() => {
          let current = getElementByIndex(finalIndex)
          let final = getElementByIndex(currentIndex)
          current.style.visibility = `none`
          current.style.transition = `none`
          current.style.pointerEvents = `none`
          current.style.opacity = `0`
          if (currentIndex !== finalIndex) {
            final.classList.remove('wk-dl-current')
            final.style.visibility = ``
            final.style.transition = ``
            final.style.pointerEvents = ``
            final.style.opacity = ``
          }

          [].forEach.call(me.$refs.ul.querySelectorAll('li'), (el) => {
            if (el) {
              el.busy = false
              el.moved = false
              el.classList.remove('wk-dl-current')
              el.style.pointerEvents = ``
              el.style.transition = `none`
              el.style.transform = `translate3d(0px, 0px, 0px)`
            }
          })

          clone.style.top = `0`
          clone.style.left = `0`
          clone.style.transition = `100ms`
          let originalRect = current.getBoundingClientRect()
          clone.style.transform = `translate3d(${originalRect.left}px, ${originalRect.top}px, 0px)`

          clone.addEventListener('transitionend', function () {
            current.style.visibility = ``
            current.style.transition = `none`
            current.style.pointerEvents = ``
            current.style.opacity = ``
            setTimeout(() => {
              [].forEach.call(me.$refs.ul.querySelectorAll('li'), el => {
                if (el) {
                  el.style.transition = ``
                }
              })
              clone && clone.parentNode && document.body.removeChild(clone)
            }, 10)
          }, false)
        })
      })

      document.addEventListener('mousemove', mousemove)
      requestAnimationFrame(checker)
    })
  },
  destroyed () {
  },
  watch: {
  },
  methods: {
    update (from, to) {
      this.list.splice(to, 0, this.list.splice(from, 1)[0])
    }
  }
}
</script>

<style lang="scss">
  .wk-dl-clone {
    position: fixed;
    transition: none;
    pointer-events: none;
  }

  .wk-dl-current {
    transition: none;
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
  }
</style>
