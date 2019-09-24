import { isNative } from './is'

let callbacks = []
let pending = false
let asyncHandler = selectAsyncHandler()

function selectAsyncHandler() {
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const promise = Promise.resolve()
    return () => promise.then(nextTickHandler)
  }

  if (typeof MutationObserver !== 'undefined' && isNative(MutationObserver)) {
    const observer = new MutationObserver(nextTickHandler)
    const textNode = document.createTextNode('1')
    observer.observe(textNode, { characterData: true })
    return () => (textNode.data = (textNode.data + 1) % 2)
  }

  return setTimeout.bind(undefined, nextTickHandler, 4)
}

function nextTickHandler() {
  pending = false
  const copies = callbacks.slice(0)
  callbacks = []
  copies.forEach((cb) => cb())
}

export default function nextTick(cb, ctx) {
  callbacks.push(ctx ? cb.bind(ctx) : cb)

  if (!pending) {
    pending = true
    asyncHandler()
  }
}
