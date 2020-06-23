const Thener = require('../dist/index')

const deferred = () => {
  let closure = undefined

  const promise = new Thener((resolve, reject) => {
    closure = { resolve, reject }
  })

  return { ...closure, promise }
}

const resolved = Thener.resolve

const rejected = Thener.reject

module.exports = { deferred, resolved, rejected }
