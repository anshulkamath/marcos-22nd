export enum HttpMethod {
  POST = 'POST',
  GET = 'GET',
}

export enum ContentType {
  FORM_URL_ENCODED = 'application/x-www-form-urlencoded',
}

export enum ResponseCodes {
  OK = 200,
  FORBIDDEN = 403,
}

export const grantType = 'client_credentials'
export const accountURL = 'https://accounts.spotify.com/api/token'
export const marcosId = '0v0OpK2jpvsOv1EKjcq6lv'
export const playlistURL = (playlistId = marcosId): string =>
  `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
export const playlistFilter = 'items(added_at,track(preview_url,name,id))'
export const playlistTotal = 'total'

export const clientId = process.env.SPOTIFY_CLIENT_ID ?? ''
export const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? ''
