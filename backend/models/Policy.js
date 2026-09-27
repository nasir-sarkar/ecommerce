import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    title:       { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const policySchema = new mongoose.Schema({
  type:     { type: String, required: true, unique: true }, 
  sections: { type: [sectionSchema], default: [] },
}, { collection: 'policies', timestamps: true });

export default mongoose.model('Policy', policySchema);