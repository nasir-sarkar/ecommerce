import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  featuredImage: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    default: []
  }],
  category: {
    type: String,
    required: true,
    index: true
  },
  tags: [{
    type: String,
    default: []
  }],
  author: {
    name: {
      type: String,
      default: 'Active IT Zone Limited'
    },
    avatar: {
      type: String,
      default: 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/placeholder-rect.jpg'
    },
    bio: {
      type: String,
      default: 'Power Elite Author on Envato'
    }
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'blogs'
});



blogSchema.methods.incrementViews = async function() {
  await this.constructor.updateOne(
    { _id: this._id },
    { $inc: { views: 1 } }
  );
  this.views += 1;
  return this.views;
};

export default mongoose.model('Blog', blogSchema);