import { status, answer, PENDING, FULFILLED } from './symbols'
import solve from './solve'
import executePRP from './executePRP'
import nextTick from '../utils/nextTick'

export function executeThenAction(thisThener, action) {
  const state = thisThener[status]
  const value = thisThener[answer]

  if (state === PENDING) {
    return
  }

  const { onFulfilled, onRejected, thener } = action
  const handler = state === FULFILLED ? onFulfilled : onRejected

  const caller = () => {
    let x = undefined

    try {
      x = handler(value)
    } catch (error) {
      solve(thener, false, error)
      return
    }

    executePRP(thener, x)
  }

  nextTick(caller)
}

export default executeThenAction
