import { PENDING, FULFILLED, REJECTED } from './constants'
import { status, result, queue } from './privates'
import { isFunction } from './helpers/is'
import getThenMethod from './helpers/getThenMethod'
import nextTick from './helpers/nextTick'
import { passValue, passError } from './helpers/pass'

export default class Thener {
  static resolve(value) {
    return new Thener((resolve) => resolve(value))
  }

  static reject(reason) {
    return new Thener((resolve, reject) => reject(reason))
  }

  constructor(executor) {
    if (!isFunction(executor)) {
      throw new TypeError(`Promise resolver ${executor} is not a function.`)
    }

    this[status] = PENDING
    this[result] = undefined
    this[queue] = []

    execute(this, executor)
  }

  then(onFulfilled, onRejected) {
    onFulfilled = isFunction(onFulfilled) ? onFulfilled : passValue
    onRejected = isFunction(onRejected) ? onRejected : passError

    const promise = new Thener(() => {})
    const thenAction = { onFulfilled, onRejected, promise }

    if (this[status] === PENDING) {
      this[queue].push(thenAction)
    } else {
      executeThenAction(this, thenAction)
    }

    return promise
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }
}

/* Private methods */

function solve(promise, isFulfilled, value) {
  if (promise[status] !== PENDING) {
    return
  }

  promise[status] = isFulfilled ? FULFILLED : REJECTED
  promise[result] = value
  promise[queue].forEach((action) => executeThenAction(promise, action))
}

function executeThenAction(thisPromise, action) {
  const state = thisPromise[status]
  const value = thisPromise[result]

  if (state === PENDING) {
    return
  }

  const { onFulfilled, onRejected, promise } = action

  let handler = onRejected

  if (state === FULFILLED) {
    handler = onFulfilled
  }

  const caller = () => {
    let x

    try {
      x = handler(value)
    } catch (error) {
      solve(promise, false, error)
      return
    }

    resolvePromise(promise, x)
  }

  nextTick(caller)
}

function resolvePromise(promise, x) {
  let then

  try {
    then = getThenMethod(x)
  } catch (error) {
    solve(promise, false, error)
    return
  }

  if (then === undefined) {
    solve(promise, true, x)
    return
  }

  if (x === promise) {
    solve(
      promise,
      false,
      new TypeError('Chaining cycle detected for promise ${x}'),
    )
    return
  }

  if (x instanceof Thener) {
    then(
      (value) => {
        resolvePromise(promise, value)
      },
      (reason) => {
        solve(promise, false, reason)
      },
    )
    return
  }

  execute(promise, then)
}

function execute(promise, executor) {
  const { resolve, reject } = createResolvingFunctions(promise)

  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

function createResolvingFunctions(promise) {
  let called = false

  function presolve(isFulfilled, value) {
    if (called) {
      return promise
    }

    called = true

    if (isFulfilled) {
      return resolvePromise(promise, value)
    }

    return solve(promise, false, value)
  }

  return {
    resolve: presolve.bind(promise, true),
    reject: presolve.bind(promise, false),
  }
}
