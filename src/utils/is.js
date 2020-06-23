export function isNil(value) {
  return value == null
}

export function isObject(value) {
  const type = typeof value
  return !isNil(value) && (type === 'object' || type === 'function')
}

export function isFunction(value) {
  return typeof value === 'function'
}

export function isNative(Construct) {
  return isFunction(Construct) && /\[native code\]/.test(Construct.toString())
}
