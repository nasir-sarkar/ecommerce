import mongoose from 'mongoose';

const colSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    items: { type: [String], default: [] },
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    img:   { type: String, default: '' },
    icon:  { type: String, default: '' },
    cols:  { type: [colSchema], default: [] },
    order: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    hot: { type: Boolean, default: false },
  },
  { collection: 'categories', timestamps: true }
);

export default mongoose.model('Category', categorySchema);