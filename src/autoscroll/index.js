/* eslint-disable */
class AutoScroll {
  constructor () {
    this.timer = null
  }

  info (event, container, et, el, eb, er, yBottom = 0) {
    const me = this
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
    const isInBottomEdge = (viewportY + yBottom) > edgeBottom

    // console.log((edgeTop - viewportY) / et)
  }

  handle (event, container, et, el, eb, er, yBottom = 0) {
    const me = this
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
    const isInBottomEdge = (viewportY + yBottom) > edgeBottom

    if (!(isInLeftEdge || isInRightEdge || isInTopEdge || isInBottomEdge)) {
      return
    }

    const documentWidth = container.scrollWidth
    const documentHeight = container.scrollHeight

    const maxScrollX = documentWidth - viewportWidth
    const maxScrollY = documentHeight - viewportHeight;

    (function checkForWindowScroll () {
      clearTimeout(me.timer)
      if (adjustWindowScroll()) {
        me.timer = setTimeout(checkForWindowScroll, 15)
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
        intensity = ((viewportY + yBottom) - edgeBottom) / eb
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

  stop () {
    clearTimeout(this.timer)
  }
}

export default AutoScroll
