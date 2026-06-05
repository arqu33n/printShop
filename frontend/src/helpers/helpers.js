import imagePlaceholder from '@images/image-placeholder.png'

// форматирование цены
export function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price)
}

// главная картинка или заглушка
export function getProductImage(product, customPlaceholder = null) {
  const placeholder = customPlaceholder || imagePlaceholder

  if (!product || !product.images || product.images.length === 0) {
    return placeholder
  }

  const mainImg = product.images.find((img) => img.is_main === '1' || img.is_main === true)
  const firstImg = product.images[0]
  const imgToUse = mainImg || firstImg

  if (imgToUse?.url) {
    return imgToUse.url
  }

  if (imgToUse?.name) {
    return `/uploads/products/${imgToUse.name}`
  }

  return placeholder
}

export function getImagePlaceholder() {
  return imagePlaceholder
}

// форматирование даты
export function formatDate(dateString) {
  if (!dateString || Array.isArray(dateString) || typeof dateString !== 'string') {
    return '—'
  }
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
