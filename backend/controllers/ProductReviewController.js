import mongoose from 'mongoose';
import ProductReview from '../models/ProductReview.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';


//  Public / Customer routes

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await ProductReview.find({ productId: req.params.productId })
      .sort({ createdAt: -1 });

    const avgRating = reviews.length
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

    res.json({ success: true, reviews, avgRating, total: reviews.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createProductReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.fullName || req.user.email || 'User';
    const { productId, orderId, rating, comment } = req.body;

    if (!productId || !orderId || !rating || !comment)
      return res.status(400).json({ success: false, message: 'All fields required' });

    const order = await Order.findOne({ _id: orderId, userId, status: 'delivered' });
    if (!order)
      return res.status(403).json({ success: false, message: 'No delivered order found for this product' });

    const hasProduct = order.items.some(i => i.productId.toString() === productId);
    if (!hasProduct)
      return res.status(403).json({ success: false, message: 'Product not in this order' });

    const existing = await ProductReview.findOne({ productId, userId, orderId });
    if (existing)
      return res.status(409).json({ success: false, message: 'You have already reviewed this product for this order' });

    const review = await ProductReview.create({
      productId,
      orderId,
      userId,
      userName,
      rating: Number(rating),
      comment,
      custom_review: false,
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ success: false, message: 'Already reviewed' });
    res.status(500).json({ success: false, message: err.message });
  }
};


//  Admin routes

// Get all product reviews (flat list) – for admin panel
export const getAllProductReviewsForAdmin = async (req, res) => {
  try {
    const { seller, productId, rating, search } = req.query;

    let match = {};
    if (rating && rating !== '0') {
      match.rating = parseInt(rating);
    }

    // Filter by seller / product / search (product title)
    let productIds = null;
    if (seller || productId || search) {
      let productFilter = {};
      if (seller) productFilter.seller = seller;
      if (productId) productFilter._id = productId;
      if (search) productFilter.title = { $regex: search, $options: 'i' };
      const products = await Product.find(productFilter).select('_id');
      productIds = products.map(p => p._id);
      if (productIds.length === 0) {
        return res.json({ success: true, reviews: [] });
      }
      match.productId = { $in: productIds };
    }

    const reviews = await ProductReview.find(match)
      .sort({ createdAt: -1 })
      .lean();

    // Attach product details
    const uniqueProductIds = [...new Set(reviews.map(r => r.productId.toString()))];
    const products = await Product.find({ _id: { $in: uniqueProductIds } }).lean();
    const productDetails = {};
    products.forEach(p => {
      productDetails[p._id.toString()] = {
        title: p.title,
        image: p.image,
        seller: p.seller || 'Unknown',
      };
    });

    const enriched = reviews.map(r => ({
      ...r,
      productTitle: productDetails[r.productId.toString()]?.title || 'Deleted product',
      productImage: productDetails[r.productId.toString()]?.image || '',
      productSeller: productDetails[r.productId.toString()]?.seller || 'Unknown',
    }));

    res.json({ success: true, reviews: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all reviews for a specific product (admin detail view)
export const getProductReviewsForAdmin = async (req, res) => {
  try {
    const reviews = await ProductReview.find({ productId: req.params.productId })
      .sort({ createdAt: -1 })
      .populate('userId', 'email fullName');

    const product = await Product.findById(req.params.productId).select('title image seller');
    res.json({ success: true, product, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin creates a custom review (no order required)
export const createCustomReview = async (req, res) => {
  try {
    const { productId, userName, rating, comment } = req.body;

    if (!productId || !userName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = await ProductReview.create({
      productId,
      orderId: new mongoose.Types.ObjectId(), // dummy
      userId: req.user.id,
      userName,
      rating: Number(rating),
      comment,
      custom_review: true,
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'A review for this product by this user already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin delete any review
export const deleteReview = async (req, res) => {
  try {
    const review = await ProductReview.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};