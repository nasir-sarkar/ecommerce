import mongoose from 'mongoose'

const brandItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  metaTitle: {
    type: String,
    default: ''
  },
  metaDescription: {
    type: String,
    default: ''
  },
  metaKeywords: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  _id: true,
  timestamps: true 
})

const brandSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true
  },
  pageTitle: {
    type: String,
    required: true,
    default: 'All Brands'
  },
  breadcrumbLabel: {
    type: String,
    required: true,
    default: 'All Brands'
  },
  placeholderImage: {
    type: String,
    default: 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/placeholder.jpg'
  },
  brands: [brandItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Middleware to update updatedAt on save for main document
brandSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

const Brand = mongoose.model('Brand', brandSchema)

export default Brand