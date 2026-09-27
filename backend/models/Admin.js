import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:    { type: String, required: true, trim: true },
  password: { type: String, required: true },
  avatar:   { type: String, default: '' }, // Added avatar support for admin
}, { timestamps: true });

export default mongoose.model('Admin', adminSchema);