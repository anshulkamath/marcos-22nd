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
export const playlistURL = 'https://api.spotify.com/v1/playlists/0v0OpK2jpvsOv1EKjcq6lv'
export const playlistFilter = 'tracks(items(added_at,track(preview_url,name,id)))'
export const playlistTotal = 'tracks(total)'

export const clientId = process.env.SPOTIFY_CLIENT_ID ?? ''
export const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? ''
