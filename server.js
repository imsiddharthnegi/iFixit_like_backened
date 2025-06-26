const express = require('express');
const app = express();
const fetch = require('node-fetch'); // Ensure installed: npm install node-fetch

app.get('/demo', async (req, res) => {
  const allowedEndpoints = ['devices', 'categories', 'guides'];
  const endpoint = req.query.endpoint || 'devices';
  if (!allowedEndpoints.includes(endpoint)) {
    return res.status(400).send(`
      <h2>Invalid endpoint.</h2>
      <p>Please use one of: <a href="/demo?endpoint=devices">devices</a>, <a href="/demo?endpoint=categories">categories</a>, <a href="/demo?endpoint=guides">guides</a>.</p>
    `);
  }

  const apiUrl = `https://ifixit-like-backened.onrender.com/api/${endpoint}`;
  try {
    const apiRes = await fetch(apiUrl);
    const json = await apiRes.json();
    const items = json.data || [];
    if (!Array.isArray(items) || items.length === 0) {
      return res.send(`
        <html>
        <head>
          <title>No Data Found</title>
          <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Roboto', Arial, sans-serif; background: #f4f7fa; color: #222; text-align: center; padding: 3em; }
            .links { margin-bottom: 2em; }
            a { color: #1976d2; text-decoration: none; margin: 0 1em; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>No data found for endpoint: ${endpoint}</h1>
          <div class="links">
            <a href="/demo?endpoint=devices">View Devices</a>
            <a href="/demo?endpoint=categories">View Categories</a>
            <a href="/demo?endpoint=guides">View Guides</a>
          </div>
        </body>
        </html>
      `);
    }

    // Collect all column keys
    const headers = Array.from(
      items.reduce((set, item) => {
        Object.keys(item).forEach((k) => set.add(k));
        return set;
      }, new Set())
    );

    // Capitalize and beautify header names
    const beautify = (str) =>
      str
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    // Build HTML table rows
    const rows = items.map((item) =>
      `<tr>
        ${headers
          .map((h) => {
            let val = item[h];
            // Render image thumbnails for image URLs
            if (
              typeof val === 'string' &&
              val.match(/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i)
            ) {
              return `<td><img src="${val}" alt="img" class="thumb"></td>`;
            }
            return `<td>${val !== undefined && val !== null ? val : ''}</td>`;
          })
          .join('')}
      </tr>`
    );

    res.send(`
      <html>
      <head>
        <title>${beautify(endpoint)} Catalog Demo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Roboto', Arial, sans-serif; background: #f4f7fa; color: #222; margin: 0; padding: 0; }
          .container { max-width: 1100px; margin: 3em auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); padding: 2em; }
          h1 { font-size: 2.2em; margin-bottom: 0.4em; letter-spacing: -1px; }
          .links { margin-bottom: 1.5em; }
          .links a { color: #1976d2; font-weight: 500; margin-right: 1em; text-decoration: none; }
          .links a.selected { text-decoration: underline; font-weight: 700; }
          table { width: 100%; border-collapse: collapse; margin-top: 1em;}
          th, td { border: 1px solid #e0e0e0; padding: 10px 8px; text-align: left; }
          th { background: #1976d2; color: #fff; font-weight: 700; }
          tr:nth-child(even) { background: #f9fbfd; }
          tr:hover { background: #f1f7ff; }
          img.thumb { max-width: 90px; max-height: 90px; border-radius: 8px; border: 1px solid #ccc; }
          @media (max-width: 700px) {
            .container { padding: 0.5em; }
            table, thead, tbody, th, td, tr { display: block; }
            th { position: absolute; left: -9999px; top: -9999px; }
            tr { border: 1px solid #ddd; margin-bottom: 1em; }
            td { border: none; border-bottom: 1px solid #eee; position: relative; padding-left: 50%; }
            td:before { 
              position: absolute; 
              left: 10px; 
              top: 10px; 
              width: 45%; 
              white-space: nowrap;
              font-weight: bold;
              color: #555;
              content: attr(data-label);
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${beautify(endpoint)} Catalog</h1>
          <div class="links">
            <a href="/demo?endpoint=devices"${endpoint === 'devices' ? ' class="selected"' : ''}>Devices</a>
            <a href="/demo?endpoint=categories"${endpoint === 'categories' ? ' class="selected"' : ''}>Categories</a>
            <a href="/demo?endpoint=guides"${endpoint === 'guides' ? ' class="selected"' : ''}>Guides</a>
          </div>
          <table>
            <thead>
              <tr>
                ${headers.map((h) => `<th>${beautify(h)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) =>
                    `<tr>
                      ${headers
                        .map((h) => {
                          let val = item[h];
                          if (
                            typeof val === 'string' &&
                            val.match(/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i)
                          ) {
                            return `<td data-label="${beautify(h)}"><img src="${val}" alt="img" class="thumb"></td>`;
                          }
                          return `<td data-label="${beautify(h)}">${val !== undefined && val !== null ? val : ''}</td>`;
                        })
                        .join('')}
                    </tr>`
                )
                .join('')}
            </tbody>
          </table>
          <p style="margin-top:1.5em; color:#666; font-size:0.98em;">
            <b>Tip:</b> Use the links above to explore different API data. This page is auto-generated from live API responses.
          </p>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`
      <html>
      <body>
        <h2 style="color:#c00;">Error loading demo data!</h2>
        <p>${err.message}</p>
      </body>
      </html>
    `);
  }
});
