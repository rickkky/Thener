import { isFunction, isObject } from './is'

export function getThenMethod(value) {
  if (!isObject(value)) {
    return undefined
  }

  const then = value.then

  if (!isFunction(then)) {
    return undefined
  }

  return then.bind(value)
}

export default getThenMethod
