const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Render the search form and history
  router.get('/', (req, res) => {
    db.all(`SELECT query, last_searched FROM searches ORDER BY last_searched DESC`, [], (err, rows) => {
      if (err) return res.render('index', { searches: [] });

      res.render('index', { searches: rows });
    });
  });

  // Handle a new search
  router.post('/search', (req, res) => {
    var { query } = req.body;

    if (!query) return res.redirect('/');
    query = query.trim();
    query = query.toLowerCase();
    const now = new Date().toISOString();
    db.run(
      `INSERT INTO searches (query, last_searched) VALUES (?, ?)
       ON CONFLICT(query) DO UPDATE SET last_searched = ?`,
      [query, now, now],
      function (err) {
        if (err) return res.redirect('/');

        res.redirect('/');
      }
    );
  });

  return router;
};
