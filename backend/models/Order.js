import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:            { type: String, required: true },
  image:           { type: String, default: '' },
  price:           { type: Number, required: true },   
  originalPrice:   { type: Number, default: 0 },       
  qty:             { type: Number, required: true, min: 1 },
  selectedVariant: { type: String, default: '' },
  seller:          { type: String, default: '' },
  brand:           { type: String, default: '' },
  category:        { type: String, default: '' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:       { type: [orderItemSchema], required: true },
  totalAmount: { type: Number, required: true },

  status: {
    type:    String,
    enum:    ['pending', 'confirmed', 'delivered'],
    default: 'pending',
  },

  paymentStatus: {
    type:    String,
    enum:    ['unpaid', 'paid'],
    default: 'unpaid',
  },

  shippingAddress: {
    name:        { type: String, default: '' },
    email:       { type: String, default: '' },
    phone:       { type: String, default: '' },
    address:     { type: String, default: '' },
    city:        { type: String, default: '' },
    state:       { type: String, default: '' },
    country:     { type: String, default: '' },
    postal_code: { type: String, default: '' },
  },
  paymentMethod:  { type: String, default: 'cash_on_delivery' },
  additionalInfo: { type: String, default: '' },
  deliveryType:   { type: String, default: 'home_delivery' },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);