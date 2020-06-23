export function executeEntry(thener, executor) {
  const { resolve, reject } = thener._createResolvers()

  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

export default executeEntry
