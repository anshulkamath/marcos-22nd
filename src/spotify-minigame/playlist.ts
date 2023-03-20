/**
 * Source code for Spotify mini-game
 */
import _ from 'lodash'

import { fetchToken } from './auth'
import { HttpMethod, playlistURL, playlistFilter, ResponseCodes, playlistTotal } from './constants'

import {
  type PlaylistItemRaw,
  type PlaylistItem,
  type PlaylistResponse,
  type PlaylistSizeResponse,
} from './types'

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
const getPlaylistMemoized = (): (() => Promise<[PlaylistItem[], Record<string, number>]>) => {
  const playlistItems: PlaylistItem[] = []
  const idToItemMap: Record<string, number> = {}
  let playlistSize = -1

  const getPlaylist = async (): Promise<[PlaylistItem[], Record<string, number>]> => {
    if (playlistItems.length === playlistSize) {
      return [playlistItems, idToItemMap]
    }

    const totalElements = await fetchPlaylistSize()
    const playlistPromises: Array<Promise<PlaylistItem[]>> = []

    for (let i = 0; i < totalElements; i += 100) {
      playlistPromises.push(fetchPlaylistItems(i, i + 100))
    }
    const resolvedPlaylists = await Promise.all(playlistPromises)
    playlistItems.push(..._.union(...resolvedPlaylists))
    playlistSize = playlistItems.length

    _.forEach(playlistItems, (elem, i) => {
      idToItemMap[elem.id] = i
    })

    return [playlistItems, idToItemMap]
  }

  return getPlaylist
}

export const getPlaylist = getPlaylistMemoized()
