import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Pagination from '../components/Pagination';
import Badge from '../components/Badge';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CaretIcon = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="ml-2">
    <path d="M1 1L5 5L9 1" stroke="#9da3ae" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function StarRating({ rating }) {
  return (
    <div className="flex items-center">
      <span className="text-[13px] text-[#232734] mr-2">{rating}</span>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} width="14" height="14" viewBox="0 0 14 14" fill="none" className="mr-0.5">
            <path
              d="M7 0L8.571 4.836H13.657L9.543 7.828L11.114 12.664L7 9.672L2.886 12.664L4.457 7.828L0.343 4.836H5.429L7 0Z"
              fill={star <= Math.round(rating) ? '#FFC107' : '#E0E0E0'}
            />
          </svg>
        ))}
      </div>
    </div>
  );
}

export default function AllProductReviews_Admin() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [sellerOpen, setSellerOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState('All');
  const [ratingSort, setRatingSort] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviewsData, setReviewsData] = useState([]);
  const [allSellers, setAllSellers] = useState(['All']);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customForm, setCustomForm] = useState({
    productId: '',
    userName: '',
    rating: 5,
    comment: '',
  });

  const itemsPerPage = 10;

  // Fetch aggregated product reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSeller !== 'All') params.append('seller', selectedSeller);
      if (ratingSort === 'high') params.append('ratingSort', 'high');
      if (ratingSort === 'low') params.append('ratingSort', 'low');
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`${API_URL}/product-reviews/admin/all-reviews?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const productMap = {};
        data.reviews.forEach((review) => {
          const pid = review.productId;
          if (!productMap[pid]) {
            productMap[pid] = {
              productId: pid,
              productTitle: review.productTitle,
              productImage: review.productImage,
              productOwner: review.productSeller,
              reviews: [],
              customCount: 0,
            };
          }
          productMap[pid].reviews.push(review);
          if (review.custom_review) productMap[pid].customCount++;
        });

        const aggregated = Object.values(productMap).map((p) => ({
          productId: p.productId,
          productTitle: p.productTitle,
          productImage: p.productImage,
          productOwner: p.productOwner,
          avgRating:
            p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length,
          totalReviews: p.reviews.length,
          customReviews: p.customCount,
        }));

        // Sort by rating if needed
        if (ratingSort === 'high') {
          aggregated.sort((a, b) => b.avgRating - a.avgRating);
        } else if (ratingSort === 'low') {
          aggregated.sort((a, b) => a.avgRating - b.avgRating);
        }

        setReviewsData(aggregated);

        // Extract unique sellers
        const sellers = [
          'All',
          ...new Set(aggregated.map((r) => r.productOwner).filter(Boolean)),
        ];
        setAllSellers(sellers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews for a single product
  const fetchProductReviews = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/product-reviews/admin/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSelectedProduct(data.product);
        setProductReviews(data.reviews);
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create custom review
  const handleCreateCustom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/product-reviews/admin/custom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(customForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowCustomModal(false);
        setCustomForm({ productId: '', userName: '', rating: 5, comment: '' });
        fetchReviews();
        alert('Custom review added successfully!');
      } else {
        alert(data.message || 'Failed to add review');
      }
    } catch (err) {
      alert('Error creating review');
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      const res = await fetch(`${API_URL}/product-reviews/admin/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchProductReviews(selectedProduct?._id);
        fetchReviews();
      } else {
        alert('Failed to delete review');
      }
    } catch (err) {
      alert('Error deleting review');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [selectedSeller, ratingSort, searchTerm]);

  const totalPages = Math.ceil(reviewsData.length / itemsPerPage);
  const paginatedData = reviewsData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSellerSelect = (seller) => {
    setSelectedSeller(seller);
    setSellerOpen(false);
    setPage(1);
  };

  const handleRatingSelect = (sort) => {
    setRatingSort(sort);
    setRatingOpen(false);
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-[16px] flex-wrap gap-2">
        <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] m-0">All Rating &amp; Reviews</h1>
        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          className="bg-[#299395] hover:bg-[#1f7273] text-white text-[13px] font-semibold rounded-[6px] px-[16px] h-[36px] transition-colors"
        >
          Add Custom Reviews
        </button>
      </div>

      <Card>
        {/* Header */}
        <div className="px-[20px] py-[16px] border-b border-[#f1f1f4] flex items-center justify-between flex-wrap gap-3">
          <h5 className="text-[15px] leading-[22px] font-semibold text-[#232734] m-0">Product Review &amp; Ratings</h5>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Seller filter */}
            <div className="relative w-[180px]">
              <button
                type="button"
                onClick={() => setSellerOpen((o) => !o)}
                className="w-full h-[36px] px-[12px] flex items-center justify-between border border-[#f1f1f4] rounded-[6px] text-[13px] text-[#232734]"
              >
                {selectedSeller} <CaretIcon />
              </button>
              {sellerOpen && (
                <div className="absolute right-0 top-full mt-1 z-30 w-full bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1 max-h-[300px] overflow-y-auto">
                  {allSellers.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSellerSelect(s)}
                      className="w-full text-left px-[12px] py-[6px] text-[13px] text-[#232734] hover:bg-[#f1fafd]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Rating filter */}
            <div className="relative w-[180px]">
              <button
                type="button"
                onClick={() => setRatingOpen((o) => !o)}
                className="w-full h-[36px] px-[12px] flex items-center justify-between border border-[#f1f1f4] rounded-[6px] text-[13px] text-[#9da3ae]"
              >
                Filter by Rating <CaretIcon />
              </button>
              {ratingOpen && (
                <div className="absolute right-0 top-full mt-1 z-30 w-full bg-white rounded-[6px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.12)] py-1">
                  <button
                    onClick={() => handleRatingSelect('high')}
                    className="w-full text-left px-[12px] py-[6px] text-[13px] text-[#232734] hover:bg-[#f1fafd]"
                  >
                    Rating (High &gt; Low)
                  </button>
                  <button
                    onClick={() => handleRatingSelect('low')}
                    className="w-full text-left px-[12px] py-[6px] text-[13px] text-[#232734] hover:bg-[#f1fafd]"
                  >
                    Rating (Low &gt; High)
                  </button>
                </div>
              )}
            </div>
            {/* Search */}
            <div className="w-[260px]">
              <input
                type="text"
                placeholder="Type Product Name & Hit Enter"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full h-[36px] px-[12px] text-[13px] text-[#232734] border border-[#f1f1f4] rounded-[6px] placeholder:text-[#9da3ae] focus:outline-none focus:border-[#009ef7]"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-[#9da3ae]">Loading...</div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#f1f1f4]">
                  <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#9da3ae]">#</th>
                  <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#9da3ae] w-[40%]">Product Name</th>
                  <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#9da3ae]">Product Owner</th>
                  <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#9da3ae]">Rating</th>
                  <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#9da3ae]">reviews</th>
                  <th className="px-[16px] py-[12px] text-left text-[12px] font-semibold text-[#9da3ae]">Custom Reviews</th>
                  <th className="px-[16px] py-[12px] text-right text-[12px] font-semibold text-[#9da3ae]">Options</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((r, idx) => (
                  <tr key={r.productId} className="border-b border-[#f1f1f4] hover:bg-[#fafafb]">
                    <td className="px-[16px] py-[14px] text-[13px] text-[#232734] align-middle">
                      {(page - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-[16px] py-[14px] align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-[50px] h-[50px] rounded-[4px] overflow-hidden bg-[#f5f5f7] flex-shrink-0 border border-[#f1f1f4]">
                          <img
                            src={r.productImage || 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/placeholder.jpg'}
                            alt=""
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/placeholder.jpg';
                            }}
                          />
                        </div>
                        <a href="#" className="text-[13px] leading-[18px] text-[#009ef7] line-clamp-2">
                          {r.productTitle}
                        </a>
                      </div>
                    </td>
                    <td className="px-[16px] py-[14px] text-[13px] text-[#232734] align-middle">{r.productOwner}</td>
                    <td className="px-[16px] py-[14px] align-middle">
                      <StarRating rating={r.avgRating.toFixed(1)} />
                    </td>
                    <td className="px-[16px] py-[14px] align-middle">
                      <span className="text-[13px] text-[#232734] mr-2">{r.totalReviews}</span>
                      {r.customReviews > 0 && <Badge variant="danger">{r.customReviews} custom</Badge>}
                    </td>
                    <td className="px-[16px] py-[14px] text-[13px] text-[#232734] align-middle">{r.customReviews}</td>
                    <td className="px-[16px] py-[14px] text-right align-middle">
                      <button
                        type="button"
                        onClick={() => fetchProductReviews(r.productId)}
                        className="bg-[#009ef7] hover:bg-[#0086d4] text-white text-[13px] font-semibold rounded-[6px] px-[18px] h-[34px] transition-colors"
                      >
                        View Reviews
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && reviewsData.length > 0 && (
          <Pagination current={page} total={totalPages} onChange={setPage} />
        )}
        {!loading && reviewsData.length === 0 && (
          <div className="text-center py-12 text-[#9da3ae]">No reviews found</div>
        )}
      </Card>

      {/* View Reviews Modal */}
      {showModal && selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-[8px] max-w-3xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[#f1f1f4] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-[40px] h-[40px] rounded-[4px] overflow-hidden bg-[#f5f5f7]">
                  <img
                    src={selectedProduct.image || 'https://demo.activeitzone.com/ecommerce_repo/public/assets/img/placeholder.jpg'}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-[16px] font-semibold text-[#232734]">{selectedProduct.title}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-[#9da3ae] hover:text-[#232734] text-2xl">
                &times;
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              {productReviews.length === 0 ? (
                <p className="text-[#9da3ae] text-center">No reviews yet</p>
              ) : (
                productReviews.map((review) => (
                  <div key={review._id} className="mb-6 pb-6 border-b border-[#f1f1f4] last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-[#232734] text-[14px]">{review.userName}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={review.rating} />
                          {review.custom_review && <Badge variant="danger">Custom Review</Badge>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-500 hover:text-red-700 text-[12px]"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-[13px] text-[#5a6276] mt-2">{review.comment}</p>
                    <div className="text-[11px] text-[#9da3ae] mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Review Modal */}
      {showCustomModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCustomModal(false)}
        >
          <div
            className="bg-white rounded-[8px] max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[#f1f1f4] flex justify-between items-center">
              <h3 className="text-[16px] font-semibold text-[#232734]">Add Custom Review</h3>
              <button onClick={() => setShowCustomModal(false)} className="text-[#9da3ae] hover:text-[#232734] text-2xl">
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateCustom} className="p-6">
              <div className="mb-4">
                <label className="block text-[13px] font-medium text-[#232734] mb-2">Product ID</label>
                <input
                  type="text"
                  required
                  value={customForm.productId}
                  onChange={(e) => setCustomForm({ ...customForm, productId: e.target.value })}
                  className="w-full h-[36px] px-[12px] text-[13px] border border-[#f1f1f4] rounded-[6px] focus:outline-none focus:border-[#009ef7]"
                  placeholder="Enter Product ID"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[13px] font-medium text-[#232734] mb-2">User Name</label>
                <input
                  type="text"
                  required
                  value={customForm.userName}
                  onChange={(e) => setCustomForm({ ...customForm, userName: e.target.value })}
                  className="w-full h-[36px] px-[12px] text-[13px] border border-[#f1f1f4] rounded-[6px] focus:outline-none focus:border-[#009ef7]"
                  placeholder="Enter user name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-[13px] font-medium text-[#232734] mb-2">Rating (1-5)</label>
                <select
                  value={customForm.rating}
                  onChange={(e) => setCustomForm({ ...customForm, rating: Number(e.target.value) })}
                  className="w-full h-[36px] px-[12px] text-[13px] border border-[#f1f1f4] rounded-[6px] focus:outline-none focus:border-[#009ef7]"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Terrible</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-[13px] font-medium text-[#232734] mb-2">Comment</label>
                <textarea
                  required
                  value={customForm.comment}
                  onChange={(e) => setCustomForm({ ...customForm, comment: e.target.value })}
                  className="w-full px-[12px] py-[8px] text-[13px] border border-[#f1f1f4] rounded-[6px] focus:outline-none focus:border-[#009ef7] resize-none"
                  rows="4"
                  placeholder="Enter review comment"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 bg-[#f5f5f7] hover:bg-[#eaeaef] text-[#232734] text-[13px] font-semibold rounded-[6px] h-[36px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#299395] hover:bg-[#1f7273] text-white text-[13px] font-semibold rounded-[6px] h-[36px] transition-colors"
                >
                  Add Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}