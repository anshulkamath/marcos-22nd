import { DateTime, Interval } from 'luxon'
import levenshtein from 'js-levenshtein'

import { getPlaylist } from './playlist'
import { type Guess, type ScoreResponse } from './types'

const POINTS_PER_NAME = 5
const POINTS_PER_DATE = 5
const NAME_THRESH = 1/5;

/**
 * Give bonuses depending on level of difficulty, which is as follows:
 *   Level 1: Guesses song after 1 second
 *   Level 2: Guesses song after 5 seconds
 *   Level 3: Guesses song
 */
const LEVEL_ADJUSTMENTS = { 1: 5, 2: 1, 3: 0 }

/** Takes a guess from the client and calculates a score
 * @param guess The guess from the client
 * @returns A promise that resolves to the a triplet of the score, correct date, and correct name
 */
export const calculateScore = async ({ name, date, id, level }: Guess): Promise<ScoreResponse> => {
  const [playlistItems, idMap] = await getPlaylist()
  const actual = playlistItems[idMap[id]]

  const addedDateTime = DateTime.fromISO(actual.added_at)
  const interval = Interval.fromDateTimes(
    addedDateTime.minus({ months: 1 }),
    addedDateTime.plus({ months: 1 })
  )

  const nameCorrect = +(levenshtein(name.toLocaleLowerCase(), actual.name.toLocaleLowerCase()) <= Math.round(name.length * NAME_THRESH))
  const dateCorrect = +(interval.contains(DateTime.fromISO(date)))
  const score = POINTS_PER_NAME * nameCorrect + POINTS_PER_DATE * dateCorrect + LEVEL_ADJUSTMENTS[level]

  return { score, correctDate: actual.added_at, correctName: actual.name}
}
