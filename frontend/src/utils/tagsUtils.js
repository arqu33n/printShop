import { tagSchema } from './schemas.js'

const TAG_COLORS = {
  обычный: {
    rgb: '26, 113, 246',
  },
  важный: {
    rgb: '138, 43, 183',
  },
  временный: {
    rgb: '35, 161, 73',
  },
}

export const normalizeTag = (data) => {
  const tagTypeName = data.tag_type_model?.name || 'обычный'
  const colorConfig = TAG_COLORS[tagTypeName] || TAG_COLORS.обычный

  return {
    ...tagSchema,
    ...data,
    styles: {
      background: `rgba(${colorConfig.rgb}, 0.5)`,
      border: `rgba(${colorConfig.rgb}, 0.7)`,
      text: `rgba(255,255,255, 1)`,
    },
  }
}
