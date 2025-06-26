const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./database/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'iFixit-like Backend API',
    version: '1.0.0',
    endpoints: {
      categories: '/api/categories',
      devices: '/api/devices',
      guides: '/api/guides'
    }
  });
});

// Categories endpoints
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    } else {
      res.json({ success: true, data: rows, count: rows.length });
    }
  });
});

app.get('/api/categories/:slug', (req, res) => {
  const { slug } = req.params;
  db.get('SELECT * FROM categories WHERE slug = ?', [slug], (err, row) => {
    if (err) {
      res.status(500).json({ success: false, error: 'Failed to fetch category' });
    } else if (!row) {
      res.status(404).json({ success: false, error: 'Category not found' });
    } else {
      res.json({ success: true, data: row });
    }
  });
});

app.get('/api/categories/:slug/devices', (req, res) => {
  const { slug } = req.params;
  db.get('SELECT * FROM categories WHERE slug = ?', [slug], (err, category) => {
    if (err) {
      res.status(500).json({ success: false, error: 'Failed to fetch category' });
    } else if (!category) {
      res.status(404).json({ success: false, error: 'Category not found' });
    } else {
      db.all('SELECT * FROM devices WHERE category_id = ? ORDER BY name', [category.id], (err, devices) => {
        if (err) {
          res.status(500).json({ success: false, error: 'Failed to fetch devices' });
        } else {
          res.json({ success: true, data: { category, devices }, count: devices.length });
        }
      });
    }
  });
});

// Devices endpoints
app.get('/api/devices', (req, res) => {
  db.all(`
    SELECT d.*, c.name as category_name, c.slug as category_slug 
    FROM devices d 
    JOIN categories c ON d.category_id = c.id 
    ORDER BY d.name
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, error: 'Failed to fetch devices' });
    } else {
      res.json({ success: true, data: rows, count: rows.length });
    }
  });
});

app.get('/api/devices/:slug', (req, res) => {
  const { slug } = req.params;
  db.get(`
    SELECT d.*, c.name as category_name, c.slug as category_slug 
    FROM devices d 
    JOIN categories c ON d.category_id = c.id 
    WHERE d.slug = ?
  `, [slug], (err, row) => {
    if (err) {
      res.status(500).json({ success: false, error: 'Failed to fetch device' });
    } else if (!row) {
      res.status(404).json({ success: false, error: 'Device not found' });
    } else {
      res.json({ success: true, data: row });
    }
  });
});

app.get('/api/devices/:slug/guides', (req, res) => {
  const { slug } = req.params;
  db.get(`
    SELECT d.*, c.name as category_name, c.slug as category_slug 
    FROM devices d 
    JOIN categories c ON d.category_id = c.id 
    WHERE d.slug = ?
  `, [slug], (err, device) => {
    if (err) {
      res.status(500).json({ success: false, error: 'Failed to fetch device' });
    } else if (!device) {
      res.status(404).json({ success: false, error: 'Device not found' });
    } else {
      db.all('SELECT * FROM guides WHERE device_id = ? ORDER BY title', [device.id], (err, guides) => {
        if (err) {
          res.status(500).json({ success: false, error: 'Failed to fetch guides' });
        } else {
          // Parse JSON fields
          const parsedGuides = guides.map(guide => ({
            ...guide,
            tools_required: guide.tools_required ? JSON.parse(guide.tools_required) : [],
            parts_required: guide.parts_required ? JSON.parse(guide.parts_required) : [],
            steps: guide.steps ? JSON.parse(guide.steps) : []
          }));
          res.json({ success: true, data: { device, guides: parsedGuides }, count: parsedGuides.length });
        }
      });
    }
  });
});

// Guides endpoints
app.get('/api/guides', (req, res) => {
  db.all(`
    SELECT g.*, d.name as device_name, d.slug as device_slug, 
           c.name as category_name, c.slug as category_slug
    FROM guides g 
    JOIN devices d ON g.device_id = d.id 
    JOIN categories c ON d.category_id = c.id 
    ORDER BY g.title
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, error: 'Failed to fetch guides' });
    } else {
      // Parse JSON fields
      const guides = rows.map(guide => ({
        ...guide,
        tools_required: guide.tools_required ? JSON.parse(guide.tools_required) : [],
        parts_required: guide.parts_required ? JSON.parse(guide.parts_required) : [],
        steps: guide.steps ? JSON.parse(guide.steps) : []
      }));
      res.json({ success: true, data: guides, count: guides.length });
    }
  });
});

app.get('/api/guides/:slug', (req, res) => {
  const { slug } = req.params;
  db.get(`
    SELECT g.*, d.name as device_name, d.slug as device_slug, 
           c.name as category_name, c.slug as category_slug
    FROM guides g 
    JOIN devices d ON g.device_id = d.id 
    JOIN categories c ON d.category_id = c.id 
    WHERE g.slug = ?
  `, [slug], (err, row) => {
    if (err) {
      res.status(500).json({ success: false, error: 'Failed to fetch guide' });
    } else if (!row) {
      res.status(404).json({ success: false, error: 'Guide not found' });
    } else {
      // Parse JSON fields
      row.tools_required = row.tools_required ? JSON.parse(row.tools_required) : [];
      row.parts_required = row.parts_required ? JSON.parse(row.parts_required) : [];
      row.steps = row.steps ? JSON.parse(row.steps) : [];
      res.json({ success: true, data: row });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see the API`);
});

module.exports = app;

