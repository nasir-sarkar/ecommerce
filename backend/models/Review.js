import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  sellerName:  { type: String, required: true, index: true },
  userName:    { type: String, required: true },
  rating:      { type: Number, required: true, min: 1, max: 5 },
  comment:     { type: String, required: true },
  avatar:      { type: String, default: '' },
}, { collection: 'seller_reviews', timestamps: true });

export default mongoose.model('Review', reviewSchema);