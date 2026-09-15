import CategoryDiscount from '../models/CategoryDiscount.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// GET /api/category-discounts
export const getCategoryDiscounts = async (req, res) => {
  try {
    const discounts = await CategoryDiscount.find().sort({ createdAt: -1 });
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/category-discounts/categories-with-stats
export const getCategoriesWithStats = async (req, res) => {
  try {
    // Get all categories
    const categories = await Category.find().sort({ order: 1 });
    
    // Get all products to calculate counts
    const products = await Product.find();
    
    // Get existing discounts
    const discounts = await CategoryDiscount.find();
    
    // Create a map of discounts by categoryId
    const discountMap = {};
    discounts.forEach(d => {
      discountMap[d.categoryId] = d;
    });
    
    // Calculate stats for each category
    const categoriesWithStats = categories.map(cat => {
      // Count products in this category
      const categoryProducts = products.filter(p => p.category === cat.name);
      const inhouseProducts = categoryProducts.filter(p => !p.seller || p.seller === '').length;
      const sellerProducts = categoryProducts.filter(p => p.seller && p.seller !== '').length;
      
      // Get existing discount
      const existingDiscount = discountMap[cat._id.toString()];
      
      // Check if discount is still valid (not expired)
      let isValid = false;
      if (existingDiscount && existingDiscount.active) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (existingDiscount.endDate >= today) {
          isValid = true;
        } else {
          // Discount expired, deactivate it
          existingDiscount.active = false;
          existingDiscount.save();
        }
      }
      
      return {
        _id: cat._id,
        name: cat.name,
        img: cat.img || '',
        icon: cat.icon || '',
        parent: '—',
        inhouseProducts,
        sellerProducts,
        presentDiscount: existingDiscount && isValid ? existingDiscount.discount : 0,
        endDate: existingDiscount && isValid ? existingDiscount.endDate : null,
        discountActive: existingDiscount && isValid ? existingDiscount.active : false,
        discountId: existingDiscount ? existingDiscount._id : null,
        isDigital: false
      };
    });
    
    res.json(categoriesWithStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Helper function to format date
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper: Apply discount to all products in a category
async function applyDiscountToCategory(categoryId, discount, startDate, endDate) {
  try {
    // First, get the category name from the ID
    const category = await Category.findById(categoryId);
    if (!category) {
      console.error('Category not found:', categoryId);
      return;
    }
    
    // Format date range for the discountDateRange field
    const dateRangeStr = `${formatDate(startDate)} to ${formatDate(endDate)}`;
    
    // Update all products in this category with the discount
    const updateData = {
      discount: discount,
      discountType: 'percent',
      discountDateRange: dateRangeStr
    };
    
    const result = await Product.updateMany(
      { category: category.name },
      { $set: updateData }
    );
    
    console.log(`Applied ${discount}% discount to ${result.modifiedCount} products in category: ${category.name}`);
    console.log(`Date range: ${dateRangeStr}`);
    
    return result;
  } catch (err) {
    console.error('Error applying category discount:', err);
    throw err;
  }
}

// Helper: Remove discount from all products in a category
async function removeDiscountFromCategory(categoryId) {
  try {
    const category = await Category.findById(categoryId);
    if (!category) return;
    
    // Remove discount from all products in this category
    const updateData = {
      discount: 0,
      discountDateRange: ''
    };
    
    const result = await Product.updateMany(
      { category: category.name },
      { $set: updateData }
    );
    
    console.log(`Removed discount from ${result.modifiedCount} products in category: ${category.name}`);
    return result;
  } catch (err) {
    console.error('Error removing category discount:', err);
    throw err;
  }
}

// POST /api/category-discounts
export const createCategoryDiscount = async (req, res) => {
  try {
    const { categoryId, categoryName, discount, endDate } = req.body;
    
    if (!categoryId || !categoryName) {
      return res.status(400).json({ message: 'Category ID and name are required' });
    }
    
    if (!endDate) {
      return res.status(400).json({ message: 'End date is required' });
    }
    
    if (discount < 0 || discount > 100) {
      return res.status(400).json({ message: 'Discount must be between 0 and 100' });
    }
    
    // Parse end date
    const parsedEndDate = new Date(endDate);
    if (isNaN(parsedEndDate)) {
      return res.status(400).json({ message: 'Invalid end date format' });
    }
    
    // Get today's date (start date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Validate end date is not in the past
    if (parsedEndDate < today) {
      return res.status(400).json({ message: 'End date cannot be in the past' });
    }
    
    // Check if discount already exists for this category
    let categoryDiscount = await CategoryDiscount.findOne({ categoryId });
    
    if (categoryDiscount) {
      // Update existing
      categoryDiscount.discount = discount;
      categoryDiscount.endDate = parsedEndDate;
      categoryDiscount.active = true;
      categoryDiscount.updatedAt = new Date();
      await categoryDiscount.save();
    } else {
      // Create new
      categoryDiscount = new CategoryDiscount({
        categoryId,
        categoryName,
        discount,
        endDate: parsedEndDate,
        active: true
      });
      await categoryDiscount.save();
    }
    
    // Apply discount to all products in this category
    const result = await applyDiscountToCategory(categoryId, discount, today, parsedEndDate);
    
    // Get the category object to return the updated info
    const category = await Category.findById(categoryId);
    
    res.json({ 
      success: true, 
      discount: categoryDiscount,
      dateRange: `${formatDate(today)} to ${formatDate(parsedEndDate)}`,
      productsUpdated: result ? result.modifiedCount : 0,
      category: category ? category.name : categoryName
    });
  } catch (err) {
    console.error('Error in createCategoryDiscount:', err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/category-discounts/:id
export const removeCategoryDiscount = async (req, res) => {
  try {
    const discount = await CategoryDiscount.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }
    
    // Remove discount from all products in this category
    await removeDiscountFromCategory(discount.categoryId);
    
    await discount.deleteOne();
    res.json({ success: true, message: 'Discount removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/category-discounts/:id/toggle
export const toggleCategoryDiscount = async (req, res) => {
  try {
    const { active } = req.body;
    const discount = await CategoryDiscount.findById(req.params.id);
    
    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }
    
    discount.active = active;
    discount.updatedAt = new Date();
    await discount.save();
    
    // Apply or remove discount based on active status
    if (active) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await applyDiscountToCategory(discount.categoryId, discount.discount, today, discount.endDate);
    } else {
      await removeDiscountFromCategory(discount.categoryId);
    }
    
    res.json({ success: true, discount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/category-discounts/check-expired
export const checkExpiredDiscounts = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find active discounts that have expired
    const expiredDiscounts = await CategoryDiscount.find({
      active: true,
      endDate: { $lt: today }
    });
    
    // Deactivate expired discounts and remove from products
    for (const discount of expiredDiscounts) {
      discount.active = false;
      await discount.save();
      await removeDiscountFromCategory(discount.categoryId);
    }
    
    res.json({ 
      success: true, 
      expiredCount: expiredDiscounts.length,
      message: `${expiredDiscounts.length} expired discounts deactivated`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};