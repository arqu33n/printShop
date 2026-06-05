export const handleApiError = (error, methodName) => {
  console.error(`[API] ${methodName} error:`, {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    url: error.config?.url,
    method: error.config?.method,
    timestamp: new Date().toISOString(),
  })

  // Технические ошибки
  if (error.message === 'Network Error') {
    throw new Error('NETWORK_ERROR')
  }

  if (error.code === 'ECONNABORTED') {
    throw new Error('TIMEOUT_ERROR')
  }

  // Ошибки HTTP
  if (error.response) {
    const status = error.response.status

    if (status >= 500) {
      throw new Error('SERVER_ERROR')
    }

    if (status === 401) {
      throw new Error('UNAUTHORIZED')
    }

    if (status === 403) {
      throw new Error('FORBIDDEN')
    }

    if (status === 404) {
      throw new Error('NOT_FOUND')
    }

    if (status >= 400) {
      throw new Error('CLIENT_ERROR')
    }
  }

  // Любая другая техническая ошибка
  throw new Error('TECHNICAL_ERROR')
}
