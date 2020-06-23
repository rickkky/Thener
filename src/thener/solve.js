import { status, answer, queue, PENDING, FULFILLED, REJECTED } from './symbols'
import executeThenAction from './executeThenAction'

export function solve(thener, fulfilled, value) {
  if (thener[status] !== PENDING) {
    return
  }

  thener[status] = fulfilled ? FULFILLED : REJECTED
  thener[answer] = value
  thener[queue].forEach((action) => executeThenAction(thener, action))
}

export default solve
