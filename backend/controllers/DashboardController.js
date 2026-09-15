import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import User from '../models/User.js';
import Seller from '../models/Seller.js';
import Review from '../models/Review.js';
import mongoose from 'mongoose';


const getDateRange = (filter) => {
  const now = new Date();
  switch (filter) {
    case 'today': {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return { $gte: start };
    }
    case 'week': {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      return { $gte: start };
    }
    case 'month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { $gte: start };
    }
    default:
      return null; // no date filter
  }
};

export const getDashboardStats = async (req, res) => {
  try {

    // SELLERS
    const totalSellers    = await Seller.countDocuments();
    const approvedSellers = await Seller.countDocuments({ isVerified: true });

    // Top 3 sellers by revenue
    const topSellersByRevAgg = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$items' },
      { $match: { 'items.seller': { $ne: '' } } },
      { $group: { _id: '$items.seller', totalSales: { $sum: { $multiply: ['$items.price', '$items.qty'] } } } },
      { $sort: { totalSales: -1 } },
      { $limit: 3 },
    ]);
    const topSellerShopNames = topSellersByRevAgg.map(s => s._id);
    const topSellersForCardDocs = await Seller.find({ shopName: { $in: topSellerShopNames } })
      .select('shopName fullName');
    // Preserve revenue-based order
    const topSellersForCard = topSellerShopNames
      .map(name => topSellersForCardDocs.find(s => s.shopName === name))
      .filter(Boolean);

    
    // CUSTOMERS
    const totalCustomers = await User.countDocuments();

    // Top 5 customers by total spend (delivered orders only)
    const topCustomersAgg = await Order.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: '$userId',
          totalSpent: { $sum: '$totalAmount' },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    ]);
    const topCustomers = topCustomersAgg.map((c) => c.user?.avatar || '');

    
    // PRODUCTS
    const totalProducts    = await Product.countDocuments();
    const inhouseProducts  = await Product.countDocuments({ seller: '' });
    const sellerProducts   = await Product.countDocuments({ seller: { $ne: '', $exists: true } });

    
    // SALES  (delivered orders only)
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total sales & sales this month — use the stored totalAmount on each order
    const salesAgg = await Order.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          salesThisMonth: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', thisMonthStart] }, '$totalAmount', 0],
            },
          },
        },
      },
    ]);
    const totalSales    = salesAgg[0]?.totalSales    ?? 0;
    const salesThisMonth = salesAgg[0]?.salesThisMonth ?? 0;

    // In-house vs seller sales — must unwind items and check seller field per item
    const splitSalesAgg = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: null,
          inHouseSales: {
            $sum: {
              $cond: [
                { $eq: ['$items.seller', ''] },
                { $multiply: ['$items.price', '$items.qty'] },
                0,
              ],
            },
          },
          sellerSales: {
            $sum: {
              $cond: [
                { $ne: ['$items.seller', ''] },
                { $multiply: ['$items.price', '$items.qty'] },
                0,
              ],
            },
          },
        },
      },
    ]);
    const inHouseSales = splitSalesAgg[0]?.inHouseSales ?? 0;
    const sellerSales  = splitSalesAgg[0]?.sellerSales  ?? 0;

  
    // CATEGORIES
    const totalCategories = await Category.countDocuments();

    const topCategoriesAgg = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.category',
          totalSales: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: 'name',
          as: 'catInfo',
        },
      },
      { $unwind: { path: '$catInfo', preserveNullAndEmptyArrays: true } },
    ]);
    const topCategories = topCategoriesAgg.map((c) => ({
      name:  c._id       ?? '',
      sales: c.totalSales ?? 0,
      img:   c.catInfo?.img ?? '',
    }));

    

    // BRANDS
    const brandDoc    = await Brand.findOne();
    const totalBrands = brandDoc?.brands?.length ?? 0;

    const topBrandsAgg = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.brand',
          totalSales: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 3 },
    ]);
    const topBrands = topBrandsAgg.map((b) => ({
      name:  b._id        ?? '',
      sales: b.totalSales ?? 0,
    }));

    
    // IN-HOUSE TOP CATEGORIES
    const getInHouseTopCategories = async (filter) => {
      const dateRange = getDateRange(filter);
      const pipeline = [
        { $match: { status: 'delivered' } },
        { $unwind: '$items' },
        // filter inhouse items
        { $match: { 'items.seller': '' } },
      ];
      if (dateRange) {
        pipeline.push({ $match: { createdAt: dateRange } });
      }
      pipeline.push(
        {
          $group: {
            _id: '$items.category',
            totalSales: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
          },
        },
        { $sort: { totalSales: -1 } },
        { $limit: 3 },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: 'name',
            as: 'catInfo',
          },
        },
        { $unwind: { path: '$catInfo', preserveNullAndEmptyArrays: true } }
      );
      const agg = await Order.aggregate(pipeline);
      return agg.map((c) => ({
        name:  c._id        ?? '',
        sales: c.totalSales ?? 0,
        img:   c.catInfo?.img ?? '',
      }));
    };

    const [
      inHouseTopCategoriesAll,
      inHouseTopCategoriesToday,
      inHouseTopCategoriesWeek,
      inHouseTopCategoriesMonth,
    ] = await Promise.all([
      getInHouseTopCategories('all'),
      getInHouseTopCategories('today'),
      getInHouseTopCategories('week'),
      getInHouseTopCategories('month'),
    ]);

    

    // IN-HOUSE TOP BRANDS  (items with seller === "")
    const getInHouseTopBrands = async (filter) => {
      const dateRange = getDateRange(filter);
      const pipeline = [
        { $match: { status: 'delivered' } },
        { $unwind: '$items' },
        { $match: { 'items.seller': '' } },
      ];
      if (dateRange) {
        pipeline.push({ $match: { createdAt: dateRange } });
      }
      pipeline.push(
        {
          $group: {
            _id: '$items.brand',
            totalSales: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
          },
        },
        { $sort: { totalSales: -1 } },
        { $limit: 3 }
      );
      const agg = await Order.aggregate(pipeline);
      return agg.map((b) => ({
        name:  b._id        ?? '',
        sales: b.totalSales ?? 0,
      }));
    };

    const [
      inHouseTopBrandsAll,
      inHouseTopBrandsToday,
      inHouseTopBrandsWeek,
      inHouseTopBrandsMonth,
    ] = await Promise.all([
      getInHouseTopBrands('all'),
      getInHouseTopBrands('today'),
      getInHouseTopBrands('week'),
      getInHouseTopBrands('month'),
    ]);

    
    // ORDERS
    const [totalOrders, pendingOrders, confirmedOrders, deliveredOrdersCount] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: 'pending' }),
        Order.countDocuments({ status: 'confirmed' }),
        Order.countDocuments({ status: 'delivered' }),
      ]);

    
    // TOP SELLERS  (seller != "")
    const topSellersAgg = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$items' },
      { $match: { 'items.seller': { $ne: '' } } },
      {
        $group: {
          _id: '$items.seller',
          totalSales: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 3 },
    ]);
    const topSellers = topSellersAgg.map((s) => ({
      name:  s._id        ?? '',
      sales: s.totalSales ?? 0,
    }));

    
    // TOP PRODUCTS
    const topProductsAgg = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$items' },
      {
        $group: {
          _id:        '$items.productId',
          name:       { $first: '$items.name' },
          image:      { $first: '$items.image' },
          totalQty:   { $sum: '$items.qty' },
          totalPrice: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
        },
      },
      { $sort: { totalPrice: -1 } },
      { $limit: 3 },
    ]);
    const topProducts = topProductsAgg.map((p) => ({
      name:  p.name  ?? '',
      qty:   `X ${p.totalQty}`,
      price: `$${(p.totalPrice ?? 0).toFixed(2)}`,
      image: p.image ?? '',
    }));

    
    // IN-HOUSE STORE STATS
    const inhouseOrderCount = await Order.countDocuments({
      items: { $elemMatch: { seller: '' } },
    });

    const inhousePaymentAgg = await Order.aggregate([
      { $match: { items: { $elemMatch: { seller: '' } } } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 } } },
    ]);
    const totalInhouseOrders = inhouseOrderCount || 1;
    const cashOnDeliveryCount = inhousePaymentAgg.find(p => p._id === 'cash_on_delivery')?.count || 0;
    const cashOnDeliveryPercent = cashOnDeliveryCount / totalInhouseOrders;

    const inhouseStoreStats = {
      totalSales:           inHouseSales,
      totalProducts:        inhouseProducts,
      ratings:              5.0,
      totalOrders:          inhouseOrderCount,
      cashOnDeliveryPercent,
    };

   
    // RESPONSE
    res.json({
      success: true,
      data: {
        customers: { total: totalCustomers, topAvatars: topCustomers },
        products:  { total: totalProducts, inhouse: inhouseProducts, sellers: sellerProducts },
        sales:     { total: totalSales, thisMonth: salesThisMonth, inHouse: inHouseSales, sellers: sellerSales },
        categories: { total: totalCategories, top: topCategories },
        brands:     { total: totalBrands, top: topBrands },
        orders:     { total: totalOrders, pending: pendingOrders, confirmed: confirmedOrders, delivered: deliveredOrdersCount },
        sellers: {
          total:    totalSellers,
          approved: approvedSellers,
          topList:  topSellersForCard.map(s => ({ name: s.shopName || s.fullName })),
        },
        inHouseTopCategory: {
          all:   inHouseTopCategoriesAll,
          today: inHouseTopCategoriesToday,
          week:  inHouseTopCategoriesWeek,
          month: inHouseTopCategoriesMonth,
        },
        inHouseTopBrands: {
          all:   inHouseTopBrandsAll,
          today: inHouseTopBrandsToday,
          week:  inHouseTopBrandsWeek,
          month: inHouseTopBrandsMonth,
        },
        topSellers,
        topProducts,
        inhouseStoreStats,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// SELLER DASHBOARD STATS 
export const getSellerDashboardStats = async (req, res) => {
  try {
    const { id } = req.user; // seller id from JWT

    // Fetch seller document
    const seller = await Seller.findById(id).select('-password');
    if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });

    const shopName = seller.shopName;
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Total products for this seller 
    const totalProducts = await Product.countDocuments({ seller: shopName });

    // Followers 
    const followers       = seller.followers?.length || 0;
    const customFollowers = seller.customFollowers || 0;

    // Rating (avg from Review collection)
    const ratingAgg = await Review.aggregate([
      { $match: { sellerName: shopName } },
      { $group: { _id: null, avg: { $avg: '$rating' }, total: { $sum: 1 } } },
    ]);
    const avgRating   = ratingAgg[0] ? Math.round((ratingAgg[0].avg || 0) * 10) / 10 : 0;
    const totalReviews = ratingAgg[0]?.total || 0;

    // Orders
    const sellerOrderMatch = { items: { $elemMatch: { seller: shopName } } };

    const [totalOrders, newOrders, cancelledOrders, onDeliveryOrders, deliveredOrders] =
      await Promise.all([
        Order.countDocuments(sellerOrderMatch),
        Order.countDocuments({ ...sellerOrderMatch, status: 'pending' }),
        Order.countDocuments({ ...sellerOrderMatch, status: 'cancelled' }),
        Order.countDocuments({ ...sellerOrderMatch, status: { $in: ['confirmed', 'processing', 'shipped'] } }),
        Order.countDocuments({ ...sellerOrderMatch, status: 'delivered' }),
      ]);

    // Sales 
    // Only count items belonging to this seller in delivered orders
    const salesAgg = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$items' },
      { $match: { 'items.seller': shopName } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
          salesThisMonth: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', thisMonthStart] }, { $multiply: ['$items.price', '$items.qty'] }, 0],
            },
          },
          salesLastMonth: {
            $sum: {
              $cond: [
                { $and: [{ $gte: ['$createdAt', lastMonthStart] }, { $lte: ['$createdAt', lastMonthEnd] }] },
                { $multiply: ['$items.price', '$items.qty'] },
                0,
              ],
            },
          },
        },
      },
    ]);
    const totalSales      = salesAgg[0]?.totalSales      ?? 0;
    const salesThisMonth  = salesAgg[0]?.salesThisMonth  ?? 0;
    const salesLastMonth  = salesAgg[0]?.salesLastMonth  ?? 0;

    // Sold amount = thisMonth sales
    const soldAmountThisMonth = salesThisMonth;
    const soldAmountLastMonth = salesLastMonth;

    // Category-wise product count 
    const categoryCountAgg = await Product.aggregate([
      { $match: { seller: shopName } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    const categoryWiseCount = categoryCountAgg.map(c => ({
      name:  c._id   ?? 'Uncategorized',
      count: c.count ?? 0,
    }));

    // Top 12 products
    const topProductsAgg = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'delivered'] } } },
      { $unwind: '$items' },
      { $match: { 'items.seller': shopName } },
      {
        $group: {
          _id:        '$items.productId',
          name:       { $first: '$items.name' },
          image:      { $first: '$items.image' },
          price:      { $first: '$items.price' },
          totalQty:   { $sum: '$items.qty' },
          totalRev:   { $sum: { $multiply: ['$items.price', '$items.qty'] } },
        },
      },
      { $sort: { totalRev: -1 } },
      { $limit: 12 },
    ]);

    // Enrich with product ratings from Product collection
    const productIds = topProductsAgg.map(p => p._id).filter(Boolean);
    let productRatingMap = {};
    if (productIds.length > 0) {
      const products = await Product.find({ _id: { $in: productIds } }).select('_id rating oldPrice');
      products.forEach(p => { productRatingMap[p._id.toString()] = p; });
    }

    const topProducts = topProductsAgg.map(p => {
      const prod = productRatingMap[p._id?.toString()] || {};
      return {
        name:     p.name  ?? '',
        image:    p.image ?? '',
        price:    `$${(p.price ?? 0).toFixed(2)}`,
        oldPrice: prod.oldPrice ? `$${prod.oldPrice.toFixed(2)}` : null,
        rating:   prod.rating ?? 0,
      };
    });

    // Package info
    const packageInfo = {
      name:                seller.package?.name          || 'Platinum',
      productUploadLimit:  seller.package?.productLimit  || 500,
      preorderUploadLimit: seller.package?.preorderLimit || 0,
      expiresAt:           seller.package?.expiresAt     || null,
      badge:               seller.package?.badge         || '',
    };

    // Verified
    const isVerified = seller.isVerified || false;

    res.json({
      success: true,
      data: {
        shopName,
        totalProducts,
        followers,
        customFollowers,
        avgRating,
        totalReviews,
        totalOrders,
        totalSales,
        salesThisMonth,
        salesLastMonth,
        soldAmountThisMonth,
        soldAmountLastMonth,
        orders: {
          new:        newOrders,
          cancelled:  cancelledOrders,
          onDelivery: onDeliveryOrders,
          delivered:  deliveredOrders,
        },
        categoryWiseCount,
        topProducts,
        packageInfo,
        isVerified,
      },
    });
  } catch (error) {
    console.error('Seller dashboard stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};