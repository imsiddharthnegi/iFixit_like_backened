const db = require('../database/db');

class Category {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM categories ORDER BY name', (err, rows) => {
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
      db.get('SELECT * FROM categories WHERE slug = ?', [slug], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static create(name, slug) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO categories (name, slug) VALUES (?, ?)',
        [name, slug],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, name, slug });
          }
        }
      );
    });
  }

  static getDevicesByCategory(categoryId) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM devices WHERE category_id = ? ORDER BY name',
        [categoryId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
}

module.exports = Category;

