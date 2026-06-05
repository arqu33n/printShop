export const imageSchema = {
  id: 0,
  name: '',
  is_main: false,
  width: 0,
  height: 0,
  url: '',
}
export const productSchema = {
  id: 0,
  name: '',
  short_description: '',
  description: '',
  created_at: new Date().toISOString(),
  price: '',
  is_active: true,
  images: [],
}
export const colorSchema = {
  id: 0,
  name: '',
  hex_rgb: '',
}

export const materialSchema = {
  id: 0,
  name: '',
  description: '',
  price_coef: 0,
}

export const orderSchema = {
  id: 0,
  address: '',
  email: '',
  name: '',
  surname: '',
  phone: '',
  price: 0,
  quantity: 0,
  color_model: { ...colorSchema },
  material_model: { ...materialSchema },
  product_model: { ...productSchema },
}
export const tagSchema = {
  id: 0,
  product_id: 0,
  name: '',
  tag_type_model: {
    id: 0,
    tag_id: 0,
    name: 'обычный',
  },
}
