import { colorSchema } from './schemas'

const DEFAULT_HEX = '#808080'

export const normalizeColor = (data) => {
  const normalized = {
    ...colorSchema,
    ...data,
  }

  if (!normalized.hex_rgb || !normalized.hex_rgb.startsWith('#')) {
    normalized.hex_rgb = DEFAULT_HEX
    normalized.name = normalized.name || 'Цвет не указан'
  }

  return normalized
}

export const normalizeColorList = (items = []) => {
  return items.map(normalizeColor)
}
