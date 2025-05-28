const GratitudeModel = require('../models/gratitude');
const LLMService = require('../services/llmService');

// Controller for gratitude-related operations
class GratitudeController {
  // Process user input
  static async processInput(req, res) {
    try {
      const { input } = req.body;
      
      if (!input) {
        return res.status(400).json({ error: 'Input is required' });
      }

      // Analyze if input is complete or just keywords
      const analysis = await LLMService.analyzeInput(input);
      
      if (!analysis.complete) {
        // If input is incomplete, generate clarifying questions
        const questions = await LLMService.generateQuestions(input);
        return res.json({ needsMore: true, questions, originalInput: input });
      } else {
        // If input is complete, generate refined sentences
        const suggestions = await LLMService.generateSentences(input);
        return res.json({ 
          needsMore: false, 
          suggestions: [
            { text: suggestions.concise, tone: 'concise' },
            { text: suggestions.poetic, tone: 'poetic' },
            { text: suggestions.conversational, tone: 'conversational' }
          ],
          originalInput: input
        });
      }
    } catch (error) {
      console.error('Error processing input:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response ? {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers
        } : 'No response'
      });
      res.status(500).json({ error: 'Failed to process input' });
    }
  }

  // Save a gratitude entry
  static async saveEntry(req, res) {
    try {
      const { content, originalInput, tone } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const entry = await GratitudeModel.create(content, originalInput, tone);
      
      if (!entry) {
        return res.status(500).json({ error: 'Failed to save entry' });
      }

      res.status(201).json({ success: true, entry });
    } catch (error) {
      console.error('Error saving entry:', error);
      res.status(500).json({ error: 'Failed to save entry' });
    }
  }

  // Get all gratitude entries
  static async getHistory(req, res) {
    try {
      const entries = await GratitudeModel.getAll();
      res.json({ entries });
    } catch (error) {
      console.error('Error getting history:', error);
      res.status(500).json({ error: 'Failed to get history' });
    }
  }

  // Delete a gratitude entry
  static async deleteEntry(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: 'Entry ID is required' });
      }

      const success = await GratitudeModel.delete(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Entry not found' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting entry:', error);
      res.status(500).json({ error: 'Failed to delete entry' });
    }
  }
}

module.exports = GratitudeController;
