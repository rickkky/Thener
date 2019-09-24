const Thener = require('../dist/thener')

const deferred = () => {
  let closure = {}

  const promise = new Thener((resolve, reject) => {
    Object.assign(closure, { resolve, reject })
  })

  return { ...closure, promise }
}

const resolved = Thener.resolve

const rejected = Thener.reject

module.exports = { deferred, resolved, rejected }
