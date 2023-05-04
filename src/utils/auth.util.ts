import { idToPuzzle, keywords } from 'constants/puzzle'

export const validateCookie = (cookie: string, id: string): boolean => {
  const cookieIdx = keywords.indexOf(cookie)
  const puzzleIdx = keywords.indexOf(idToPuzzle[id].keyword)

  return cookieIdx >= 0 && cookieIdx >= puzzleIdx - 1
}
