// ... existing requires and app setup
const express = require('express');
const app = express();
const fetch = require('node-fetch'); // Ensure installed with `npm install node-fetch`

// Generalized Demo HTML route
app.get('/demo', async (req, res) => {
  // Supported endpoints
  const allowedEndpoints = ['devices', 'categories', 'guides'];
  const endpoint = req.query.endpoint || 'devices';
  if (!allowedEndpoints.includes(endpoint)) {
    return res.status(400).send('Invalid endpoint. Use ?endpoint=devices, categories, or guides');
  }

  // Build the API URL dynamically
  const apiUrl = `https://ifixit-like-backened.onrender.com/api/${endpoint}`;
  try {
    const apiRes = await fetch(apiUrl);
    const json = await apiRes.json();
    const items = json.data || [];
    if (!Array.isArray(items) || items.length === 0) {
      return res.send(`<h2>No data found for endpoint: ${endpoint}</h2>`);
    }

    // Get unique keys from all objects for the table header
    const headers = Array.from(
      items.reduce((set, item) => {
        Object.keys(item).forEach((k) => set.add(k));
        return set;
      }, new Set())
    );

    // Build HTML table
    let html = `
      <html>
      <head>
        <title>${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)} Catalog Demo</title>
        <style>
          body { font-family: sans-serif; background: #f4f4f4; padding: 2rem; }
          table { border-collapse: collapse; width: 100%; background: #fff; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #222; color: #fff; }
          img { max-width: 100px; }
          tr:nth-child(even) { background: #f9f9f9; }
          h1 { margin-bottom: 1rem; }
          .links { margin-bottom: 1rem; }
          .links a { margin-right: 1em; }
        </style>
      </head>
      <body>
        <h1>${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)} Catalog (Demo)</h1>
        <div class="links">
          <b>View:</b>
          <a href="/demo?endpoint=devices">Devices</a>
          <a href="/demo?endpoint=categories">Categories</a>
          <a href="/demo?endpoint=guides">Guides</a>
        </div>
        <table>
          <tr>
            ${headers.map(h => `<th>${h.replace(/_/g, ' ')}</th>`).join('')}
          </tr>
          ${items.map(item => `
            <tr>
              ${headers.map(h => {
                let val = item[h];
                if (typeof val === 'string' && val.match(/\.(jpg|jpeg|png|gif)$/)) {
                  return `<td><img src="${val}" alt="" /></td>`;
                }
                return `<td>${val !== undefined ? val : ''}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </table>
      </body>
      </html>
    `;
    res.send(html);
  } catch (err) {
    res.status(500).send('Error loading demo data');
  }
});

// ... existing app.listen
