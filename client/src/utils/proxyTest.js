import axios from 'axios';

/**
 * Test function to verify that the Vite proxy is correctly routing API requests
 * This function makes a request to the /api/gratitude/history endpoint
 * and logs the result or error
 */
export const testProxy = async () => {
  console.log('Testing Vite proxy for API requests...');
  
  try {
    // This request should be proxied to http://localhost:5000/api/gratitude/history
    const response = await axios.get('/api/gratitude/history');
    
    console.log('Proxy test successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Proxy test failed!');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      return {
        success: false,
        status: error.response.status,
        data: error.response.data,
        error: 'Server responded with an error'
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
      
      return {
        success: false,
        error: 'No response received from server. Is the server running?'
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
      
      return {
        success: false,
        error: `Error setting up request: ${error.message}`
      };
    }
  }
};
