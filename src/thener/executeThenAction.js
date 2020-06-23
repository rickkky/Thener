import nextTick from '../utils/nextTick'

export function executeThenAction(root, action) {
  const status = root._status
  const answer = root._answer

  if (status === 'PENDING') {
    return
  }

  const { thener, onFulfilled, onRejected } = action
  const handler = status === 'FULFILLED' ? onFulfilled : onRejected

  const caller = () => {
    let value = undefined

    try {
      value = handler(answer)
    } catch (error) {
      thener._solve(false, error)
      return
    }

    thener._executePRP(value)
  }

  nextTick(caller)
}

export default executeThenAction
