const LLMService = require('../services/llmService');
const axios = require('axios');
const dotenv = require('dotenv');
const prompts = require('../utils/prompts');
const llmConfig = require('../utils/llmConfig');

dotenv.config();

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = llmConfig.OPENROUTER_URL;
const DEFAULT_MODEL = llmConfig.DEFAULT_MODEL;

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
        model: DEFAULT_MODEL,
        messages: [{ role: "user", content: "Hello, this is a test message to verify the API key." }],
        temperature: llmConfig.temperatures.apiValidation,
        max_tokens: llmConfig.tokenLimits.apiValidation,
      }, {
        headers: llmConfig.getHeaders(OPENROUTER_API_KEY)
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

  // Test the targeted question generation logic
  static async testTargetedQuestion(req, res) {
    try {
      const { input, customPrompt, skipAnalysis } = req.body;
      
      if (!input) {
        return res.status(400).json({ error: 'Input is required' });
      }
      
      // First analyze the input to determine what's missing
      let analysisResult;
      if (!skipAnalysis) {
        analysisResult = await LLMService.analyzeGratitudeInput(input);
      } else {
        // Use a mock analysis result if skipAnalysis is true
        analysisResult = {
          status: "needs_more_details",
          has_past_tense: true,
          has_reflective_style: true,
          omits_explicit_gratitude: true,
          has_beneficial_action: false,
          has_positive_impact: false,
          is_concise: true,
          has_moderate_emotion: true,
          missing_elements: ["beneficial action", "positive impact"]
        };
      }
      
      const needsBeneficialAction = !analysisResult.has_beneficial_action;
      const needsPositiveImpact = !analysisResult.has_positive_impact;
      const defaultPrompt = prompts.generateTargetedQuestion(input, needsBeneficialAction, needsPositiveImpact);
      
      // Use the custom prompt if provided
      const promptToUse = customPrompt || defaultPrompt;
      
      // Make the API call directly to expose the full process
      let question;
      let rawResponse;
      let error;
      
      try {
        const response = await axios.post(OPENROUTER_URL, {
          model: DEFAULT_MODEL,
          messages: [{ role: "user", content: promptToUse }],
          temperature: llmConfig.temperatures.generateTargetedQuestion,
          max_tokens: llmConfig.tokenLimits.generateTargetedQuestion,
        }, {
          headers: llmConfig.getHeaders(OPENROUTER_API_KEY)
        });
        
        rawResponse = response.data;
        question = response.data.choices[0].message.content.trim();
      } catch (apiError) {
        error = {
          message: apiError.message,
          status: apiError.response ? apiError.response.status : null,
          data: apiError.response ? apiError.response.data : null
        };
        
        // Use fallback if API call fails
        question = LLMService.getFallbackTargetedQuestion(
          input, 
          !analysisResult.has_beneficial_action, 
          !analysisResult.has_positive_impact
        );
      }
      
      // Also get the question using the standard method for comparison
      const standardQuestion = await LLMService.generateTargetedQuestion(input, analysisResult);
      
      res.json({
        success: true,
        input,
        analysis: analysisResult,
        prompt: {
          default: defaultPrompt,
          used: promptToUse
        },
        question: {
          direct: question,
          standard: standardQuestion
        },
        rawResponse,
        error
      });
    } catch (error) {
      console.error('Error testing targeted question generation:', error);
      
      res.json({
        success: false,
        message: 'Failed to test targeted question generation',
        error: {
          message: error.message,
          stack: error.stack
        }
      });
    }
  }

  // Test input analysis
  static async testInputAnalysis(req, res) {
    try {
      const { input, customPrompt } = req.body;
      
      if (!input) {
        return res.status(400).json({ error: 'Input is required' });
      }
      
      // Get the internal prompt used for input analysis
      const defaultPrompt = prompts.analyzeGratitudeInput(input);
      
      // Use the custom prompt if provided
      const promptToUse = customPrompt || defaultPrompt;
      
      // Make the API call directly to expose the full process
      let analysis;
      let rawResponse;
      let error;
      
      try {
        const response = await axios.post(OPENROUTER_URL, {
          model: DEFAULT_MODEL,
          messages: [{ role: "user", content: promptToUse }],
          temperature: llmConfig.temperatures.analyzeGratitudeInput,
          max_tokens: llmConfig.tokenLimits.analyzeGratitudeInput,
          ...(DEFAULT_MODEL.includes('openai') ? { response_format: { type: "json_object" } } : {})
        }, {
          headers: llmConfig.getHeaders(OPENROUTER_API_KEY)
        });
        
        rawResponse = response.data;
        const content = response.data.choices[0].message.content.trim();
        
        // Try to extract JSON from the response
        let jsonStr = content;
        
        // If the response contains a JSON object within markdown code blocks, extract it
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonStr = jsonMatch[1];
        }
        
        // If the response starts with text before the JSON, try to find the JSON part
        if (!jsonStr.startsWith('{')) {
          const jsonStartIndex = jsonStr.indexOf('{');
          if (jsonStartIndex !== -1) {
            jsonStr = jsonStr.substring(jsonStartIndex);
            // Find the matching closing bracket
            let bracketCount = 0;
            let endIndex = -1;
            for (let i = 0; i < jsonStr.length; i++) {
              if (jsonStr[i] === '{') bracketCount++;
              if (jsonStr[i] === '}') bracketCount--;
              if (bracketCount === 0) {
                endIndex = i + 1;
                break;
              }
            }
            if (endIndex !== -1) {
              jsonStr = jsonStr.substring(0, endIndex);
            }
          }
        }
        
        analysis = JSON.parse(jsonStr);
      } catch (apiError) {
        error = {
          message: apiError.message,
          status: apiError.response ? apiError.response.status : null,
          data: apiError.response ? apiError.response.data : null
        };
        
        // Use fallback if API call fails
        analysis = LLMService.getFallbackAnalysis(input);
      }
      
      // Also get the analysis using the standard method for comparison
      const standardAnalysis = await LLMService.analyzeGratitudeInput(input);
      
      // Get the legacy analysis for comparison
      const legacyAnalysis = await LLMService.analyzeInput(input);
      
      res.json({
        success: true,
        input,
        prompt: {
          default: defaultPrompt,
          used: promptToUse
        },
        analysis: {
          direct: analysis,
          standard: standardAnalysis,
          legacy: legacyAnalysis
        },
        rawResponse,
        error
      });
    } catch (error) {
      console.error('Error testing input analysis:', error);
      
      res.json({
        success: false,
        message: 'Failed to test input analysis',
        error: {
          message: error.message,
          stack: error.stack
        }
      });
    }
  }

  // Test gratitude statement generation
  static async testGratitudeStatements(req, res) {
    try {
      const { input, customPrompt } = req.body;
      
      if (!input) {
        return res.status(400).json({ error: 'Input is required' });
      }
      
      // Get the internal prompt used for statement generation
      const defaultPrompt = prompts.generateGratitudeStatements(input);
      
      // Use the custom prompt if provided
      const promptToUse = customPrompt || defaultPrompt;
      
      // Make the API call directly to expose the full process
      let statements;
      let rawResponse;
      let error;
      let extractionMethod;
      
      try {
        const response = await axios.post(OPENROUTER_URL, {
          model: DEFAULT_MODEL,
          messages: [{ role: "user", content: promptToUse }],
          temperature: llmConfig.temperatures.generateGratitudeStatements,
          max_tokens: llmConfig.tokenLimits.generateGratitudeStatements,
          ...(DEFAULT_MODEL.includes('openai') ? { response_format: { type: "json_object" } } : {})
        }, {
          headers: llmConfig.getHeaders(OPENROUTER_API_KEY)
        });
        
        rawResponse = response.data;
        const content = response.data.choices[0].message.content.trim();
        
        // Try to extract JSON from the response
        let jsonStr = content;
        
        // If the response contains a JSON array within markdown code blocks, extract it
        const jsonMatch = content.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonStr = jsonMatch[1];
        }
        
        // If the response starts with text before the JSON, try to find the JSON part
        if (!jsonStr.startsWith('[')) {
          const jsonStartIndex = jsonStr.indexOf('[');
          if (jsonStartIndex !== -1) {
            jsonStr = jsonStr.substring(jsonStartIndex);
            // Find the matching closing bracket
            let bracketCount = 0;
            let endIndex = -1;
            for (let i = 0; i < jsonStr.length; i++) {
              if (jsonStr[i] === '[') bracketCount++;
              if (jsonStr[i] === ']') bracketCount--;
              if (bracketCount === 0) {
                endIndex = i + 1;
                break;
              }
            }
            if (endIndex !== -1) {
              jsonStr = jsonStr.substring(0, endIndex);
            }
          }
        }
        
        statements = JSON.parse(jsonStr);
        
        // Ensure we have at least 3 statements
        if (!Array.isArray(statements) || statements.length < 3) {
          const fallbacks = LLMService.getFallbackGratitudeStatements(input);
          statements = Array.isArray(statements) ? 
            [...statements, ...fallbacks].slice(0, 3) : 
            fallbacks;
        }
        
        // Set extraction method
        extractionMethod = "JSON parsing";
      } catch (apiError) {
        error = {
          message: apiError.message,
          status: apiError.response ? apiError.response.status : null,
          data: apiError.response ? apiError.response.data : null
        };
        
        // Try to extract statements manually before falling back
        try {
          if (apiError.response && apiError.response.data && apiError.response.data.choices) {
            const content = apiError.response.data.choices[0].message.content.trim();
            
            // Try different extraction methods
            const statements = [];
            
            // Approach 1: Look for quoted strings that might be statements
            const quoteRegex = /"([^"]+)"/g;
            let quoteMatch;
            
            while ((quoteMatch = quoteRegex.exec(content)) !== null && statements.length < 3) {
              if (quoteMatch[1].length > 10) { // Only consider strings that are long enough to be statements
                statements.push(quoteMatch[1]);
              }
            }
            
            if (statements.length > 0) {
              extractionMethod = "Manual extraction - quoted strings";
              statements = statements.slice(0, 3);
            } else {
              // Approach 2: Look for numbered lists (1. Statement)
              const numberedRegex = /\d+\.\s*([^.!?]+[.!?])/g;
              let numberedMatch;
              
              while ((numberedMatch = numberedRegex.exec(content)) !== null && statements.length < 3) {
                if (numberedMatch[1].trim().length > 10) {
                  statements.push(numberedMatch[1].trim());
                }
              }
              
              if (statements.length > 0) {
                extractionMethod = "Manual extraction - numbered list";
                statements = statements.slice(0, 3);
              } else {
                // Approach 3: Look for sentences that might be statements
                const sentences = content.split(/[.!?]+/)
                  .map(s => s.trim())
                  .filter(s => s.length > 15 && s.length < 150 && !s.startsWith('```') && !s.includes('statement'));
                
                if (sentences.length > 0) {
                  extractionMethod = "Manual extraction - sentences";
                  statements = sentences.slice(0, 3);
                } else {
                  // Approach 4: Try to extract paragraphs
                  const paragraphs = content.split('\n\n')
                    .map(p => p.trim())
                    .filter(p => p.length > 20 && p.length < 200 && !p.startsWith('```'));
                  
                  if (paragraphs.length > 0) {
                    extractionMethod = "Manual extraction - paragraphs";
                    statements = paragraphs.slice(0, 3);
                  }
                }
              }
            }
          }
        } catch (extractionError) {
          console.error('Error during manual extraction:', extractionError);
        }
        
        // Use fallback if API call fails and manual extraction fails
        statements = LLMService.getFallbackGratitudeStatements(input);
        extractionMethod = "Fallback statements";
      }
      
      // Also get the statements using the standard method for comparison
      const standardStatements = await LLMService.generateGratitudeStatements(input);
      
      res.json({
        success: true,
        input,
        prompt: {
          default: defaultPrompt,
          used: promptToUse
        },
        statements: {
          direct: statements,
          standard: standardStatements
        },
        extractionMethod,
        rawResponse,
        error
      });
    } catch (error) {
      console.error('Error testing gratitude statement generation:', error);
      
      res.json({
        success: false,
        message: 'Failed to test gratitude statement generation',
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
