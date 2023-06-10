const DEFAULT_MAX_ROUNDS = 10
const DEFAULT_SCORE_THRESH = 900

export const MAX_ROUNDS = parseInt(process.env.MAX_ROUNDS ?? `${DEFAULT_MAX_ROUNDS}`)
export const SCORE_THRESH = parseInt(process.env.SCORE_THRESH ?? `${DEFAULT_SCORE_THRESH}`)
