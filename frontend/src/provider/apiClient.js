const BASE_URL = '/api'

class ApiError extends Error {
  constructor(status, statusText, body) {
    super(`HTTP ${status}: ${statusText}`)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
    this.body = body
    this.response = { status, data: body }
  }
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      data = { error: text }
    }

    throw new ApiError(response.status, response.statusText, data)
  }

  return response.status === 204 ? null : response.json()
}

async function requestFormData(path, { method = 'POST', body, headers = {} } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...headers,
    },
    body,
  })

  if (!response.ok) {
    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      data = { error: text }
    }

    throw new ApiError(response.status, response.statusText, data)
  }

  return response.status === 204 ? null : response.json()
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
  postFormData: (path, body) => requestFormData(path, { method: 'POST', body }),
}
