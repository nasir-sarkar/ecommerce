import mongoose from 'mongoose';

// sub-schemas
const linkSchema = new mongoose.Schema(
  { name: { type: String, default: '' }, path: { type: String, default: '' } },
  { _id: false }
);

const socialSchema = new mongoose.Schema(
  {
    platform: { type: String, default: '' },
    url:      { type: String, default: '' },
    enabled:  { type: Boolean, default: true },
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    address: { type: String, default: '' },
    phone:   { type: String, default: '' },
    email:   { type: String, default: '' },
  },
  { _id: false }
);

const footerSchema = new mongoose.Schema({
  // Description section
  descriptionTitle: { type: String, default: 'Active eCommerce CMS | AN ONLINE SHOPPING PLATFORM WITH GREAT DEALS' },
  descriptionText:  { type: String, default: '' },

  
  // Logo & app links
  logoUrl:        { type: String, default: '' },
  googlePlayUrl:  { type: String, default: 'https://play.google.com/store/apps' },
  appStoreUrl:    { type: String, default: 'https://www.apple.com/app-store/' },


  // Social links
  socialLinks: {
    type: [socialSchema],
    default: [
      { platform: 'facebook',  url: 'https://facebook.com/',        enabled: true },
      { platform: 'twitter',   url: 'https://twitter.com/',         enabled: true },
      { platform: 'instagram', url: 'https://www.instagram.com/',   enabled: true },
      { platform: 'youtube',   url: 'https://youtube.com/',         enabled: true },
      { platform: 'linkedin',  url: 'https://linkedin.com/',        enabled: true },
    ],
  },


  // Quick links column
  quickLinks: {
    type: [linkSchema],
    default: [
      { name: 'Support Policy Page',  path: '/support-policy' },
      { name: 'Return Policy Page',   path: '/return-policy' },
      { name: 'About Us',             path: '/about' },
      { name: 'Privacy Policy Page',  path: '/privacy-policy' },
      { name: 'Seller Policy',        path: '/seller-policy' },
      { name: 'Term Conditions Page', path: '/terms-conditions' },
    ],
  },


  // Contact info
  contact: {
    type: contactSchema,
    default: { address: 'Demo', phone: '+01 234 567 890', email: 'yourmail@email.com' },
  },


  // My Account links
  myAccountLinks: {
    type: [linkSchema],
    default: [
      { name: 'Login',                  path: '/login' },
      { name: 'Order History',          path: '/order-history' },
      { name: 'My Wishlist',            path: '/wishlist' },
      { name: 'Track Order',            path: '/track-order' },
      { name: 'Be an affiliate partner',path: '/affiliate' },
    ],
  },


  // Seller Zone links
  sellerLinks: {
    type: [linkSchema],
    default: [
      { name: 'Become A Seller',         path: '/become-seller' },
      { name: 'Login to Seller Panel',   path: '/seller-login' },
      { name: 'Download Seller App',     path: '/seller-app' },
    ],
  },


  // Delivery Boy links
  deliveryLinks: {
    type: [linkSchema],
    default: [
      { name: 'Login to Delivery Boy Panel', path: '/delivery-login' },
      { name: 'Download Delivery Boy App',   path: '/delivery-app' },
    ],
  },


  // Bottom bar
  copyrightText: { type: String, default: 'Active eCommerce CMS 2025' },

}, { collection: 'footers', timestamps: true });

export default mongoose.model('Footer', footerSchema);