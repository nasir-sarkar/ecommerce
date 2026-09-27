import Order         from '../models/Order.js';
import Product       from '../models/Product.js';
import ProductReview from '../models/ProductReview.js';


// POST /api/orders
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, shippingAddress, paymentMethod, additionalInfo, deliveryType } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ success: false, message: 'No items in order' });

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      if (product.stockCount < item.qty)
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.title}". Available: ${product.stockCount}`,
        });
    }

    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stockCount: -item.qty } });
    }

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    const order = await Order.create({
      userId,
      items,
      totalAmount,
      status: 'pending',
      paymentStatus: 'unpaid',
      shippingAddress: shippingAddress || {},
      paymentMethod:   paymentMethod   || 'cash_on_delivery',
      additionalInfo:  additionalInfo  || '',
      deliveryType:    deliveryType    || 'home_delivery',
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    console.error('placeOrder error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/orders/my-orders  (user)
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    // Get all reviews by this user to compute reviewed flags
    const reviews = await ProductReview.find({ userId });
    // Map: `${orderId}__${productId}` => true
    const reviewedSet = new Set(reviews.map(r => `${r.orderId}__${r.productId}`));

    const enriched = orders.map(order => {
      const obj = order.toObject();
      obj.items = obj.items.map(item => ({
        ...item,
        reviewed: reviewedSet.has(`${order._id}__${item.productId}`),
      }));
      return obj;
    });

    const pending   = orders.filter(o => o.status === 'pending').length;
    const confirmed = orders.filter(o => o.status === 'confirmed').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;

    res.json({
      success: true,
      data: {
        orders: enriched,
        counts: { total: orders.length, pending, confirmed, delivered },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/orders/my-orders/:id  (user — single order detail)
export const getUserOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const order  = await Order.findOne({ _id: req.params.id, userId })
      .populate('userId', 'fullName email phone');
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });

    // Enrich items with reviewed flag
    const reviews = await ProductReview.find({ orderId: order._id, userId });
    const reviewedProductIds = new Set(reviews.map(r => r.productId.toString()));

    const obj = order.toObject();
    obj.items = obj.items.map(item => ({
      ...item,
      reviewed: reviewedProductIds.has(item.productId.toString()),
    }));

    res.json({ success: true, data: obj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// POST /api/orders/:id/cancel  (user)
export const cancelUserOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const order  = await Order.findOne({ _id: req.params.id, userId });
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.status !== 'pending')
      return res.status(400).json({ success: false, message: 'Only pending orders can be cancelled' });

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stockCount: item.qty } });
    }

    await Order.findByIdAndDelete(order._id);
    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// POST /api/orders/:id/reorder  (user)
export const reorderItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const original = await Order.findOne({ _id: req.params.id, userId });
    if (!original)
      return res.status(404).json({ success: false, message: 'Order not found' });

    // Validate stock for all items
    for (const item of original.items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      if (product.stockCount < item.qty)
        return res.status(400).json({ success: false, message: `Insufficient stock for "${item.name}"` });
    }

    // Deduct stock
    for (const item of original.items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stockCount: -item.qty } });
    }

    const totalAmount = original.items.reduce((sum, i) => sum + i.price * i.qty, 0);

    const newOrder = await Order.create({
      userId,
      items:           original.items,
      totalAmount,
      status:          'pending',
      paymentStatus:   'unpaid',
      shippingAddress: original.shippingAddress,
      paymentMethod:   original.paymentMethod,
      additionalInfo:  original.additionalInfo,
      deliveryType:    original.deliveryType,
    });

    res.status(201).json({ success: true, data: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/orders/seller  (seller)
export const getSellerOrders = async (req, res) => {
  try {
    const sellerName = req.user.shopName || req.user.fullName || req.user.email;
    const orders = await Order.find({ 'items.seller': sellerName }).sort({ createdAt: -1 });
    const filtered = orders.map(o => {
      const sellerItems = o.items.filter(i => i.seller === sellerName);
      const sellerTotal = sellerItems.reduce((sum, i) => sum + i.price * i.qty, 0);
      return {
        ...o.toObject(),
        items: sellerItems,
        totalAmount: sellerTotal,
        paymentStatus: o.paymentStatus || 'unpaid',
      };
    });
    res.json({ success: true, data: filtered });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// PATCH /api/orders/:id/status  (seller)
export const updateOrderStatus = async (req, res) => {
  try {
    const sellerName = req.user.shopName || req.user.fullName || req.user.email;
    const { status }  = req.body;

    const allowed = ['confirmed', 'delivered'];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });

    const hasSellersItem = order.items.some(i => i.seller === sellerName);
    if (!hasSellersItem)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    const flow = ['pending', 'confirmed', 'delivered'];
    const currentIdx = flow.indexOf(order.status);
    const newIdx     = flow.indexOf(status);
    if (newIdx !== currentIdx + 1)
      return res.status(400).json({ success: false, message: `Cannot move from "${order.status}" to "${status}"` });

    order.status = status;
    await order.save();
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/orders/admin/all  (admin)
export const adminGetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'fullName email');

    const enriched = await Promise.all(orders.map(async (order) => {
      const obj = order.toObject();
      const itemsWithRefund = await Promise.all(obj.items.map(async (item) => {
        const product = await Product.findById(item.productId).select('refundable').lean();
        return { ...item, refundable: product ? product.refundable : false };
      }));
      const refundable = itemsWithRefund.some(i => i.refundable);
      return { ...obj, items: itemsWithRefund, refundable, paymentStatus: obj.paymentStatus || 'unpaid' };
    }));

    res.json({ success: true, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/orders/admin/:id  (admin — single order)
export const adminGetOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'fullName email phone');
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });

    const obj = order.toObject();
    const itemsEnriched = await Promise.all(obj.items.map(async (item) => {
      const product = await Product.findById(item.productId).select('refundable seller').lean();
      return {
        ...item,
        refundable: product ? product.refundable : false,
        sellerName: product ? (product.seller || '') : '',
      };
    }));

    res.json({ success: true, data: { ...obj, items: itemsEnriched } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// PATCH /api/orders/admin/:id/status  (admin — update delivery status)
export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'delivered'];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// PATCH /api/orders/admin/:id/payment  (admin — update payment status)
export const adminUpdatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const allowed = ['unpaid', 'paid'];
    if (!allowed.includes(paymentStatus))
      return res.status(400).json({ success: false, message: 'Invalid payment status' });

    const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus }, { new: true });
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};