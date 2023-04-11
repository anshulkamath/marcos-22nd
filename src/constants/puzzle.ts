import puzzle0JSON from '../resources/puzzle-0.json'
import puzzle1JSON from '../resources/puzzle-1.json'
import puzzle2JSON from '../resources/puzzle-2.json'
import puzzle3JSON from '../resources/puzzle-3.json'
import puzzle4JSON from '../resources/puzzle-4.json'
import puzzle5JSON from '../resources/puzzle-5.json'
import puzzle6JSON from '../resources/puzzle-6.json'
import puzzle7JSON from '../resources/puzzle-7.json'
import puzzle8JSON from '../resources/puzzle-8.json'
import puzzle9JSON from '../resources/puzzle-9.json'
import puzzle10JSON from '../resources/puzzle-10.json'
import puzzle11JSON from '../resources/puzzle-11.json'
import puzzle12JSON from '../resources/puzzle-12.json'
import puzzle13JSON from '../resources/puzzle-13.json'
import puzzle14JSON from '../resources/puzzle-14.json'

export interface PuzzleInfo {
  title: string
  keyword: string
  description: string
  hint: string
  redirect: string | boolean
}

export const puzzleInfo: PuzzleInfo[] = [
  puzzle0JSON,
  puzzle1JSON,
  puzzle2JSON,
  puzzle3JSON,
  puzzle4JSON,
  puzzle5JSON,
  puzzle6JSON,
  puzzle7JSON,
  puzzle8JSON,
  puzzle9JSON,
  puzzle10JSON,
  puzzle11JSON,
  puzzle12JSON,
  puzzle13JSON,
  puzzle14JSON,
]

export const keywords = puzzleInfo.map(({ keyword }) => keyword)
export const puzzleNames = puzzleInfo.map(({ title }) => title)
