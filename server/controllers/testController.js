const LLMService = require('../services/llmService');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Controller for testing OpenRouter API functionality
class TestController {
  // Test API connection
  static async testConnection(req, res) {
    try {
      // Check if API key is configured
      if (!OPENROUTER_API_KEY) {
        return res.json({
          success: false,
          message: 'OpenRouter API key is not configured',
          details: {
            keyConfigured: false,
            troubleshooting: [
              "Add OPENROUTER_API_KEY to your .env file",
              "Restart the server after updating the .env file",
              "Ensure there are no spaces or quotes around the API key"
            ]
          }
        });
      }
      
      // Simple ping to OpenRouter API
      const response = await axios.get('https://openrouter.ai/api/v1/auth/key', {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`
        }
      });
      
      res.json({
        success: true,
        message: 'Successfully connected to OpenRouter API',
        details: {
          statusCode: response.status,
          statusText: response.statusText
        }
      });
    } catch (error) {
      console.error('Error testing API connection:', error);
      
      // Provide more detailed troubleshooting information
      const troubleshooting = [];
      
      if (error.response && error.response.status === 401) {
        troubleshooting.push(
          "Your API key appears to be invalid or expired",
          "Get a new API key from https://openrouter.ai/keys",
          "Update the OPENROUTER_API_KEY in your .env file",
          "Ensure the API key format is correct (should start with 'sk-or-')",
          "Restart the server after updating the .env file"
        );
      } else if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        troubleshooting.push(
          "Check your internet connection",
          "Verify that openrouter.ai is accessible from your network",
          "Check if your network has any firewall rules blocking the connection"
        );
      } else {
        troubleshooting.push(
          "Check your internet connection",
          "Verify that the OpenRouter API is currently operational",
          "Try again later as the service might be temporarily unavailable"
        );
      }
      
      res.json({
        success: false,
        message: 'Failed to connect to OpenRouter API',
        error: {
          message: error.message,
          status: error.response ? error.response.status : null,
          data: error.response ? error.response.data : null,
          code: error.code
        },
        troubleshooting
      });
    }
  }

  // Test API key validation
  static async testApiKey(req, res) {
    try {
      if (!OPENROUTER_API_KEY) {
        return res.json({
          success: false,
          message: 'OpenRouter API key is not configured',
          details: {
            keyConfigured: false,
            troubleshooting: [
              "Add OPENROUTER_API_KEY to your .env file",
              "Restart the server after updating the .env file",
              "Ensure there are no spaces or quotes around the API key"
            ]
          }
        });
      }
      
      // Log the first few characters of the API key for debugging
      console.log(`Testing API key (first 10 chars): ${OPENROUTER_API_KEY.substring(0, 10)}...`);
      
      // Make a simple request to verify the API key
      const response = await axios.post(OPENROUTER_URL, {
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [{ role: "user", content: "Hello, this is a test message to verify the API key." }],
        temperature: 0.3,
        max_tokens: 10,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://gratitude-app.com',
          'X-Title': 'Gratitude App'
        }
      });
      
      res.json({
        success: true,
        message: 'API key is valid',
        details: {
          keyConfigured: true,
          keyValid: true,
          model: response.data.model,
          usage: response.data.usage
        }
      });
    } catch (error) {
      console.error('Error testing API key:', error);
      
      // Check if the error is related to authentication or rate limiting
      const isAuthError = error.response && 
        (error.response.status === 401 || 
         error.response.status === 403 ||
         (error.response.data && error.response.data.error && 
          (typeof error.response.data.error === 'string' ? 
            error.response.data.error.includes('auth') : 
            error.response.data.error.message && error.response.data.error.message.includes('auth')
          )
         ));
      
      const isRateLimitError = error.response && 
        (error.response.status === 429 ||
         (error.response.data && error.response.data.error && 
          (typeof error.response.data.error === 'string' ? 
            error.response.data.error.includes('rate') || error.response.data.error.includes('limit') : 
            error.response.data.error.message && 
            (error.response.data.error.message.includes('rate') || 
             error.response.data.error.message.includes('limit'))
          )
         ));
      
      // For rate limiting errors, we'll consider the key valid but with a warning
      if (isRateLimitError) {
        return res.json({
          success: true, // Consider this a success with a warning
          message: 'API key is valid but rate limited',
          details: {
            keyConfigured: true,
            keyValid: true,
            warning: 'Rate limit reached',
            error: {
              message: error.message,
              status: error.response ? error.response.status : null,
              data: error.response ? error.response.data : null,
              code: error.code
            },
            troubleshooting: [
              "You've hit the rate limit for the OpenRouter API or the underlying model provider",
              "Wait a few minutes before trying again",
              "Consider upgrading your OpenRouter plan for higher rate limits",
              "Try a different model in the OpenRouter configuration",
              "This is normal for free tier usage and doesn't indicate a problem with your setup"
            ]
          }
        });
      }
      
      // Provide more detailed troubleshooting information for other errors
      const troubleshooting = [];
      
      if (isAuthError) {
        troubleshooting.push(
          "Your API key appears to be invalid or expired",
          "Get a new API key from https://openrouter.ai/keys",
          "Update the OPENROUTER_API_KEY in your .env file",
          "Ensure the API key format is correct (should start with 'sk-or-')",
          "Restart the server after updating the .env file"
        );
      } else if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        troubleshooting.push(
          "Check your internet connection",
          "Verify that openrouter.ai is accessible from your network",
          "Check if your network has any firewall rules blocking the connection"
        );
      } else {
        troubleshooting.push(
          "Check your internet connection",
          "Verify that the OpenRouter API is currently operational",
          "Try again later as the service might be temporarily unavailable"
        );
      }
      
      res.json({
        success: false,
        message: isAuthError ? 'API key is invalid' : 'Error testing API key',
        details: {
          keyConfigured: !!OPENROUTER_API_KEY,
          keyValid: false,
          error: {
            message: error.message,
            status: error.response ? error.response.status : null,
            data: error.response ? error.response.data : null,
            code: error.code
          },
          troubleshooting
        }
      });
    }
  }

  // Test fallback mechanisms
  static async testFallback(req, res) {
    try {
      const { simulateError } = req.body;
      
      if (simulateError) {
        // Use the internal fallback mechanism in LLMService
        // We'll modify the API key temporarily to force an error
        const originalKey = process.env.OPENROUTER_API_KEY;
        process.env.OPENROUTER_API_KEY = 'invalid_key_to_force_error';
        
        try {
          // Try to analyze input, which should fail and use fallback
          const result = await LLMService.analyzeInput('test input for fallback');
          
          // Restore the original key
          process.env.OPENROUTER_API_KEY = originalKey;
          
          res.json({
            success: true,
            fallbackUsed: true,
            message: 'Fallback mechanism was successfully tested',
            result
          });
        } catch (error) {
          // Restore the original key
          process.env.OPENROUTER_API_KEY = originalKey;
          
          throw error;
        }
      } else {
        // Test without simulating an error
        const result = await LLMService.analyzeInput('test input without fallback');
        
        res.json({
          success: true,
          fallbackUsed: false,
          message: 'API request completed without using fallback',
          result
        });
      }
    } catch (error) {
      console.error('Error testing fallback mechanism:', error);
      
      res.json({
        success: false,
        message: 'Failed to test fallback mechanism',
        error: {
          message: error.message,
          stack: error.stack
        }
      });
    }
  }

  // Test processing different input types
  static async testProcessInput(req, res) {
    try {
      const { input, inputType } = req.body;
      
      if (!input) {
        return res.status(400).json({ error: 'Input is required' });
      }
      
      let result;
      
      // Process based on input type
      switch (inputType) {
        case 'keywords':
          // For keywords, we expect analyzeInput to return complete: false
          result = await LLMService.analyzeInput(input);
          
          // If keywords are detected correctly, generate questions
          if (!result.complete) {
            const questions = await LLMService.generateQuestions(input);
            result = { 
              inputType: 'keywords',
              analysis: result,
              questions
            };
          } else {
            result = { 
              inputType: 'keywords',
              analysis: result,
              error: 'Keywords were incorrectly identified as a complete sentence'
            };
          }
          break;
          
        case 'short_sentence':
        case 'long_sentence':
          // For sentences, we expect analyzeInput to return complete: true
          result = await LLMService.analyzeInput(input);
          
          // If sentence is detected correctly, generate refined sentences
          if (result.complete) {
            const sentences = await LLMService.generateSentences(input);
            result = { 
              inputType: inputType,
              analysis: result,
              sentences
            };
          } else {
            result = { 
              inputType: inputType,
              analysis: result,
              error: 'Complete sentence was incorrectly identified as keywords'
            };
          }
          break;
          
        default:
          // Auto-detect input type
          result = await LLMService.analyzeInput(input);
          
          if (result.complete) {
            const sentences = await LLMService.generateSentences(input);
            result = { 
              inputType: 'auto-detected-complete',
              analysis: result,
              sentences
            };
          } else {
            const questions = await LLMService.generateQuestions(input);
            result = { 
              inputType: 'auto-detected-incomplete',
              analysis: result,
              questions
            };
          }
      }
      
      res.json({
        success: true,
        input,
        inputType,
        result
      });
    } catch (error) {
      console.error('Error testing input processing:', error);
      
      res.json({
        success: false,
        message: 'Failed to process input',
        error: {
          message: error.message,
          stack: error.stack
        }
      });
    }
  }
}

module.exports = TestController;
