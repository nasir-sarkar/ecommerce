import Brand from '../models/Brand.js'

// Get all active brands
export const getBrands = async (req, res) => {
  try {
    const brandData = await Brand.findOne({ isActive: true })
    
    if (!brandData) {
      return res.status(404).json({ 
        success: false, 
        message: 'No brands found' 
      })
    }
    
    // Sort brands by order
    const sortedBrands = brandData.brands.sort((a, b) => a.order - b.order)
    
    res.status(200).json({
      success: true,
      data: {
        _id: brandData._id,
        isActive: brandData.isActive,
        pageTitle: brandData.pageTitle,
        breadcrumbLabel: brandData.breadcrumbLabel,
        placeholderImage: brandData.placeholderImage,
        brands: sortedBrands
      }
    })
  } catch (error) {
    console.error('Error fetching brands:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    })
  }
}


// Get all brand configurations
export const getAllBrandConfigs = async (req, res) => {
  try {
    const brandConfigs = await Brand.find().sort({ createdAt: -1 })
    res.status(200).json({
      success: true,
      data: brandConfigs
    })
  } catch (error) {
    console.error('Error fetching brand configs:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    })
  }
}


// Create new brand configuration
export const createBrandConfig = async (req, res) => {
  try {
    const brandData = req.body
    
    // Deactivate other brand configs if this one is active
    if (brandData.isActive) {
      await Brand.updateMany(
        { isActive: true },
        { $set: { isActive: false } }
      )
    }
    
    const brand = new Brand(brandData)
    await brand.save()
    
    res.status(201).json({
      success: true,
      message: 'Brand configuration created successfully',
      data: brand
    })
  } catch (error) {
    console.error('Error creating brand config:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    })
  }
}


// Update brand configuration
export const updateBrandConfig = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body
    
    // If setting this as active, deactivate others
    if (updateData.isActive) {
      await Brand.updateMany(
        { _id: { $ne: id }, isActive: true },
        { $set: { isActive: false } }
      )
    }
    
    const brand = await Brand.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
    
    if (!brand) {
      return res.status(404).json({ 
        success: false, 
        message: 'Brand configuration not found' 
      })
    }
    
    res.status(200).json({
      success: true,
      message: 'Brand configuration updated successfully',
      data: brand
    })
  } catch (error) {
    console.error('Error updating brand config:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    })
  }
}


// Delete brand configuration
export const deleteBrandConfig = async (req, res) => {
  try {
    const { id } = req.params
    const brand = await Brand.findByIdAndDelete(id)
    
    if (!brand) {
      return res.status(404).json({ 
        success: false, 
        message: 'Brand configuration not found' 
      })
    }
    
    res.status(200).json({
      success: true,
      message: 'Brand configuration deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting brand config:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    })
  }
}