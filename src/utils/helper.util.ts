import _ from 'lodash'
import { type Request } from 'express'
import { idToPuzzle, keywords } from 'constants/puzzle'

export const getKeyword = (req: Request): string => _.get(req, 'cookies.marcos-22nd', keywords[0])

export const validateKeyword = (guess: string, id: string): boolean => {
  const cookieIdx = keywords.indexOf(guess)
  const puzzleIdx = keywords.indexOf(idToPuzzle[id].keyword)

  return cookieIdx >= 0 && cookieIdx >= puzzleIdx - 1
}

export const stringTemplateParser = (expression: string | null, valueObj: any): string | null => {
  if (!expression) {
    return null
  }

  const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g

  const text = expression.replace(templateMatcher, (substring, value: any) => {
    value = valueObj[value]
    return value
  })

  return text
}

export const getIPAddress = (remoteAddress: string = '??'): string =>
  remoteAddress.substring(remoteAddress.lastIndexOf(':') + 1)
