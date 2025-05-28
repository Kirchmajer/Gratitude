-- Initialize the Gratitude database schema

-- Drop tables if they exist
DROP TABLE IF EXISTS gratitude_entries;

-- Create gratitude_entries table
CREATE TABLE gratitude_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  original_input TEXT,
  tone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_gratitude_created_at ON gratitude_entries(created_at);
