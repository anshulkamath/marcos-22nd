/**
 * Source code for Spotify mini-game
 */
import _ from 'lodash'
import { DateTime } from 'luxon'

import {
  HttpMethod,
  ContentType,
  grantType,
  clientId,
  clientSecret,
  accountURL,
  playlistURL,
  playlistFilter,
  ResponseCodes,
  playlistTotal,
} from './constants'

import {
  type TokenResponse,
  type PlaylistItemRaw,
  type PlaylistItem,
  type PlaylistResponse,
  type PlaylistSizeResponse,
} from './types'

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

const fetchToken = fetchTokenMemoized()

/**
 * Gets the length of Marcos' playlist
 *
 * @returns A response with playlist size
 */
const fetchPlaylistSize = async (): Promise<number> => {
  const token = await fetchToken()

  const queryString = new URLSearchParams({
    fields: playlistTotal,
  })

  const requestParams = {
    method: HttpMethod.GET,
    headers: {
      Authorization: token,
    },
  }

  const response = await fetch(`${playlistURL}?${queryString}`, requestParams)

  if (response.status !== ResponseCodes.OK) {
    if (response.status === ResponseCodes.FORBIDDEN) {
      throw new Error('Unable to get playlist data from Spotify server due to permission issues.')
    }

    throw new Error(
      `Unable to get playlist data from Spotify server. Returned error code: ${response.status}`,
    )
  }

  const playlistSizeResponse: PlaylistSizeResponse = await response.json()

  return playlistSizeResponse.tracks.total
}

/**
 * Gets the items in Marcos' playlist
 *
 * @param offset  Where to start pagination
 * @param limit   How many items to return (limit 100)
 * @returns A response with playlist data
 */
const fetchPlaylistItems = async (offset = 0, limit = 100): Promise<PlaylistItem[]> => {
  const token = await fetchToken()

  const queryString = new URLSearchParams({
    fields: playlistFilter,
    offset: `${offset}`,
    limit: `${limit}`,
  })

  const requestParams = {
    method: HttpMethod.GET,
    headers: {
      Authorization: token,
    },
  }

  const response = await fetch(`${playlistURL}?${queryString}`, requestParams)

  if (response.status !== ResponseCodes.OK) {
    if (response.status === ResponseCodes.FORBIDDEN) {
      throw new Error('Unable to get playlist data from Spotify server due to permission issues.')
    }

    throw new Error(
      `Unable to get playlist data from Spotify server. Returned error code: ${response.status}`,
    )
  }

  return filterPlaylistItems(await response.json())
}

/**
 * Takes in a raw response from the Spotify API and filters it by flattening the
 * object and removing extraneous fields
 *
 * @param response The raw response from the API
 * @returns A filtered response
 */
const filterPlaylistItems = (response: PlaylistResponse): PlaylistItem[] => {
  const flatten = (elem: PlaylistItemRaw): PlaylistItem => ({
    added_at: elem.added_at,
    ...elem.track,
  })

  const playlistItems = _.map(
    _.filter(_.get(response, 'tracks.items'), 'track.preview_url'),
    flatten,
  )

  return playlistItems
}

/**
 * A function that creates a list of all Marcos' songs. This function is
 * memoized so that it is more performant. It should only hit Spotify's
 * servers once.
 *
 * @param token The access token to be used
 * @returns A list of all (valid) items in Marcos' playlist
 */
const getPlaylistMemoized = (): (() => Promise<PlaylistItem[]>) => {
  const playlistItems: PlaylistItem[] = []
  let playlistSize = -1

  const getPlaylist = async (): Promise<PlaylistItem[]> => {
    if (playlistItems.length === playlistSize) {
      return playlistItems
    }

    const totalElements = await fetchPlaylistSize()
    const playlistPromises: Array<Promise<PlaylistItem[]>> = []

    for (let i = 0; i < totalElements; i += 100) {
      playlistPromises.push(fetchPlaylistItems(i, i + 100))
    }
    const resolvedPlaylists = await Promise.all(playlistPromises)
    playlistItems.push(..._.union(...resolvedPlaylists))
    playlistSize = playlistItems.length

    return playlistItems
  }

  return getPlaylist
}

export const getPlaylist = getPlaylistMemoized()
