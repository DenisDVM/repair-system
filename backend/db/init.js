const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { DATABASE_FILE } = require('../config');

// Ensure db directory exists
const dbDir = path.dirname(DATABASE_FILE);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// Initialize database
const db = new sqlite3.Database(DATABASE_FILE, (err) => {
  if (err) console.error('DB Connection Error:', err);
});

// Run init.sql
const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf-8');
db.exec(initSql, (err) => {
  if (err) console.error('Error running init.sql:', err);
  else console.log('Database initialized');
});

module.exports = db;