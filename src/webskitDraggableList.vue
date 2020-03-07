<template>
  <ul class="wk-ul" ref="ul">
    <li v-for="(item, index) in list" :key="index">{{ item.name }}</li>
  </ul>
</template>

<script>
import WebsKitTool from 'webskit-nearest-elements'
import WebsKInViewport from 'webskit-is-element-in-viewport'
import WebsKOverlaps from 'webskit-get-overlaps-elements'

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
      let timer

      [].forEach.call(me.$refs.ul.querySelectorAll('li'), (el) => {
        el.style.transform = 'translate3d(0px, 0px, 0px)'
        el.addEventListener('transitionend', function (e) {
          if (e.propertyName === 'transform') {
            e.target.busy = false
            e.target.style.pointerEvents = ``
          }
        }, false)
        el.addEventListener('mousedown', e => {
          current = el
          clientX = e.clientX
          clientY = e.clientY
          const rect = current.getBoundingClientRect()
          clone = el.cloneNode(true)
          clone.style.position = 'fixed'
          clone.style.top = `${rect.top}px`
          clone.style.left = `${rect.left}px`
          clone.style.width = `${current.offsetWidth}px`
          clone.style.heith = `${current.offsetHeight}px`
          clone.style.transition = `none`
          clone.style.pointerEvents = `none`
          document.body.appendChild(clone)
          initialPos = { x: e.clientX, y: e.clientY }
          current.style.pointerEvents = `none`
          current.style.visibility = `hidden`
          current.classList.add('current')
          current.style.opacity = `0`
          current.style.transition = `none`
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
          clearTimeout(timer)
          requestAnimationFrame(checker)
          return
        }

        if ((clientX > initialPos.x + 50 || clientX < initialPos.x - 50)) {
          clearTimeout(timer)
          console.log('revert')
          finalIndex = getIndex(current);
          [].forEach.call(me.$refs.ul.querySelectorAll('li'), (el) => {
            if (el) {
              el.busy = false
              el.moved = false
              el.style.pointerEvents = ``
              el.style.transform = `translate3d(0px, 0px, 0px)`
            }
          })
          if (!current.reverted && !WebsKInViewport.isInViewport(current, me.$refs.ul).inView) {
            current.scrollIntoView({ block: 'center', behavior: 'smooth' })
            current.reverted = true
          }
        } else {
          let elements = me.$refs.ul.querySelectorAll('li:not(.current)')
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

          let overlaps = WebsKOverlaps.getOverlaps(clone, elements)

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
            handleScroll({ clientX: clientX, clientY: clientY }, me.$refs.ul, me.options.edgeSize, me.options.edgeSize, me.options.edgeSize, me.options.edgeSize)
          } else {
            clearTimeout(timer)
          }
        }

        requestAnimationFrame(checker)
      }

      const handleScroll = (event, container, et, el, eb, er) => {
        const viewportX = event.clientX
        const viewportY = event.clientY - container.offsetTop
        const viewportWidth = container.clientWidth
        const viewportHeight = container.clientHeight
        const edgeTop = et
        const edgeLeft = el
        const edgeBottom = viewportHeight - eb
        const edgeRight = viewportWidth - er
        const isInLeftEdge = viewportX < el
        const isInRightEdge = viewportX > edgeRight
        const isInTopEdge = viewportY < et
        const isInBottomEdge = viewportY > edgeBottom

        if (!(isInLeftEdge || isInRightEdge || isInTopEdge || isInBottomEdge)) {
          return
        }

        const documentWidth = container.scrollWidth
        const documentHeight = container.scrollHeight

        const maxScrollX = documentWidth - viewportWidth
        const maxScrollY = documentHeight - viewportHeight;

        (function checkForWindowScroll () {
          clearTimeout(timer)
          if (adjustWindowScroll()) {
            timer = setTimeout(checkForWindowScroll, 15)
          }
        })()

        function adjustWindowScroll () {
          const currentScrollX = container.scrollLeft
          const currentScrollY = container.scrollTop

          const canScrollUp = currentScrollY > 0
          const canScrollDown = currentScrollY < maxScrollY
          const canScrollLeft = currentScrollX > 0
          const canScrollRight = currentScrollX < maxScrollX
          // eslint-disable-next-line no-unused-vars
          let nextScrollX = currentScrollX
          let nextScrollY = currentScrollY
          const maxStep = 5
          let intensity

          if (isInLeftEdge && canScrollLeft) {
            intensity = (edgeLeft - viewportX) / el
            nextScrollX = nextScrollX - maxStep * intensity
          } else if (isInRightEdge && canScrollRight) {
            intensity = (viewportX - edgeRight) / er
            nextScrollX = nextScrollX + maxStep * intensity
          }

          if (isInTopEdge && canScrollUp) {
            intensity = (edgeTop - viewportY) / et
            // if (intensity >= 0.3) intensity = 0.1
            nextScrollY = nextScrollY - maxStep * intensity
          } else if (isInBottomEdge && canScrollDown) {
            intensity = (viewportY - edgeBottom) / eb
            nextScrollY = nextScrollY + maxStep * intensity
          }

          nextScrollX = Math.max(0, Math.min(maxScrollX, nextScrollX))
          nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY))

          if (nextScrollY !== currentScrollY) {
            container.scrollTo(0, nextScrollY)
            return true
          } else {
            return false
          }
        }
      }

      document.addEventListener('mouseup', async () => {
        dragAction = 'STOP'
        clearTimeout(timer)
        if (!dragging) {
          [].forEach.call(me.$refs.ul.querySelectorAll('li'), (el) => {
            if (el) {
              el.classList.remove('current')
              el.style.visibility = ``
              el.style.transition = ``
              el.style.pointerEvents = ``
              el.style.opacity = ``
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
            final.classList.remove('current')
            final.style.visibility = ``
            final.style.transition = ``
            final.style.pointerEvents = ``
            final.style.opacity = ``
          }

          [].forEach.call(me.$refs.ul.querySelectorAll('li'), (el) => {
            if (el) {
              el.busy = false
              el.moved = false
              el.classList.remove('current')
              el.style.pointerEvents = ``
              el.style.transition = `none`
              el.style.transform = `translate3d(0px, 0px, 0px)`
            }
          })

          clone.style.top = `0`
          clone.style.left = `0`
          clone.style.transition = `300ms`
          let originalRect = current.getBoundingClientRect()
          clone.style.transform = `translate3d(${originalRect.left}px, ${originalRect.top}px, 0px)`

          clone.addEventListener('transitionend', function () {
            clone && clone.parentNode && document.body.removeChild(clone)
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
