import { DateTime } from 'luxon'
import levenshtein from 'js-levenshtein'

import { getPlaylist } from './playlist'
import { type Guess, type ScoreResponse } from './types'

const POINTS_PER_NAME = 5
const POINTS_PER_DATE = 5
const NAME_THRESH = 1/5;

/** Takes a guess from the client and calculates a score
 * @param guess The guess from the client
 * @returns A promise that resolves to the a triplet of the score, correct date, and correct name
 */
export const calculateScore = async ({ name, date, id }: Guess): Promise<ScoreResponse> => {
  const [playlistItems, idMap] = await getPlaylist()
  const actual = playlistItems[idMap[id]]

  const nameCorrect = +(levenshtein(name.toLocaleLowerCase(), actual.name.toLocaleLowerCase()) <= Math.round(name.length * NAME_THRESH))
  const dateCorrect = +(DateTime.fromISO(date).diff(DateTime.fromISO(actual.added_at)).as('month') <= 1)
  const score = POINTS_PER_NAME * nameCorrect + POINTS_PER_DATE * dateCorrect

  return { score, correctDate: actual.added_at, correctName: actual.name}
}
