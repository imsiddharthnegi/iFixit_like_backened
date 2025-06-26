const db = require('../database/db');

class Guide {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT g.*, d.name as device_name, d.slug as device_slug, 
               c.name as category_name, c.slug as category_slug
        FROM guides g 
        JOIN devices d ON g.device_id = d.id 
        JOIN categories c ON d.category_id = c.id 
        ORDER BY g.title
      `, (err, rows) => {
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
      });
    });
  }

  static getBySlug(slug) {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT g.*, d.name as device_name, d.slug as device_slug, 
               c.name as category_name, c.slug as category_slug
        FROM guides g 
        JOIN devices d ON g.device_id = d.id 
        JOIN categories c ON d.category_id = c.id 
        WHERE g.slug = ?
      `, [slug], (err, row) => {
        if (err) {
          reject(err);
        } else {
          if (row) {
            // Parse JSON fields
            row.tools_required = row.tools_required ? JSON.parse(row.tools_required) : [];
            row.parts_required = row.parts_required ? JSON.parse(row.parts_required) : [];
            row.steps = row.steps ? JSON.parse(row.steps) : [];
          }
          resolve(row);
        }
      });
    });
  }

  static create(title, slug, deviceId, difficulty, timeRequired, toolsRequired, partsRequired, steps) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO guides (title, slug, device_id, difficulty, time_required, tools_required, parts_required, steps) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title, 
          slug, 
          deviceId, 
          difficulty, 
          timeRequired, 
          JSON.stringify(toolsRequired), 
          JSON.stringify(partsRequired), 
          JSON.stringify(steps)
        ],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ 
              id: this.lastID, 
              title, 
              slug, 
              deviceId, 
              difficulty, 
              timeRequired, 
              toolsRequired, 
              partsRequired, 
              steps 
            });
          }
        }
      );
    });
  }
}

module.exports = Guide;

