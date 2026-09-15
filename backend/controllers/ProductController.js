import Product from '../models/Product.js';
import FlashSale from '../models/FlashSale.js';
import Home from '../models/Home.js';



const bool = (v, fallback = false) =>
  v === undefined ? fallback : v === true || v === 'true' || v === '1';

const num = (v, fallback = 0) =>
  v !== undefined && v !== null && v !== '' ? Number(v) : fallback;

/** Sync product id into/out of home.todayDealProducts */
async function syncHomeField(field, productId, enabled) {
  try {
    const home = await Home.findOne();
    if (!home) return;
    const list = home[field] || [];
    const idx  = list.indexOf(productId);
    if (enabled && idx === -1) list.push(productId);
    if (!enabled && idx !== -1) list.splice(idx, 1);
    home[field] = list;
    await home.save();
  } catch (_) { /* non-fatal */ }
}

/** Add product to flash sale deal's products array */
async function addToFlashSaleDeal(flashSaleId, productId) {
  if (!flashSaleId) return;
  try {
    const fs = await FlashSale.findOne();
    if (!fs) return;
    const deal = fs.deals.find(d => String(d.id) === String(flashSaleId));
    if (!deal) return;
    const already = deal.products.some(p => p.productId === productId);
    if (!already) deal.products.push({ productId });
    await fs.save();
  } catch (_) { /* non-fatal */ }
}

/** Remove product from all flash sale deals */
async function removeFromFlashSale(productId) {
  try {
    const fs = await FlashSale.findOne();
    if (!fs) return;
    fs.deals.forEach(d => {
      d.products = d.products.filter(p => p.productId !== productId);
    });
    await fs.save();
  } catch (_) { /* non-fatal */ }
}

