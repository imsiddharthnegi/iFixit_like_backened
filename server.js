// ... existing requires and app setup
const express = require('express');
const app = express();

// Other routes...

// Demo HTML route to show devices
app.get('/demo', async (req, res) => {
  // You might want to fetch from your DB, but here's how to fetch from your own API
  // (You can also require your DB/model directly)
  const fetch = require('node-fetch'); // npm install node-fetch if not already
  const apiUrl = 'https://ifixit-like-backened.onrender.com/api/devices';
  try {
    const apiRes = await fetch(apiUrl);
    const json = await apiRes.json();
    const devices = json.data;

    let html = `
      <html>
      <head>
        <title>Device Catalog Demo</title>
        <style>
          body { font-family: sans-serif; background: #f4f4f4; padding: 2rem; }
          table { border-collapse: collapse; width: 100%; background: #fff; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #222; color: #fff; }
          img { max-width: 100px; }
          tr:nth-child(even) { background: #f9f9f9; }
          h1 { margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <h1>Device Catalog (Demo)</h1>
        <table>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Created</th>
          </tr>
          ${devices.map(device => `
            <tr>
              <td><img src="${device.image_url}" alt="${device.name}" /></td>
              <td>${device.name}</td>
              <td>${device.category_name}</td>
              <td>${device.created_at}</td>
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