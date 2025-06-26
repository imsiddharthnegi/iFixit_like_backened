const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide');

// GET /api/guides - Get all guides
router.get('/', async (req, res) => {
  try {
    const guides = await Guide.getAll();
    res.json({
      success: true,
      data: guides,
      count: guides.length
    });
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch guides'
    });
  }
});

// GET /api/guides/:slug - Get guide by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const guide = await Guide.getBySlug(slug);
    
    if (!guide) {
      return res.status(404).json({
        success: false,
        error: 'Guide not found'
      });
    }

    res.json({
      success: true,
      data: guide
    });
  } catch (error) {
    console.error('Error fetching guide:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch guide'
    });
  }
});

module.exports = router;

