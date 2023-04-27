export const catchError = (e: unknown, callback: (e: Error) => void): void => {
  if (e instanceof Error) {
    callback(e)
  }
  console.error(e)
}
