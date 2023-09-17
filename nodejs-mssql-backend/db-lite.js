const sqlite3 = require('sqlite3');

const path = require('path');
const dbPath = path.join(__dirname, 'mydatabase.db');

const db = new sqlite3.Database(dbPath);

db.on('error', (err) => {
    console.error('Database connection error:', err);
});

module.exports = db;