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
    resolve: resolver.bind(undefined, true),
    reject: resolver.bind(undefined, false),
  }
}

export default createResolvers
