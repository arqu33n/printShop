import { productSchema } from './schemas.js'
import { imageUtils } from './imageUtils.js'
import { normalizeTag } from './tagsUtils.js'

export const normalizeProduct = (apiProduct = {}) => ({
  ...productSchema,
  ...apiProduct,
  tags: (apiProduct.tags || []).map(normalizeTag),
  images: imageUtils.formatImages(apiProduct.images || []),
})
