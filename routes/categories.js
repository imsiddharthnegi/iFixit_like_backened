const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// GET /api/categories/:slug - Get category by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.getBySlug(slug);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category'
    });
  }
});

// GET /api/categories/:slug/devices - Get devices in a category
router.get('/:slug/devices', async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.getBySlug(slug);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    const devices = await Category.getDevicesByCategory(category.id);
    
    res.json({
      success: true,
      data: {
        category: category,
        devices: devices
      },
      count: devices.length
    });
  } catch (error) {
    console.error('Error fetching devices for category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch devices for category'
    });
  }
});

module.exports = router;

