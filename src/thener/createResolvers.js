import executePRP from './executePRP'
import solve from './solve'

export function createResolvers(thener) {
  let called = false

  const resolver = function (fulfilled, value) {
    if (called) {
      return thener
    }

    called = true

    if (fulfilled) {
      executePRP(thener, value)
      return
    }

    solve(thener, false, value)
  }

  return {
    resolve: resolver.bind(thener, true),
    reject: resolver.bind(thener, false),
  }
}

export default createResolvers
