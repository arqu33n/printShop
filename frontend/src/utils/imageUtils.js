import { imageSchema } from './schemas.js'

export const imageUtils = {
  baseUrl: '/uploads/products/',

  formatImage(img) {
    return {
      ...imageSchema,
      ...img,
      url: this.baseUrl + img.name,
    }
  },

  formatImages(images = []) {
    return images.map((img) => this.formatImage(img))
  },

  formatProductWithImages(product) {
    return {
      ...product,
      images: this.formatImages(product.images),
    }
  },
}
