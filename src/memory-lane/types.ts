export interface TokenResponse {
  access_token: string
  token_type: string
  duration: number
}

export interface PlaylistResponse {
  items: PlaylistItemRaw[]
}

export interface PlaylistSizeResponse {
  total: number
}

export interface PlaylistItemRaw {
  added_at: string
  track: {
    preview_url: string
    name: string
    id: string
  }
}

export interface PlaylistItem {
  added_at: string
  preview_url: string
  name: string
  id: string
}

export interface Guess {
  date: string
  name: string
  id: string
  level: 1 | 2 | 3
}

export interface ScoreResponse {
  score: number
  correctDate: string
  correctName: string
  nameAccepted: boolean
}
