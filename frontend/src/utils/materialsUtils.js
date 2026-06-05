import { materialSchema } from './schemas.js'
import plaImage from '@images/materials/PLA.jpg'
import absImage from '@images/materials/ABS.jpg'
import petgImage from '@images/materials/PETG.jpg'
import nylonImage from '@images/materials/Nylon.jpg'
import defaultImage from '@images/materials/default.jpg'

const MATERIAL_IMAGES = {
  PLA: plaImage,
  ABS: absImage,
  PETG: petgImage,
  НЕЙЛОН: nylonImage,
  default: defaultImage,
}

export const normalizeMaterial = (data) => {
  const normalized = {
    ...materialSchema,
    ...data,
  }

  const materialName = normalized.name?.toUpperCase() || 'default'
  normalized.imageUrl = MATERIAL_IMAGES[materialName] || MATERIAL_IMAGES.default

  return normalized
}
