import { DateTime } from 'luxon'

import { type TokenResponse } from './types'
import {
  HttpMethod,
  ResponseCodes,
  ContentType,
  grantType,
  clientId,
  clientSecret,
  accountURL,
} from './constants'

/**
 * Gets a usable token from the Spotify web API
 *
 * @returns A token to be used to access Spotify API
 */
const getToken = async (): Promise<TokenResponse> => {
  const requestParams = {
    method: HttpMethod.POST,
    headers: {
      contentType: ContentType.FORM_URL_ENCODED,
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({ grant_type: grantType }),
  }

  const response = await fetch(accountURL, requestParams)

  if (response.status !== ResponseCodes.OK) {
    throw new Error(
      `Unable to fetch token from Spotify server. Returned error code: ${response.status}.`,
    )
  }

  return await response.json()
}

/**
 * Returns a memoized token. Refreshes the token if the token is expired or if
 * it is not yet instantiated
 *
 * @returns A Spotify web token
 */
const fetchTokenMemoized = (): (() => Promise<string>) => {
  let token: string
  let tokenExpires: DateTime = DateTime.now()

  const subFetchToken = async (): Promise<string> => {
    if (token !== null && DateTime.now() < tokenExpires) {
      return token
    }

    const { token_type: tokenType, access_token: accessToken, duration } = await getToken()
    token = `${tokenType} ${accessToken}`
    tokenExpires = DateTime.now().plus({ seconds: duration })

    return token
  }

  return subFetchToken
}

export const fetchToken = fetchTokenMemoized()
