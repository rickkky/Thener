import getThenMethod from '../utils/getThenMethod'
import { isNil } from '../utils/is'

// execute the promise resolution procedure, see:
// https://promisesaplus.com/#the-promise-resolution-procedure
export function executePRP(thener, x) {
  let then = undefined

  try {
    then = getThenMethod(x)
  } catch (error) {
    thener._solve(false, error)
    return
  }

  if (isNil(then)) {
    thener._solve(true, x)
    return
  }

  if (x === thener) {
    thener._solve(
      false,
      new TypeError(`chaining cycle detected for promise ${x}`),
    )
    return
  }

  // if (x instanceof thener._Thener) {
  //   then(
  //     (value) => thener._executePRP(value),
  //     (reason) => thener._solve(false, reason),
  //   )
  //   return
  // }

  thener._executeEntry(then)
}

export default executePRP
