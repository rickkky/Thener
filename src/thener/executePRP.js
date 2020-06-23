import getThenMethod from '../utils/getThenMethod'
import solve from './solve'
import { isNil } from '../utils/is'
import Thener from './Thener'
import executeEntry from './executeEntry'

// execute the promise resolution procedure, see:
// https://promisesaplus.com/#the-promise-resolution-procedure
export function executePRP(thener, value) {
  let then = undefined

  try {
    then = getThenMethod(value)
  } catch (error) {
    solve(thener, false, error)
    return
  }

  if (isNil(then)) {
    solve(thener, true, value)
    return
  }

  if (value === thener) {
    solve(
      thener,
      false,
      new TypeError(`chaining cycle detected for promise ${value}`),
    )
    return
  }

  if (value instanceof Thener) {
    then(
      (value) => executePRP(thener, value),
      (reason) => solve(thener, false, reason),
    )
    return
  }

  executeEntry(thener, then)
}

export default executePRP
