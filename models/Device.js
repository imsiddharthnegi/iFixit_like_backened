const db = require('../database/db');

class Device {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT d.*, c.name as category_name, c.slug as category_slug 
        FROM devices d 
        JOIN categories c ON d.category_id = c.id 
        ORDER BY d.name
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static getBySlug(slug) {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT d.*, c.name as category_name, c.slug as category_slug 
        FROM devices d 
        JOIN categories c ON d.category_id = c.id 
        WHERE d.slug = ?
      `, [slug], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static create(name, slug, categoryId, imageUrl = null) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO devices (name, slug, category_id, image_url) VALUES (?, ?, ?, ?)',
        [name, slug, categoryId, imageUrl],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, name, slug, categoryId, imageUrl });
          }
        }
      );
    });
  }

  static getGuidesByDevice(deviceId) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM guides WHERE device_id = ? ORDER BY title',
        [deviceId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            // Parse JSON fields
            const guides = rows.map(guide => ({
              ...guide,
              tools_required: guide.tools_required ? JSON.parse(guide.tools_required) : [],
              parts_required: guide.parts_required ? JSON.parse(guide.parts_required) : [],
              steps: guide.steps ? JSON.parse(guide.steps) : []
            }));
            resolve(guides);
          }
        }
      );
    });
  }
}

module.exports = Device;

