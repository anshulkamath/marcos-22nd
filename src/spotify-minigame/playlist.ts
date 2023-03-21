/**
 * Source code for Spotify mini-game
 */
import _ from 'lodash'

import { fetchToken } from './auth'
import {
  HttpMethod,
  playlistURL,
  playlistFilter,
  ResponseCodes,
  playlistTotal,
  marcosId,
} from './constants'

import {
  type PlaylistItemRaw,
  type PlaylistItem,
  type PlaylistResponse,
  type PlaylistSizeResponse,
} from './types'

/**
 * Gets the length of a given playlist
 *
 * @param playlistId The id of the playlist to get the length of
 * @returns A response with playlist size
 */
const fetchPlaylistSize = async (playlistId = marcosId): Promise<number> => {
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

  const response = await fetch(`${playlistURL(playlistId)}?${queryString}`, requestParams)

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
 * Gets the items in the given playlist
 *
 * @param playlistId  The ID of the playlist to fetch items from
 * @param offset      Where to start pagination
 * @param limit       How many items to return (limit 100)
 * @returns A response with playlist data
 */
const fetchPlaylistItems = async (
  playlistId = marcosId,
  offset = 0,
  limit = 100,
): Promise<PlaylistItem[]> => {
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

  const response = await fetch(`${playlistURL(playlistId)}?${queryString}`, requestParams)

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

  const noSpecialCharacter = /^[a-zA-Z0-9][a-zA-Z0-9]+$/
  const playableName = (elem: PlaylistItem): boolean => noSpecialCharacter.test(elem.name)

  const playlistItems = _.filter(
    _.map(_.filter(_.get(response, 'tracks.items'), 'track.preview_url'), flatten),
    playableName,
  )

  return playlistItems
}

/**
 * A function that creates a list of all songs in the playlist. This function is
 * memoized so that it is more performant. It should only hit Spotify's
 * servers once.
 *
 * @param playlistId The access token to be used
 * @returns A list of all (valid) items in Marcos' playlist
 */
const getPlaylistMemoized = (
  playlistId = marcosId,
): ((playlistId?: string) => Promise<[PlaylistItem[], Record<string, number>]>) => {
  let playlistItems: PlaylistItem[] = []
  const idToItemMap: Record<string, number> = {}
  let playlistSize = -1
  let currentPlaylist = playlistId

  const getPlaylist = async (
    playlistId = marcosId,
  ): Promise<[PlaylistItem[], Record<string, number>]> => {
    if (playlistItems.length === playlistSize && currentPlaylist === playlistId) {
      return [playlistItems, idToItemMap]
    }

    console.log(`loading playlist ${playlistId}`)

    if (currentPlaylist !== playlistId) {
      currentPlaylist = playlistId
    }

    const totalElements = await fetchPlaylistSize(playlistId)
    const playlistPromises: Array<Promise<PlaylistItem[]>> = []

    for (let i = 0; i < totalElements; i += 100) {
      playlistPromises.push(fetchPlaylistItems(playlistId, i, i + 100))
    }
    const resolvedPlaylists = await Promise.all(playlistPromises)
    playlistItems = _.uniqWith(_.flatten(resolvedPlaylists), _.isEqual)
    playlistSize = playlistItems.length

    _.forEach(playlistItems, (elem, i) => {
      idToItemMap[elem.id] = i
    })

    return [playlistItems, idToItemMap]
  }

  return getPlaylist
}

export const getPlaylist = getPlaylistMemoized()
