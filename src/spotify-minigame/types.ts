export interface TokenResponse {
  access_token: string
  token_type: string
  duration: number
}

export interface PlaylistResponse {
  tracks: {
    items: PlaylistItemRaw[]
  }
}

export interface PlaylistSizeResponse {
  tracks: {
    total: number
  }
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
