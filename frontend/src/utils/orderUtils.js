import { orderSchema } from './schemas.js'

export const normalizeOrder = (apiOrder = {}) => ({
  ...orderSchema,
  ...apiOrder,
})
