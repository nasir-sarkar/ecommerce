import FlashSale from '../models/FlashSale.js';
import Product   from '../models/Product.js';

// Helper: get or create the single flash-sale document
const getDoc = async () => {
  let doc = await FlashSale.findOne();
  if (!doc) {
    doc = await FlashSale.create({ bannerImage: '', deals: [], segments: [] });
  }
  return doc;
};


// GET /api/flash-sale
export const getFlashSale = async (req, res) => {
  try {
    const doc = await getDoc();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// PUT /api/flash-sale  — replace the whole document
export const updateFlashSale = async (req, res) => {
  try {
    const { bannerImage, deals } = req.body;
    const doc = await getDoc();
    if (bannerImage !== undefined) doc.bannerImage = bannerImage;
    if (deals       !== undefined) doc.deals       = deals;
    const saved = await doc.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// PATCH /api/flash-sale/banner
export const updateBanner = async (req, res) => {
  try {
    const { bannerImage } = req.body;
    if (!bannerImage) return res.status(400).json({ message: 'bannerImage is required' });
    const doc = await getDoc();
    doc.bannerImage = bannerImage;
    const saved = await doc.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// POST /api/flash-sale/deals
export const addDeal = async (req, res) => {
  try {
    const { img, end, discountPercent = 0 } = req.body;
    if (!img || !end) return res.status(400).json({ message: 'img and end are required' });
    const doc = await getDoc();
    const newId = doc.deals.length ? Math.max(...doc.deals.map(d => d.id)) + 1 : 1;
    doc.deals.push({ id: newId, img, end, discountPercent, products: [] });
    const saved = await doc.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// PUT /api/flash-sale/deals/:id
export const updateDeal = async (req, res) => {
  try {
    const dealId = Number(req.params.id);
    const { img, end, discountPercent } = req.body;
    const doc = await getDoc();
    const deal = doc.deals.find(d => d.id === dealId);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    if (img             !== undefined) deal.img             = img;
    if (end             !== undefined) deal.end             = end;
    if (discountPercent !== undefined) deal.discountPercent = discountPercent;
    const saved = await doc.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE /api/flash-sale/deals/:id
export const deleteDeal = async (req, res) => {
  try {
    const dealId = Number(req.params.id);
    const doc = await getDoc();
    const before = doc.deals.length;
    doc.deals = doc.deals.filter(d => d.id !== dealId);
    if (doc.deals.length === before) return res.status(404).json({ message: 'Deal not found' });
    const saved = await doc.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Deal Products 

// GET /api/flash-sale/deals/:id/products
export const getDealProducts = async (req, res) => {
  try {
    const dealId = Number(req.params.id);
    const doc    = await getDoc();
    const deal   = doc.deals.find(d => d.id === dealId);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });

    const ids      = deal.products.map(p => p.productId);
    const products = await Product.find({ _id: { $in: ids } });
    const discount = deal.discountPercent || 0;

    const withDiscount = products.map(p => ({
      ...p.toObject(),
      originalPrice:   p.price,
      discountPercent: discount,
      discountedPrice: +(p.price * (1 - discount / 100)).toFixed(2),
    }));

    res.json({
      deal: {
        id:              deal.id,
        img:             deal.img,
        end:             deal.end,
        discountPercent: deal.discountPercent,
      },
      products: withDiscount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// POST /api/flash-sale/deals/:id/products
export const addProductToDeal = async (req, res) => {
  try {
    const dealId    = Number(req.params.id);
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required' });
    const doc  = await getDoc();
    const deal = doc.deals.find(d => d.id === dealId);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    if (deal.products.some(p => p.productId === productId)) {
      return res.status(409).json({ message: 'Product already in this deal' });
    }
    deal.products.push({ productId });
    const saved = await doc.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE /api/flash-sale/deals/:id/products/:productId
export const removeProductFromDeal = async (req, res) => {
  try {
    const dealId    = Number(req.params.id);
    const { productId } = req.params;
    const doc  = await getDoc();
    const deal = doc.deals.find(d => d.id === dealId);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    const before = deal.products.length;
    deal.products = deal.products.filter(p => p.productId !== productId);
    if (deal.products.length === before) return res.status(404).json({ message: 'Product not found in deal' });
    const saved = await doc.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//  SEGMENT ENDPOINTS
export const addSegment = async (req, res) => {
  try {
    const { label, discountPercent = 0 } = req.body;
    if (!label) return res.status(400).json({ message: 'label is required' });
    const doc = await getDoc();
    doc.segments.push({ label, discountPercent, products: [] });
    const saved = await doc.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSegment = async (req, res) => {
  try {
    const { segId } = req.params;
    const { label, discountPercent } = req.body;
    const doc = await getDoc();
    const seg = doc.segments.id(segId);
    if (!seg) return res.status(404).json({ message: 'Segment not found' });
    if (label           !== undefined) seg.label           = label;
    if (discountPercent !== undefined) seg.discountPercent = discountPercent;
    const saved = await doc.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSegment = async (req, res) => {
  try {
    const { segId } = req.params;
    const doc = await getDoc();
    const seg = doc.segments.id(segId);
    if (!seg) return res.status(404).json({ message: 'Segment not found' });
    seg.deleteOne();
    const saved = await doc.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addProductToSegment = async (req, res) => {
  try {
    const { segId } = req.params;
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required' });
    const doc = await getDoc();
    const seg = doc.segments.id(segId);
    if (!seg) return res.status(404).json({ message: 'Segment not found' });
    if (seg.products.some(p => p.productId === productId)) {
      return res.status(409).json({ message: 'Product already in this segment' });
    }
    seg.products.push({ productId });
    const saved = await doc.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeProductFromSegment = async (req, res) => {
  try {
    const { segId, productId } = req.params;
    const doc = await getDoc();
    const seg = doc.segments.id(segId);
    if (!seg) return res.status(404).json({ message: 'Segment not found' });
    const before = seg.products.length;
    seg.products = seg.products.filter(p => p.productId !== productId);
    if (seg.products.length === before) return res.status(404).json({ message: 'Product not found in segment' });
    const saved = await doc.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSegmentProducts = async (req, res) => {
  try {
    const { segId } = req.params;
    const doc = await getDoc();
    const seg = doc.segments.id(segId);
    if (!seg) return res.status(404).json({ message: 'Segment not found' });
    const ids      = seg.products.map(p => p.productId);
    const products = await Product.find({ _id: { $in: ids } });
    const discount = seg.discountPercent || 0;
    const withDiscount = products.map(p => ({
      ...p.toObject(),
      originalPrice:   p.price,
      discountPercent: discount,
      discountedPrice: +(p.price * (1 - discount / 100)).toFixed(2),
    }));
    res.json({ segment: { _id: seg._id, label: seg.label, discountPercent: seg.discountPercent }, products: withDiscount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};