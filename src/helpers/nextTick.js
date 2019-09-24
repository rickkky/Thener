let callbacks = []
let pending = false
let asyncHandler = setTimeout.bind(null, handleNextTick, 0)

function handleNextTick() {
  const copies = callbacks.slice(0)

  pending = false
  callbacks = []

  copies.forEach((callback) => {
    callback()
  })
}

if (typeof MutationObserver !== 'undefined') {
  let observer = new MutationObserver(handleNextTick)
  const textNode = document.createTextNode(1)

  observer.observe(textNode, { characterData: true })

  asyncHandler = function() {
    textNode.data = (textNode.data + 1) % 2
  }
}

const nextTick = function(callback, context) {
  callbacks.push(context ? callback.bind(context) : callback)

  if (pending) {
    return
  }

  pending = true
  asyncHandler()
}

export default nextTick
