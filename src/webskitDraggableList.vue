<template>
  <ul class="wk-ul">
    <li>Item 0</li>
    <li>Item 1</li>
    <li>Item 2</li>
    <li style="height: 100px">Item 3</li>
    <li>Item 4</li>
    <li>Item 5</li>
    <li>Item 6</li>
  </ul>
</template>

<script>
export default {
  name: 'WebskitDraggableList',
  data () {
    return {
      dragging: false
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
    this.$nextTick(() => {
      let current
      let initialPos
      let clone
      let index = 0
      let clientX = 0
      let clientY = 0
      let dragging = false
      let data = [];

      [].forEach.call(document.querySelectorAll('li'), el => {
        el.style.transform = 'translate3d(0px, 0px, 0px)'
        el.setAttribute('index', index++)
        el.setAttribute('o', el.getAttribute('index'))
        el.originalIndex = el.getAttribute('index')
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
          dragging = true
        })
      })

      const getClosestElement = (elements, x, y) => {
        const distances = []
        const distance = (element, x, y) => {
          const mX = x
          const mY = y
          const from = { x: mX, y: mY }
          const offset = element.getBoundingClientRect()
          const nx1 = offset.left - document.querySelector('body').scrollLeft
          const ny1 = offset.top - document.querySelector('body').scrollTop
          const nx2 = nx1 + element.offsetWidth
          const ny2 = ny1 + element.offsetHeight
          const maxX1 = Math.max(mX, nx1)
          const minX2 = Math.min(mX, nx2)
          const maxY1 = Math.max(mY, ny1)
          const minY2 = Math.min(mY, ny2)
          const intersectX = minX2 >= maxX1
          const intersectY = minY2 >= maxY1
          const to = {
            x: intersectX ? mX : nx2 < mX ? nx2 : nx1,
            y: intersectY ? mY : ny2 < mY ? ny2 : ny1
          }
          const distX = to.x - from.x
          const distY = to.y - from.y
          return Math.sqrt(distX * distX + distY * distY)
        };

        [].forEach.call(elements, el => { distances.push({ el: el, distance: distance(el, x, y) }) })

        return distances.length ? distances.reduce((prev, curr) => prev.distance < curr.distance ? prev : curr) : { el: null, distance: null }
      }

      const mousemove = e => {
        clientX = e.clientX
        clientY = e.clientY

        if (!initialPos || !dragging) {
          return
        }
        let x = clientX - initialPos.x
        let y = clientY - initialPos.y
        clone.style.transform = `translate3d(${x}px, ${y}px, 0px)`
      }

      document.addEventListener('mousemove', mousemove)

      const getOverlaps = elements => {
        const rect1 = clone.getBoundingClientRect()
        let collide = [];
        [].forEach.call(elements, el => {
          const rect2 = el.getBoundingClientRect()
          if (!(rect1.top > rect2.bottom || rect1.right < rect2.left || rect1.bottom < rect2.top || rect1.left > rect2.right)) {
            collide.push(el)
          }
        })
        return collide
      }

      const checker = () => {
        if (!initialPos || !dragging) {
          requestAnimationFrame(checker)
          return
        }

        let elements = document.querySelectorAll('ul > li:not(.current)')
        let x = clone.getBoundingClientRect().left
        let y = clone.getBoundingClientRect().top

        data = []

        let o = getClosestElement(elements, x, y + clone.offsetHeight / 2)

        if (parseInt(current.getAttribute('o'), 10) > parseInt(o.el.getAttribute('o'), 10)) {
          o = getClosestElement(elements, x, y)
        } else {
          o = getClosestElement(elements, x, y + clone.offsetHeight)
        }

        let overlaps = getOverlaps(elements)

        if (overlaps.length === 1) {
          o.el = overlaps[0]
        }

        const collideElement = o.el
        const rect1 = collideElement.getBoundingClientRect()
        const rect2 = clone.getBoundingClientRect()
        let currentIndex = parseInt(current.getAttribute('o'), 10)

        if (!collideElement.busy) {
          if (rect1.top < rect2.top && rect2.top < rect1.top + collideElement.offsetHeight / 2) {
            if (collideElement.moved) {
              data.push({
                index: parseInt(collideElement.getAttribute('o'), 10),
                side: 'INIT'
              })
            } else {
              data.push({
                index: parseInt(collideElement.getAttribute('o'), 10),
                side: 'PRE'
              })
            }
          } else if (rect1.top + collideElement.offsetHeight / 2 < rect2.top + clone.offsetHeight) {
            if (collideElement.moved && currentIndex > parseInt(collideElement.getAttribute('o'), 10)) {
              data.push({
                index: parseInt(collideElement.getAttribute('o'), 10),
                side: 'INIT'
              })
            } else {
              data.push({
                index: parseInt(collideElement.getAttribute('o'), 10),
                side: 'POST'
              })
            }
          } else if (rect2.top < rect1.top + collideElement.offsetHeight / 2) {
            data.push({
              index: parseInt(collideElement.getAttribute('o'), 10),
              side: 'PRE'
            })
          } else if (rect1.top + collideElement.offsetHeight / 2 < rect2.top + clone.offsetHeight) {
            data.push({
              index: parseInt(collideElement.getAttribute('o'), 10),
              side: 'POST'
            })
          }
        }

        if (data.length) {
          let currentIndex = parseInt(current.getAttribute('o'), 10)
          let intersectIndex = data[0].index
          let lastNode = data[0]
          let side

          if (currentIndex > lastNode.index) {
            side = 'PRE'
          } else {
            side = 'POST'
          }

          let start = currentIndex < intersectIndex ? currentIndex : intersectIndex
          let end = currentIndex > intersectIndex ? currentIndex : intersectIndex

          const pool = {}
          for (let i = start; i <= end; i++) {
            pool[i] = { index: i, side: side }
          }

          if (side === 'PRE') {
            pool[start].side = data[0].side
          } else {
            pool[end].side = data[0].side
          }

          [].forEach.call(elements, (el) => {
            let uuid = parseInt(el.getAttribute('o'), 10)
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
        requestAnimationFrame(checker)
      }

      document.addEventListener('mouseup', () => {
        dragging = false

        if (current) {
          current.classList.remove('current')
          current.style.transform = `translate3d(0px, 0px, 0px)`
          current.style.visibility = ``
          current.style.transition = ``
          current.style.pointerEvents = ``
          current.style.opacity = ``
        }

        [].forEach.call(document.querySelectorAll('li'), el => {
          if (el) {
            el.busy = false
            el.style.pointerEvents = ``
          }
        })

        clone && clone.parentNode && document.body.removeChild(clone)
      })

      requestAnimationFrame(checker)
    })
  },
  destroyed () {
  },
  watch: {
  },
  methods: {
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
    pointer-events: none;
    background-color: #f3f3f3;
    border: 1px solid #efefef;
    margin: 0 auto;
    padding: 0;
    width: 500px;
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
