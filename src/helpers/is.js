export function isNil(value) {
  return value == null
}

export function isObject(value) {
  const type = typeof value
  return !isNil(value) && (type === 'object' || type === 'function')
}

function getTag(value) {
  return Object.prototype.toString.call(value)
}

export function isFunction(value) {
  const tag = getTag(value)
  return (
    tag === '[object Function]' ||
    tag === '[object AsyncFunction]' ||
    tag === '[object GeneratorFunction]' ||
    tag === '[object Proxy]'
  )
}

export function isNative(Construct) {
  return (
    typeof Construct === 'function' && /native code/.test(Construct.toString())
  )
}
