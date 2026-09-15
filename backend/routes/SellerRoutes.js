import express from 'express';
import Seller from '../models/Seller.js';
import Review from '../models/Review.js';

const router = express.Router();

// GET /api/sellers — list all sellers (name + shopName)
router.get('/', async (req, res) => {
  try {
    const sellers = await Seller.find().select('shopName fullName').sort({ shopName: 1 });
    res.json({ success: true, data: sellers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/sellers/ratings
router.get('/ratings', async (req, res) => {
  try {
    const sellers = await Seller.find().select('-password').sort({ createdAt: -1 });

    // aggregate review data for all sellers in one query
    const reviews = await Review.aggregate([
      {
        $group: {
          _id: '$sellerName',
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const reviewMap = {};
    reviews.forEach(r => { reviewMap[r._id] = r; });

    const data = sellers.map(s => {
      const rv = reviewMap[s.shopName] || { avgRating: 0, totalReviews: 0 };
      return {
        _id:             s._id,
        shopName:        s.shopName,
        fullName:        s.fullName,
        email:           s.email,
        phone:           s.phone,
        followers:       s.followers?.length || 0,
        customFollowers: s.customFollowers || 0,
        avgRating:       Math.round((rv.avgRating || 0) * 10) / 10,
        totalReviews:    rv.totalReviews || 0,
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/sellers/followed-by/:followerId — sellers followed by a specific user/guest
router.get('/followed-by/:followerId', async (req, res) => {
  try {
    const { followerId } = req.params;
    if (!followerId) return res.status(400).json({ success: false, message: 'followerId required' });

    const sellers = await Seller.find({ followers: followerId }).select('-password').sort({ shopName: 1 });

    const data = sellers.map(s => ({
      _id:             s._id,
      shopName:        s.shopName,
      fullName:        s.fullName,
      avatar:          s.avatar,
      followers:       s.followers?.length || 0,
      customFollowers: s.customFollowers || 0,
    }));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/sellers/by-shop/:shopName — get single seller by shopName (for SellerStore)
router.get('/by-shop/:shopName', async (req, res) => {
  try {
    const seller = await Seller.findOne({
      shopName: { $regex: new RegExp(`^${decodeURIComponent(req.params.shopName)}$`, 'i') },
    }).select('-password');
    if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });
    res.json({ success: true, data: seller });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/sellers/:id/follow — toggle follow by guestId or userId
router.post('/:id/follow', async (req, res) => {
  try {
    const { followerId } = req.body;   // client sends a stable guest/user id
    if (!followerId) return res.status(400).json({ success: false, message: 'followerId required' });

    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });

    const already = seller.followers.includes(followerId);
    if (already) {
      seller.followers = seller.followers.filter(f => f !== followerId);
    } else {
      seller.followers.push(followerId);
    }
    await seller.save();

    res.json({ success: true, following: !already, followers: seller.followers.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/sellers/:id/custom-followers — admin sets customFollowers
router.patch('/:id/custom-followers', async (req, res) => {
  try {
    const { customFollowers } = req.body;
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { customFollowers: Number(customFollowers) || 0 },
      { new: true }
    ).select('-password');
    if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });
    res.json({ success: true, data: seller });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;