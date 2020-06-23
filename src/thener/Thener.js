import { status, answer, queue, PENDING, FULFILLED, REJECTED } from './symbols'
import { isFunction } from '../utils/is'
import executeEntry from './executeEntry'
import executeThenAction from './executeThenAction'
import { passValue, passError } from '../utils/pass'

export class Thener {
  static resolve(value) {
    return new Thener((resolve) => resolve(value))
  }

  static reject(reason) {
    return new Thener((resolve, reject) => reject(reason))
  }

  constructor(executor) {
    if (!isFunction(executor)) {
      throw new TypeError(`promise resolver ${executor} should be a function`)
    }

    this[status] = PENDING
    this[answer] = undefined
    this[queue] = []

    executeEntry(this, executor)
  }

  then(onFulfilled, onRejected) {
    onFulfilled = isFunction(onFulfilled) ? onFulfilled : passValue
    onRejected = isFunction(onRejected) ? onRejected : passError

    const thener = new Thener(() => {})
    const action = { onFulfilled, onRejected, thener }

    if (this[status] === PENDING) {
      this[queue].push(action)
    } else {
      executeThenAction(this, action)
    }

    return thener
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }
}

export default Thener
