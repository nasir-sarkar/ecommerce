import Review from '../models/Review.js';

// GET /api/reviews/:sellerName
export const getReviewsBySeller = async (req, res) => {
  try {
    const { sellerName } = req.params;
    const reviews = await Review.find({ sellerName }).sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({ reviews, avgRating: Math.round(avgRating * 10) / 10, total: reviews.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { sellerName, userName, rating, comment } = req.body;
    if (!sellerName || !userName || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const review = new Review({ sellerName, userName, rating: Number(rating), comment });
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};