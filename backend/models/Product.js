import mongoose from 'mongoose';

const variationSchema = new mongoose.Schema({
  colors:     { type: [String], default: [] },
  attributes: { type: [String], default: [] },
}, { _id: false });

const productSchema = new mongoose.Schema({
  // Core
  category:    { type: String, required: true },
  subCategory: { type: String, default: '' },
  brand:       { type: String, default: '' },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  price:       { type: Number, required: true },

  // Images
  image:  { type: String, required: true },
  image2: { type: String, default: '' },
  image3: { type: String, default: '' },

  // Config
  unit:   { type: String, default: '' },
  weight: { type: Number, default: 0 },
  minQty: { type: Number, default: 1 },
  Tags:   { type: [String], default: [] },

  // Pricing
  discount:          { type: Number, default: 0 },
  discountType:      { type: String, enum: ['flat', 'percent'], default: 'flat' },
  discountDateRange: { type: String, default: '' },

  // Stock
  stockCount: { type: Number, default: 0, min: 0 },
  salesCount: { type: Number, default: 0 },

  // External link
  externalLink:    { type: String, default: '' },
  linkButtonText:  { type: String, default: '' },

  // Product Settings
  published:   { type: Boolean, default: false },
  featured:    { type: Boolean, default: false },
  todaysDeal:  { type: Boolean, default: false },

  // Flash Sale
  flashSaleId:           { type: String, default: '' },
  flashSaleDiscount:     { type: Number, default: 0 },
  flashSaleDiscountType: { type: String, enum: ['flat', 'percent'], default: 'flat' },

  // Refund
  refundable:  { type: Boolean, default: true },
  refundNote:  { type: String, default: '' },

  // Warranty
  warranty:     { type: Boolean, default: false },
  warrantyNote: { type: String, default: '' },

  // Shipping
  shippingType: { type: String, enum: ['free', 'flat_rate'], default: 'free' },
  shippingCost: { type: Number, default: 0 },
  shippingDays: { type: String, default: '' },

  // Variation
  variation: { type: variationSchema, default: null },

  // Legacy / seller
  seller:            { type: String, default: '' },
  Product_Condition: { type: String, default: 'New' },
  Location:          { type: String, default: '' },
  badge:             { type: String, default: null },

}, { collection: 'category_products', timestamps: true });

export default mongoose.model('Product', productSchema);