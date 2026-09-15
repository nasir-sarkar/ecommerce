import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email:    { type: String, default: '', lowercase: true, trim: true },
  phone:    { type: String, default: '', trim: true },
  password: { type: String, required: true },
  
  // Status fields
  verificationStatus: {
    type: String,
    enum: ['verified', 'unverified'],
    default: 'verified'   
  },
  isBanned: { type: Boolean, default: false },
  
  // Profile fields
  avatar:   { type: String, default: '' },
  addresses: [{
    address: String,
    postalCode: String,
    city: String,
    state: String,
    country: String,
    phone: String,
    isDefaultShipping: { type: Boolean, default: false },
    isDefaultBilling:  { type: Boolean, default: false }
  }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);