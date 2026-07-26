const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

const tokenKey = 'ventiq_access_token'
const refreshTokenKey = 'ventiq_refresh_token'

export const tokenStore = {
  getAccessToken() {
    return localStorage.getItem(tokenKey)
  },
  getRefreshToken() {
    return localStorage.getItem(refreshTokenKey)
  },
  setTokens({ accessToken, refreshToken }) {
    if (accessToken) localStorage.setItem(tokenKey, accessToken)
    if (refreshToken) localStorage.setItem(refreshTokenKey, refreshToken)
  },
  clear() {
    localStorage.removeItem(tokenKey)
    localStorage.removeItem(refreshTokenKey)
  },
}

const isFormData = (body) => body instanceof FormData

export class ApiClientError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.payload = payload
  }
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers)
  const accessToken = tokenStore.getAccessToken()

  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  if (options.body && !isFormData(options.body)) headers.set('Content-Type', 'application/json')

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers,
    body: options.body && !isFormData(options.body) ? JSON.stringify(options.body) : options.body,
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok || payload?.success === false) {
    throw new ApiClientError(payload?.message || response.statusText, response.status, payload)
  }

  return payload?.data ?? payload
}

export const api = {
  auth: {
    register(formData) {
      return request('/users/register', { method: 'POST', body: formData })
    },
    login(credentials) {
      return request('/users/login', { method: 'POST', body: credentials })
    },
    logout() {
      return request('/users/logout', { method: 'POST' })
    },
    currentUser() {
      return request('/users/current-user', { method: 'POST' })
    },
    refreshToken(refreshToken) {
      return request('/users/refresh-token', { method: 'POST', body: { refreshToken } })
    },
    updateAccount(data) {
      return request('/users/update-account', { method: 'PATCH', body: data })
    },
  },
  videos: {
    list(params = {}) {
      const query = new URLSearchParams(params)
      return request(`/videos${query.size ? `?${query}` : ''}`)
    },
    get(videoId) {
      return request(`/videos/${videoId}`)
    },
    publish(formData) {
      return request('/videos', { method: 'POST', body: formData })
    },
    update(videoId, formData) {
      return request(`/videos/${videoId}`, { method: 'PATCH', body: formData })
    },
    delete(videoId) {
      return request(`/videos/${videoId}`, { method: 'DELETE' })
    },
    togglePublish(videoId) {
      return request(`/videos/toggle/publish/${videoId}`, { method: 'PATCH' })
    },
  },
  tweets: {
    create(content) {
      return request('/tweets', { method: 'POST', body: { content } })
    },
    byUser(userId) {
      return request(`/tweets/user/${userId}`)
    },
    update(tweetId, content) {
      return request(`/tweets/${tweetId}`, { method: 'PATCH', body: { content } })
    },
    delete(tweetId) {
      return request(`/tweets/${tweetId}`, { method: 'DELETE' })
    },
  },
  comments: {
    byVideo(videoId, params = {}) {
      const query = new URLSearchParams(params)
      return request(`/comments/${videoId}${query.size ? `?${query}` : ''}`)
    },
    add(videoId, content) {
      return request(`/comments/${videoId}`, { method: 'POST', body: { content } })
    },
    update(commentId, content) {
      return request(`/comments/c/${commentId}`, { method: 'PATCH', body: { content } })
    },
    delete(commentId) {
      return request(`/comments/c/${commentId}`, { method: 'DELETE' })
    },
  },
  likes: {
    toggleVideo(videoId) {
      return request(`/likes/toggle/v/${videoId}`, { method: 'POST' })
    },
    toggleComment(commentId) {
      return request(`/likes/toggle/c/${commentId}`, { method: 'POST' })
    },
    toggleTweet(tweetId) {
      return request(`/likes/toggle/t/${tweetId}`, { method: 'POST' })
    },
    likedVideos() {
      return request('/likes/liked-videos')
    },
  },
  playlists: {
    create(data) {
      return request('/playlist', { method: 'POST', body: data })
    },
    byUser(userId) {
      return request(`/playlist/user/${userId}`)
    },
    get(playlistId) {
      return request(`/playlist/${playlistId}`)
    },
    update(playlistId, data) {
      return request(`/playlist/${playlistId}`, { method: 'PATCH', body: data })
    },
    delete(playlistId) {
      return request(`/playlist/${playlistId}`, { method: 'DELETE' })
    },
    addVideo(videoId, playlistId) {
      return request(`/playlist/add/${videoId}/${playlistId}`, { method: 'PATCH' })
    },
    removeVideo(videoId, playlistId) {
      return request(`/playlist/remove/${videoId}/${playlistId}`, { method: 'PATCH' })
    },
  },
  subscriptions: {
    toggle(channelId) {
      return request(`/subscriptions/c/${channelId}`, { method: 'POST' })
    },
    subscribedChannels(subscriberId) {
      return request(`/subscriptions/c/${subscriberId}`)
    },
    subscribers(channelId) {
      return request(`/subscriptions/u/${channelId}`)
    },
  },
  users: {
    channel(username) {
      return request(`/users/c/${username}`)
    },
    history() {
      return request('/users/history')
    },
  },
}
