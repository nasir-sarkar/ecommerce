import mongoose from 'mongoose';

const dealProductSchema = new mongoose.Schema({
  productId: { type: String, required: true },
}, { _id: false });

const dealSchema = new mongoose.Schema({
  id:              { type: Number, required: true },
  img:             { type: String, required: true },
  end:             { type: String, required: true },
  discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  products:        { type: [dealProductSchema], default: [] },
}, { _id: false });

// Keep segments for backward compat (optional)
const segmentProductSchema = new mongoose.Schema({
  productId: { type: String, required: true },
}, { _id: false });

const segmentSchema = new mongoose.Schema({
  label:           { type: String, required: true },
  discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  products:        { type: [segmentProductSchema], default: [] },
}, { _id: true });

const flashSaleSchema = new mongoose.Schema({
  bannerImage: { type: String, default: '' },
  deals:       { type: [dealSchema], default: [] },
  segments:    { type: [segmentSchema], default: [] },
}, { collection: 'flash_sales', timestamps: true });

export default mongoose.model('FlashSale', flashSaleSchema);







// import mongoose from 'mongoose';

// const dealSchema = new mongoose.Schema({
//   id:  { type: Number, required: true },
//   img: { type: String, required: true },
//   end: { type: String, required: true },
// }, { _id: false });

// const flashSaleSchema = new mongoose.Schema({
//   bannerImage: { type: String, default: '' },
//   deals:       { type: [dealSchema], default: [] },
// }, { collection: 'flash_sales', timestamps: true });

// export default mongoose.model('FlashSale', flashSaleSchema);