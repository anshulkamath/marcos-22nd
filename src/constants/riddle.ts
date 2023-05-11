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
  { riddle: 'What do violins say when they greet each other?', answer: 'cello' },
  {
    riddle: 'My name corresponds to the stars and in the imaginary space',
    answer: 'libra-complex',
  },
  { riddle: 'A place that brings every Mudd student together', answer: 'hoch' },
  { riddle: "Walter White would've lived in which dorm?", answer: 'atwood' },
  {
    riddle: "I come in blue, red and green. Sometimes I'll disturb your course unseen. What am I?",
    answer: 'shells',
  },
  { riddle: "Usain Bolt's competitor", answer: 'dean-chris' },
  { riddle: 'Metal and jazz packed into a moving vehicle', answer: 'clown-core' },
  {
    riddle:
      'Consider the function: f(x,y) = (y^2 / 2) - cos(x). Find a (special) critical point of f satisfying -2π < x < 2π',
    answer: 'origin',
  },
  {
    riddle:
      'for (int i = 0; i < N; i++) { for (int j = i + 1; i < N; j++) { <code> } }. What is the complexity of this algorithm?',
    answer: 'quadratic',
  },
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
