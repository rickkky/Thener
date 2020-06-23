export function createResolvers(thener) {
  let called = false

  const resolver = function (fulfilled, value) {
    if (called) {
      return thener
    }

    called = true

    if (fulfilled) {
      thener._executePRP(value)
      return
    }

    thener._solve(false, value)
  }

  return {
    resolve: resolver.bind(thener, true),
    reject: resolver.bind(thener, false),
  }
}

export default createResolvers
