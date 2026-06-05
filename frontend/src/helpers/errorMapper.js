// Маппит технические ошибки в понятные сообщения

export const mapTechnicalError = (error) => {
  const errorMap = {
    NETWORK_ERROR: {
      type: 'network',
      message: 'Нет подключения к интернету. Проверьте соединение',
    },
    SERVER_ERROR: {
      type: 'server',
      message: 'Ошибка на сервере. Попробуйте позже',
    },
    TIMEOUT_ERROR: {
      type: 'timeout',
      message: 'Сервер не отвечает. Попробуйте позже',
    },
    UNAUTHORIZED: {
      type: 'auth',
      message: 'Сессия истекла. Войдите снова',
    },
    FORBIDDEN: {
      type: 'forbidden',
      message: 'Нет доступа к этому ресурсу',
    },
    NOT_FOUND: {
      type: 'notFound',
      message: 'Ресурс не найден',
    },
    CLIENT_ERROR: {
      type: 'client',
      message: 'Ошибка в запросе',
    },
    TECHNICAL_ERROR: {
      type: 'technical',
      message: 'Временная ошибка. Повторите попытку',
    },
  }

  return (
    errorMap[error.message] || {
      type: 'unknown',
      message: error.message || 'Произошла ошибка',
    }
  )
}

// Создает бизнес-ошибку из ответа сервера

export const handleBusinessError = (response) => {
  let message = ''

  if (response?.errors && typeof response.errors === 'object') {
    const firstField = Object.keys(response.errors)[0]
    const fieldError = response.errors[firstField]
    message = Array.isArray(fieldError) ? fieldError[0] : fieldError
  } else if (response?.error) {
    if (typeof response.error === 'string') {
      message = response.error
    } else if (typeof response.error === 'object') {
      const firstField = Object.keys(response.error)[0]
      const fieldError = response.error[firstField]
      message = Array.isArray(fieldError) ? fieldError[0] : fieldError
    }
  } else if (response?.message) {
    message = response.message
  }

  return {
    type: 'business',
    message: message || 'Ошибка при выполнении операции',
  }
}

export const handleTechnicalError = (error) => {
  if (error.message?.includes('_ERROR')) {
    return mapTechnicalError(error)
  }

  if (error.type === 'business') {
    return error
  }

  if (error.message) {
    return {
      type: 'unknown',
      message: error.message,
    }
  }

  return {
    type: 'unknown',
    message: 'Произошла неизвестная ошибка',
  }
}
