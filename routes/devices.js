const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

// GET /api/devices - Get all devices
router.get('/', async (req, res) => {
  try {
    const devices = await Device.getAll();
    res.json({
      success: true,
      data: devices,
      count: devices.length
    });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch devices'
    });
  }
});

// GET /api/devices/:slug - Get device by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const device = await Device.getBySlug(slug);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    res.json({
      success: true,
      data: device
    });
  } catch (error) {
    console.error('Error fetching device:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch device'
    });
  }
});

// GET /api/devices/:slug/guides - Get guides for a device
router.get('/:slug/guides', async (req, res) => {
  try {
    const { slug } = req.params;
    const device = await Device.getBySlug(slug);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        error: 'Device not found'
      });
    }

    const guides = await Device.getGuidesByDevice(device.id);
    
    res.json({
      success: true,
      data: {
        device: device,
        guides: guides
      },
      count: guides.length
    });
  } catch (error) {
    console.error('Error fetching guides for device:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch guides for device'
    });
  }
});

module.exports = router;

