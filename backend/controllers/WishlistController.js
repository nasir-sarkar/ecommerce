import Wishlist from '../models/Wishlist.js';
import Product  from '../models/Product.js';

// GET /api/wishlist  — all wishlist items for the logged-in user
export const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.id })
      .populate('product')
      .sort({ createdAt: -1 });

    const products = items
      .filter(item => item.product)
      .map(item => ({
        wishlistId: item._id,
        ...item.product.toObject(),
      }));

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/wishlist/:productId  — add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const exists = await Wishlist.findOne({ user: req.user.id, product: productId });
    if (exists) {
      return res.json({ success: true, message: 'Already in wishlist' });
    }

    await Wishlist.create({ user: req.user.id, product: productId });
    res.json({ success: true, message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/wishlist/:productId  — remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    await Wishlist.deleteOne({ user: req.user.id, product: productId });
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/wishlist/ids  — just product IDs (used by frontend to check heart state)
export const getWishlistIds = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.id }).select('product');
    const ids = items.map(item => item.product.toString());
    res.json({ success: true, ids });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};