const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database setup
const db = new sqlite3.Database('./database/tracker.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS searches (
      query TEXT PRIMARY KEY,
      last_searched DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Routes
const searchRoutes = require('./routes/search')(db);
app.use('/', searchRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
