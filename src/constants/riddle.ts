import _ from 'lodash'
import { idToPuzzle } from './puzzle'

interface Riddle {
  riddle: string
  answer: string
}

interface RiddleData {
  resource: string
  riddle: string
}

const riddles: Riddle[] = [
  { riddle: '', answer: 'scavenger-hunt' },
  { riddle: 'DEFGECD, what am I?', answer: 'lick' },
]

export const scavengerHuntData: RiddleData[] = []
riddles.forEach(({ riddle, answer }, i) => {
  scavengerHuntData.push({
    resource: answer,
    riddle: 'Keyword: ' + _.get(idToPuzzle, ['frosh', 'keyword'], ''),
  })

  if (i === 0) {
    return
  }

  scavengerHuntData[i - 1].riddle = riddle
})
