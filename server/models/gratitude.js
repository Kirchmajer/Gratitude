const { runQuery, getQuery, getSingleQuery } = require('../db/database');

class GratitudeModel {
  // Create a new gratitude entry
  static async create(content, originalInput, tone) {
    try {
      const result = await runQuery(
        'INSERT INTO gratitude_entries (content, original_input, tone) VALUES (?, ?, ?)',
        [content, originalInput, tone]
      );
      
      if (result.id) {
        return await this.getById(result.id);
      }
      return null;
    } catch (error) {
      console.error('Error creating gratitude entry:', error);
      throw error;
    }
  }

  // Get all gratitude entries
  static async getAll() {
    try {
      return await getQuery(
        'SELECT * FROM gratitude_entries ORDER BY created_at DESC'
      );
    } catch (error) {
      console.error('Error getting all gratitude entries:', error);
      throw error;
    }
  }

  // Get a gratitude entry by ID
  static async getById(id) {
    try {
      return await getSingleQuery(
        'SELECT * FROM gratitude_entries WHERE id = ?',
        [id]
      );
    } catch (error) {
      console.error(`Error getting gratitude entry with id ${id}:`, error);
      throw error;
    }
  }

  // Delete a gratitude entry
  static async delete(id) {
    try {
      const result = await runQuery(
        'DELETE FROM gratitude_entries WHERE id = ?',
        [id]
      );
      return result.changes > 0;
    } catch (error) {
      console.error(`Error deleting gratitude entry with id ${id}:`, error);
      throw error;
    }
  }
}

module.exports = GratitudeModel;
