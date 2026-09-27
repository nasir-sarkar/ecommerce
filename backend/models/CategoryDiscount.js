import mongoose from 'mongoose';

const categoryDiscountSchema = new mongoose.Schema({
  categoryId: { type: String, required: true, index: true },
  categoryName: { type: String, required: true },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  endDate: { type: Date, required: true }, // Only end date, start date is today
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { collection: 'category_discounts', timestamps: true });

// Index for faster queries
categoryDiscountSchema.index({ categoryId: 1, active: 1 });

export default mongoose.model('CategoryDiscount', categoryDiscountSchema);