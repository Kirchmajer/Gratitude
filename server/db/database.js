const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const dbPath = path.join(dbDir, 'gratitude.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    return;
  }
  console.log('Connected to the SQLite database.');
  
  // Initialize database schema using init.sql if the database is new
  const isNewDatabase = !fs.existsSync(dbPath) || fs.statSync(dbPath).size === 0;
  
  if (isNewDatabase) {
    console.log('New database detected, initializing schema...');
    initializeDatabase();
  } else {
    // Ensure the table exists even for existing databases
    db.run(`
      CREATE TABLE IF NOT EXISTS gratitude_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        original_input TEXT,
        tone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Gratitude entries table verified.');
      }
    });
  }
});

// Function to initialize the database schema from init.sql
function initializeDatabase() {
  try {
    const initSqlPath = path.join(__dirname, 'init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');
    
    // Split the SQL file into separate statements
    const statements = initSql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement
    db.serialize(() => {
      db.run('BEGIN TRANSACTION;');
      
      statements.forEach(statement => {
        db.run(statement, err => {
          if (err) {
            console.error(`Error executing SQL statement: ${statement}`, err);
          }
        });
      });
      
      db.run('COMMIT;', err => {
        if (err) {
          console.error('Error committing transaction:', err);
        } else {
          console.log('Database schema initialized successfully.');
        }
      });
    });
  } catch (err) {
    console.error('Error initializing database schema:', err);
    
    // Fallback to basic table creation if init.sql fails
    db.run(`
      CREATE TABLE IF NOT EXISTS gratitude_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        original_input TEXT,
        tone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Gratitude entries table initialized (fallback).');
      }
    });
  }
}

// Helper function to run queries with promises
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Helper function to get data with promises
const getQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};

// Helper function to get a single row
const getSingleQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
};

module.exports = {
  db,
  runQuery,
  getQuery,
  getSingleQuery
};