// MIGRATION: Add featured and todaysDeal fields to existing products ────
export const migrateProducts = async (req, res) => {
  try {
    // Update all products that don't have 'featured' field
    const featuredResult = await Product.updateMany(
      { featured: { $exists: false } },
      { $set: { featured: false } }
    );
    
    // Update all products that don't have 'todaysDeal' field
    const todaysDealResult = await Product.updateMany(
      { todaysDeal: { $exists: false } },
      { $set: { todaysDeal: false } }
    );
    
    // Update all products that don't have 'published' field
    const publishedResult = await Product.updateMany(
      { published: { $exists: false } },
      { $set: { published: true } }
    );
    
    // Update all products that don't have 'salesCount' field
    const salesCountResult = await Product.updateMany(
      { salesCount: { $exists: false } },
      { $set: { salesCount: 0 } }
    );
    
    res.json({
      message: 'Migration completed successfully',
      results: {
        featured: featuredResult,
        todaysDeal: todaysDealResult,
        published: publishedResult,
        salesCount: salesCountResult
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// build product data object from request body

function buildProductData(body) {
  const tags = typeof body.Tags === 'string'
    ? body.Tags.split(',').map(t => t.trim()).filter(Boolean)
    : Array.isArray(body.Tags) ? body.Tags : [];

  // Variations: comma-separated strings → arrays
  const colors = typeof body['variation.colors'] === 'string'
    ? body['variation.colors'].split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(body['variation.colors']) ? body['variation.colors'] : [];

  const attributes = typeof body['variation.attributes'] === 'string'
    ? body['variation.attributes'].split(',').map(s => s.trim()).filter(Boolean)
    : Array.isArray(body['variation.attributes']) ? body['variation.attributes'] : [];

  const hasVariation = colors.length > 0 || attributes.length > 0;

  return {
    category:    body.category    || '',
    subCategory: body.subCategory || '',
    brand:       body.brand       || '',
    title:       body.title       || '',
    description: body.description || '',
    price:       num(body.price),
    image:       body.image       || '',
    image2:      body.image2      || '',
    image3:      body.image3      || '',
    unit:        body.unit        || '',
    weight:      num(body.weight),
    minQty:      num(body.minQty, 1),
    Tags:        tags,
    discount:          num(body.discount),
    discountType:      body.discountType || 'flat',
    discountDateRange: body.discountDateRange || '',
    stockCount:        num(body.stockCount),
    externalLink:    body.externalLink    || '',
    linkButtonText:  body.linkButtonText  || '',
    published:   bool(body.published, true),
    featured:    bool(body.featured),
    todaysDeal:  bool(body.todaysDeal),
    flashSaleId:           body.flashSaleId           || '',
    flashSaleDiscount:     num(body.flashSaleDiscount),
    flashSaleDiscountType: body.flashSaleDiscountType || 'flat',
    refundable:  bool(body.refundable, true),
    refundNote:  body.refundNote  || '',
    warranty:    bool(body.warranty),
    warrantyNote: body.warrantyNote || '',
    shippingType: body.shippingType || 'free',
    shippingCost: num(body.shippingCost),
    shippingDays: body.shippingDays || '',
    variation: hasVariation ? { colors, attributes } : null,
    seller:            body.seller            || '',
    Product_Condition: body.Product_Condition || 'New',
    Location:          body.Location          || '',
    badge:             body.badge             || null,
  };
}


// GET /api/products

export const getProducts = async (req, res) => {
  try {
    const {
      category, subCategory, brand,
      minPrice, maxPrice, sortBy,
      search, published, featured, todaysDeal, lowStock, refundable,
      page = 1, limit = 12,
    } = req.query;

    const filter = {};
    if (category)    filter.category    = category;
    if (subCategory) filter.subCategory = subCategory;
    if (brand)       filter.brand       = brand;
    if (published === 'true') filter.published = true;
    if (featured === 'true') filter.featured = true;
    if (todaysDeal === 'true') filter.todaysDeal = true;
    if (refundable === 'true') filter.refundable = true;
    if (lowStock === 'true') filter.stockCount = { $lt: 10 };
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const sortMap = {
      newest:       { createdAt: -1 },
      oldest:       { createdAt:  1 },
      'price-asc':  { price:  1 },
      'price-desc': { price: -1 },
    };
    const sort  = sortMap[sortBy] || { createdAt: -1 };
    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sort).skip(skip).limit(Number(limit));

    res.json({ products, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/products/filters 

export const getFilters = async (req, res) => {
  try {
    const categoryAgg = await Product.aggregate([
      { $group: { _id: { category: '$category', subCategory: '$subCategory' }, count: { $sum: 1 } } },
      { $sort: { '_id.category': 1, '_id.subCategory': 1 } },
    ]);

    const catMap = {};
    for (const row of categoryAgg) {
      const cat = row._id.category;
      const sub = row._id.subCategory;
      if (!catMap[cat]) catMap[cat] = { count: 0, children: {} };
      catMap[cat].children[sub] = (catMap[cat].children[sub] || 0) + row.count;
      catMap[cat].count += row.count;
    }

    const categoryTree = Object.entries(catMap).map(([name, data]) => ({
      name,
      count: data.count,
      children: Object.entries(data.children).map(([subName, count]) => ({ name: subName, count, children: [] })),
    }));

    const priceAgg  = await Product.aggregate([{ $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } }]);
    const priceRange = priceAgg[0] ? { min: priceAgg[0].min, max: priceAgg[0].max } : { min: 0, max: 10000 };

    const brandAgg = await Product.aggregate([
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const brands = brandAgg.map(b => ({ name: b._id, count: b.count }));

    res.json({ categoryTree, priceRange, brands });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/products/stats/category

export const getCategoryStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' }, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } },
      { $sort: { count: -1 } },
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/products/brands

export const getBrandsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const filter = category ? { category } : {};
    const brands = await Product.aggregate([
      { $match: filter },
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(brands.map(b => ({ name: b._id, count: b.count })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET /api/products/:id

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// POST /api/products

export const createProduct = async (req, res) => {
  try {
    const data = buildProductData(req.body);

    if (!data.category || !data.title || !data.price || !data.image) {
      return res.status(400).json({ message: 'Missing required fields: category, title, price, image' });
    }

    const product = await Product.create(data);

    // Sync home fields
    if (data.todaysDeal) await syncHomeField('todayDealProducts', String(product._id), true);
    if (data.featured)   await syncHomeField('allProducts',       String(product._id), true);

    // Sync flash sale
    if (data.flashSaleId) await addToFlashSaleDeal(data.flashSaleId, String(product._id));

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// PUT /api/products/:id

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const data = buildProductData(req.body);
    Object.assign(product, data);
    const updated = await product.save();

    const pid = String(updated._id);

    // Sync home fields
    await syncHomeField('todayDealProducts', pid, data.todaysDeal);
    await syncHomeField('allProducts',       pid, data.featured);

    // Sync flash sale
    if (data.flashSaleId) {
      await addToFlashSaleDeal(data.flashSaleId, pid);
    } else {
      await removeFromFlashSale(pid);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// PATCH /api/products/:id

export const patchProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const immutable = ['_id', '__v', 'createdAt', 'updatedAt'];
    const updatedFields = {};
    
    Object.keys(req.body).forEach(key => {
      if (!immutable.includes(key)) {
        // Handle boolean conversion for specific fields
        if (key === 'published' || key === 'featured' || key === 'todaysDeal') {
          product[key] = req.body[key] === true || req.body[key] === 'true' || req.body[key] === 1;
          updatedFields[key] = product[key];
        } else {
          product[key] = req.body[key];
          updatedFields[key] = req.body[key];
        }
      }
    });

    const updated = await product.save();
    
    // Sync home fields if featured or todaysDeal changed
    if (updatedFields.featured !== undefined) {
      await syncHomeField('allProducts', String(updated._id), updated.featured);
    }
    if (updatedFields.todaysDeal !== undefined) {
      await syncHomeField('todayDealProducts', String(updated._id), updated.todaysDeal);
    }
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE /api/products/:id

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const pid = String(product._id);
    await product.deleteOne();

    // Clean up
    await syncHomeField('todayDealProducts', pid, false);
    await syncHomeField('allProducts',       pid, false);
    await removeFromFlashSale(pid);

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};