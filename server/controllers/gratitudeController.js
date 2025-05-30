const GratitudeModel = require('../models/gratitude');
const LLMService = require('../services/llmService');

// Controller for gratitude-related operations
class GratitudeController {
  // Process user input
  static async processInput(req, res) {
    try {
      const { 
        input, 
        questionIteration = 0, 
        originalInput = null 
      } = req.body;
      
      if (!input) {
        return res.status(400).json({ error: 'Input is required' });
      }

      // Analyze the gratitude input
      const analysis = await LLMService.analyzeGratitudeInput(input);
      console.log(`Input analysis status: ${analysis.status}, iteration: ${questionIteration}`);
      
      // Handle based on analysis result and iteration count
      if (analysis.status === "polished") {
        // If the input is already a polished statement of gratitude, return it directly
        return res.json({
          status: "polished",
          statement: input,
          originalInput: originalInput || input
        });
      } else if (analysis.status === "needs_polishing") {
        // If the input needs polishing, generate refined statements
        const statements = await LLMService.generateGratitudeStatements(input);
        return res.json({
          status: "needs_polishing",
          statements,
          originalInput: originalInput || input,
          analysis
        });
      } else if (analysis.status === "needs_more_details") {
        // Check if we've reached the maximum number of iterations
        if (questionIteration >= 3) {
          return res.json({
            status: "max_iterations",
            message: "We've tried a few questions, but it seems like we need more information. Please take a moment to think about a specific gratitude experience and start over.",
            originalInput: originalInput || input
          });
        }
        
        // Generate a targeted question based on what's missing
        const question = await LLMService.generateTargetedQuestion(input, analysis);
        return res.json({
          status: "needs_more_details",
          question,
          questionIteration,
          originalInput: originalInput || input,
          analysis
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
      
      // Add a small delay to simulate network latency and prevent rapid re-fetching
      // This helps prevent the flickering issue on the client side
      await new Promise(resolve => setTimeout(resolve, 300));
      
      res.json({ entries });
    } catch (error) {
      console.error('Error getting history:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      
      // Send a more detailed error response
      res.status(500).json({ 
        error: 'Failed to get history',
        message: error.message,
        timestamp: new Date().toISOString()
      });
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
