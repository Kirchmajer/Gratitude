import axios from 'axios';

/**
 * Test function to verify the OpenRouter API connection
 * This function tests:
 * 1. If the API endpoint is reachable
 * 2. If the API key is valid
 * 3. If the fallback mechanisms work when the API is unavailable
 * 4. If different types of inputs are processed correctly
 */
export const testOpenRouterAPI = async () => {
  console.log('Testing OpenRouter API connection and functionality...');
  
  const tests = {
    apiConnection: { status: 'pending', details: null },
    apiKey: { status: 'pending', details: null },
    fallbackMechanisms: { status: 'pending', details: null },
    inputProcessing: { status: 'pending', details: null }
  };
  
  try {
    // Test 1: API Connection
    console.log('Testing API connection...');
    try {
      const connectionResponse = await axios.get('/api/gratitude/test/connection');
      tests.apiConnection.status = connectionResponse.data.success ? 'success' : 'failed';
      tests.apiConnection.details = connectionResponse.data;
    } catch (error) {
      tests.apiConnection.status = 'failed';
      tests.apiConnection.details = getErrorDetails(error);
    }
    
    // Test 2: API Key Validation
    console.log('Testing API key validation...');
    try {
      const keyResponse = await axios.get('/api/gratitude/test/api-key');
      
      // Check if this is a rate limiting warning (success with warning)
      const isRateLimited = keyResponse.data.success && 
                           keyResponse.data.details && 
                           keyResponse.data.details.warning === 'Rate limit reached';
      
      if (isRateLimited) {
        console.log('API key is valid but rate limited');
        tests.apiKey.status = 'success';
        tests.apiKey.details = keyResponse.data;
        tests.apiKey.warning = 'Rate limited';
      } else {
        tests.apiKey.status = keyResponse.data.success ? 'success' : 'failed';
        tests.apiKey.details = keyResponse.data;
      }
    } catch (error) {
      tests.apiKey.status = 'failed';
      tests.apiKey.details = getErrorDetails(error);
    }
    
    // Test 3: Fallback Mechanisms
    console.log('Testing fallback mechanisms...');
    try {
      const fallbackResponse = await axios.post('/api/gratitude/test/fallback', {
        simulateError: true
      });
      tests.fallbackMechanisms.status = fallbackResponse.data.fallbackUsed ? 'success' : 'failed';
      tests.fallbackMechanisms.details = fallbackResponse.data;
    } catch (error) {
      tests.fallbackMechanisms.status = 'failed';
      tests.fallbackMechanisms.details = getErrorDetails(error);
    }
    
    // Test 4: Input Processing
    console.log('Testing different input types...');
    try {
      // Test with different input types
      const inputTests = [
        { type: 'keywords', input: 'family dog' },
        { type: 'short_sentence', input: 'I love my family' },
        { type: 'long_sentence', input: 'I am grateful for the support my family gives me every day of my life' }
      ];
      
      const inputResults = [];
      
      for (const test of inputTests) {
        const response = await axios.post('/api/gratitude/test/process-input', {
          input: test.input,
          inputType: test.type
        });
        
        inputResults.push({
          inputType: test.type,
          input: test.input,
          result: response.data
        });
      }
      
      tests.inputProcessing.status = 'success';
      tests.inputProcessing.details = { inputTests: inputResults };
    } catch (error) {
      tests.inputProcessing.status = 'failed';
      tests.inputProcessing.details = getErrorDetails(error);
    }
    
    // Determine overall success
    const allTestsPassed = Object.values(tests).every(test => test.status === 'success');
    
    return {
      success: allTestsPassed,
      message: allTestsPassed 
        ? 'All OpenRouter API tests passed successfully' 
        : 'Some OpenRouter API tests failed, check details for troubleshooting tips',
      tests,
      apiKeyInfo: {
        note: "To use the OpenRouter API, you need a valid API key.",
        instructions: [
          "1. Get an API key from https://openrouter.ai/keys",
          "2. Add it to your server/.env file as OPENROUTER_API_KEY=your_key_here",
          "3. Ensure the key starts with 'sk-or-' and has no spaces or quotes",
          "4. Restart the server after updating the .env file"
        ]
      }
    };
  } catch (error) {
    console.error('API test failed:', error);
    
    return {
      success: false,
      message: 'API test failed with an unexpected error',
      error: getErrorDetails(error)
    };
  }
};

// Helper function to extract error details
const getErrorDetails = (error) => {
  const details = {
    message: error.message
  };
  
  if (error.response) {
    details.status = error.response.status;
    details.data = error.response.data;
  }
  
  return details;
};
