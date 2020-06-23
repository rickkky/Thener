export function solve(thener, fulfilled, value) {
  if (thener._status !== 'PENDING') {
    return
  }

  thener._status = fulfilled ? 'FULFILLED' : 'REJECTED'
  thener._answer = value
  thener._actions.forEach((action) => thener._executeThenAction(action))
}

export default solve
