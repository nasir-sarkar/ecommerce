import mongoose from 'mongoose';

const namedItemSchema = new mongoose.Schema(
  { name: { type: String, default: '' }, img: { type: String, default: '' } },
  { _id: false }
);

const promotionBannerSchema = new mongoose.Schema(
  { img: { type: String, default: '' }, alt: { type: String, default: '' } },
  { _id: false }
);


// Each headline message shown in the scrolling top banner
const headlineMessageSchema = new mongoose.Schema(
  { text: { type: String, default: '' } },
  { _id: false }
);

const homeSchema = new mongoose.Schema({
  // Scrolling top headline banner
  headlineBanner: {
    type: [headlineMessageSchema],
    default: [
      { text: 'Active eCommerce CMS — the #1 pioneer of eCommerce PHP scripts on Envato, powering a thriving community of 39,000+ premium licenses' },
      { text: 'Welcome to Active eCommerce CMS v10' },
    ],
  },


  // visual / banner fields
  hotCategories:      { type: [namedItemSchema],      default: [] },
  heroBanners:        { type: [String],               default: [] },
  flashDealBanner:    { type: String,                 default: '' },
  flashDealEnd:       { type: String,                 default: '' },
  featuredCategories: { type: [namedItemSchema],      default: [] },
  promotionBanners:   { type: [promotionBannerSchema],default: [] },
  shopsLongBanner:    { type: String,                 default: '' },


  // product section ID lists
  featuredProductsSmall: { type: [String], default: [] },
  bestSellingProducts:   { type: [String], default: [] },
  todayDealProducts:     { type: [String], default: [] },
  auctionProducts:       { type: [String], default: [] },
  classifiedAds:         { type: [String], default: [] },
  preOrderProducts:      { type: [String], default: [] },
  allProducts:           { type: [String], default: [] },
}, { collection: 'homes', timestamps: true });

export default mongoose.model('Home', homeSchema);