import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
  fullName:        { type: String, required: true, trim: true },
  shopName:        { type: String, required: true, trim: true },
  email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:           { type: String, required: true, trim: true },
  password:        { type: String, required: true },
  avatar:          { type: String, default: '' },
  isVerified:      { type: Boolean, default: false },
  followers:       { type: [String], default: [] },
  customFollowers: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Seller', sellerSchema);