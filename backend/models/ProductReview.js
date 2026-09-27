import mongoose from 'mongoose';

const productReviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  orderId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Order',   required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  userName:  { type: String, required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, required: true },
  custom_review: { type: Boolean, default: false },   // <-- NEW
}, { timestamps: true });

// One review per user per order item
productReviewSchema.index({ productId: 1, userId: 1, orderId: 1 }, { unique: true });

export default mongoose.model('ProductReview', productReviewSchema);