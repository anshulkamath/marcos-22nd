export const GET_PUZZLE_NAMES_QUERY = 'names'
export const COOKIE_KEY = 'marcos-22nd'
export const COOKIE_AGE = 30 * 24 * 60 * 60

const DEFAULT_ENDPOINT = 'http://localhost:8080'
export const ENDPOINT = process.env.ENDPOINT ?? DEFAULT_ENDPOINT
export const ENDPOINT_URL = process.env.ENDPOINT_URL ?? ENDPOINT
export const CONGRATS_SCRIPT = process.env.CONGRATS_SCRIPT

export const DEBUG_MODE = process.env.DEBUG === 'true'
