import { isFunction } from '../utils/is'
import { passValue, passError } from '../utils/pass'
import executeEntry from './executeEntry'
import createResolvers from './createResolvers'
import executePRP from './executePRP'
import solve from './solve'
import executeThenAction from './executeThenAction'

export class Thener {
  static resolve(value) {
    return new Thener((resolve) => resolve(value))
  }

  static reject(reason) {
    return new Thener((resolve, reject) => reject(reason))
  }

  _construct = Thener

  // PENDING, FULFILLED, REJECTED
  _status = 'PENDING'

  _answer = undefined

  _actions = []

  constructor(executor) {
    if (!isFunction(executor)) {
      throw new TypeError(`promise resolver ${executor} should be a function`)
    }

    this._executeEntry(executor)
  }

  /* public methods */

  then(onFulfilled, onRejected) {
    const action = {
      thener: new Thener(() => {}),
      onFulfilled: isFunction(onFulfilled) ? onFulfilled : passValue,
      onRejected: isFunction(onRejected) ? onRejected : passError,
    }

    if (this._status === 'PENDING') {
      this._actions.push(action)
    } else {
      executeThenAction(this, action)
    }

    return action.thener
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  /* private methods */

  _executeEntry(executor) {
    return executeEntry(this, executor)
  }

  _createResolvers() {
    return createResolvers(this)
  }

  _executePRP(x) {
    return executePRP(this, x)
  }

  _solve(fulfilled, value) {
    return solve(this, fulfilled, value)
  }

  _executeThenAction(action) {
    return executeThenAction(this, action)
  }
}

export default Thener
