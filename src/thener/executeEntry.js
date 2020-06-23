import createResolvers from './createResolvers'

export function executeEntry(thener, executor) {
  const { resolve, reject } = createResolvers(thener)

  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

export default executeEntry
