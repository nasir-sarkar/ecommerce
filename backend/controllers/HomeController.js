import Home    from '../models/Home.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const getDoc = async () => {
  let doc = await Home.findOne();
  if (!doc) {
    doc = await Home.create({
      headlineBanner: [
        { text: 'Active eCommerce CMS — the #1 pioneer of eCommerce PHP scripts on Envato, powering a thriving community of 39,000+ premium licenses' },
        { text: 'Welcome to Active eCommerce CMS v10' },
      ],
      hotCategories: [], heroBanners: [], flashDealBanner: '', flashDealEnd: '',
      featuredCategories: [], promotionBanners: [], shopsLongBanner: '',
    });
  }
  return doc;
};

const fetchByIds = async (ids = []) => {
  if (!ids.length) return [];
  const products = await Product.find({ _id: { $in: ids } });
  const map = Object.fromEntries(products.map(p => [p._id.toString(), p]));
  return ids.map(id => map[id]).filter(Boolean);
};

// GET /api/home
export const getHome = async (req, res) => {
  try {
    const doc = await getDoc();
    const plain = doc.toObject();

    // Fetch products based on their attributes (dynamic)
    const featuredProductsSmall = await Product.find({ featured: true, published: true })
      .limit(10)
      .lean();
    
    const bestSellingProducts = await Product.find({ published: true })
      .sort({ salesCount: -1 })
      .limit(10)
      .lean();
    
    const todayDealProducts = await Product.find({ todaysDeal: true, published: true })
      .limit(10)
      .lean();
    
    // These remain from home document (static/manual)
    const auctionProducts = await fetchByIds(plain.auctionProducts);
    const classifiedAds = await fetchByIds(plain.classifiedAds);
    const preOrderProducts = await fetchByIds(plain.preOrderProducts);
    const allProducts = await fetchByIds(plain.allProducts);

    // Fetch categories based on hot and featured attributes
    const hotCategoriesData = await Category.find({ hot: true })
      .sort({ order: 1 })
      .lean();
    
    const featuredCategoriesData = await Category.find({ featured: true })
      .sort({ order: 1 })
      .lean();

    // Format hot categories for frontend
    const formattedHotCategories = hotCategoriesData.map(cat => ({
      name: cat.name,
      img: cat.img || ''
    }));

    // Format featured categories for frontend
    const formattedFeaturedCategories = featuredCategoriesData.map(cat => ({
      name: cat.name,
      img: cat.img || ''
    }));

    res.json({
      ...plain,
      featuredProductsSmall,
      bestSellingProducts,
      todayDealProducts,
      auctionProducts,
      classifiedAds,
      preOrderProducts,
      allProducts,
      hotCategories: formattedHotCategories,
      featuredCategories: formattedFeaturedCategories,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/home 
export const updateHome = async (req, res) => {
  try {
    const allowed = [
      'headlineBanner',
      'hotCategories','heroBanners','flashDealBanner','flashDealEnd','featuredCategories',
      'promotionBanners','shopsLongBanner',
      'featuredProductsSmall','bestSellingProducts','todayDealProducts',
      'auctionProducts','classifiedAds','preOrderProducts','allProducts',
    ];
    const doc = await getDoc();
    allowed.forEach(key => {
      if (req.body[key] !== undefined) doc[key] = req.body[key];
    });
    const saved = await doc.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Section-level PATCH helpers

// PATCH /api/home/headline-banner
export const updateHeadlineBanner = async (req, res) => {
  try {
    const { headlineBanner } = req.body;
    if (!Array.isArray(headlineBanner))
      return res.status(400).json({ message: 'headlineBanner must be an array' });
    const doc = await getDoc();
    doc.headlineBanner = headlineBanner;
    res.json(await doc.save());
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PATCH /api/home/hero-banners
export const updateHeroBanners = async (req, res) => {
  try {
    const { heroBanners } = req.body;
    if (!Array.isArray(heroBanners))
      return res.status(400).json({ message: 'heroBanners must be an array' });
    const doc = await getDoc();
    doc.heroBanners = heroBanners;
    res.json(await doc.save());
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PATCH /api/home/flash-deal-banner
export const updateFlashDealBanner = async (req, res) => {
  try {
    const { flashDealBanner, flashDealEnd } = req.body;
    if (!flashDealBanner)
      return res.status(400).json({ message: 'flashDealBanner is required' });
    const doc = await getDoc();
    doc.flashDealBanner = flashDealBanner;
    if (flashDealEnd !== undefined) doc.flashDealEnd = flashDealEnd;
    res.json(await doc.save());
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PATCH /api/home/hot-categories
export const updateHotCategories = async (req, res) => {
  try {
    const { hotCategories } = req.body;
    if (!Array.isArray(hotCategories))
      return res.status(400).json({ message: 'hotCategories must be an array' });
    const doc = await getDoc();
    doc.hotCategories = hotCategories;
    res.json(await doc.save());
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PATCH /api/home/featured-categories
export const updateFeaturedCategories = async (req, res) => {
  try {
    const { featuredCategories } = req.body;
    if (!Array.isArray(featuredCategories))
      return res.status(400).json({ message: 'featuredCategories must be an array' });
    const doc = await getDoc();
    doc.featuredCategories = featuredCategories;
    res.json(await doc.save());
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PATCH /api/home/promotion-banners
export const updatePromotionBanners = async (req, res) => {
  try {
    const { promotionBanners } = req.body;
    if (!Array.isArray(promotionBanners))
      return res.status(400).json({ message: 'promotionBanners must be an array' });
    const doc = await getDoc();
    doc.promotionBanners = promotionBanners;
    res.json(await doc.save());
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PATCH /api/home/shops-long-banner
export const updateShopsLongBanner = async (req, res) => {
  try {
    const { shopsLongBanner } = req.body;
    if (!shopsLongBanner)
      return res.status(400).json({ message: 'shopsLongBanner is required' });
    const doc = await getDoc();
    doc.shopsLongBanner = shopsLongBanner;
    res.json(await doc.save());
  } catch (err) { res.status(500).json({ message: err.message }); }
};