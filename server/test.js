const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:5000/api/gratitude';

// Test data
const testInput = 'family';
const testSentence = 'I am grateful for my loving family who supports me through everything.';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Helper function to log results
const logResult = (test, success, message) => {
  const color = success ? colors.green : colors.red;
  const status = success ? 'PASSED' : 'FAILED';
  console.log(`${color}[${status}]${colors.reset} ${test}: ${message}`);
};

// Test the process endpoint with a simple input
async function testProcessEndpoint() {
  console.log(`\n${colors.blue}Testing /process endpoint...${colors.reset}`);
  console.log(`Sending request to: ${API_URL}/process`);
  console.log(`Request body:`, { input: testInput });
  
  try {
    const response = await axios.post(`${API_URL}/process`, { input: testInput });
    console.log(`${colors.yellow}Response:${colors.reset}`, JSON.stringify(response.data, null, 2));
    
    if (response.data.needsMore === true && Array.isArray(response.data.questions)) {
      logResult('Process Endpoint', true, 'Successfully generated clarifying questions');
    } else if (response.data.needsMore === false && Array.isArray(response.data.suggestions)) {
      logResult('Process Endpoint', true, 'Successfully generated sentence suggestions');
    } else {
      logResult('Process Endpoint', false, 'Unexpected response format');
    }
  } catch (error) {
    logResult('Process Endpoint', false, `Error: ${error.message}`);
    console.error(`${colors.red}Error code:${colors.reset}`, error.code);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`${colors.red}Response data:${colors.reset}`, error.response.data);
      console.error(`${colors.red}Response status:${colors.reset}`, error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error(`${colors.red}No response received. Request:${colors.reset}`, error.request._currentUrl);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`${colors.red}Error setting up request:${colors.reset}`, error.message);
    }
  }
}

// Test the save endpoint
async function testSaveEndpoint() {
  console.log(`\n${colors.blue}Testing /save endpoint...${colors.reset}`);
  try {
    const response = await axios.post(`${API_URL}/save`, {
      content: testSentence,
      originalInput: testInput,
      tone: 'concise'
    });
    console.log(`${colors.yellow}Response:${colors.reset}`, JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.entry) {
      logResult('Save Endpoint', true, 'Successfully saved gratitude entry');
      return response.data.entry.id;
    } else {
      logResult('Save Endpoint', false, 'Failed to save entry');
      return null;
    }
  } catch (error) {
    logResult('Save Endpoint', false, `Error: ${error.message}`);
    if (error.response) {
      console.log(`${colors.yellow}Response data:${colors.reset}`, error.response.data);
    }
    return null;
  }
}

// Test the history endpoint
async function testHistoryEndpoint() {
  console.log(`\n${colors.blue}Testing /history endpoint...${colors.reset}`);
  try {
    const response = await axios.get(`${API_URL}/history`);
    console.log(`${colors.yellow}Response:${colors.reset}`, JSON.stringify(response.data, null, 2));
    
    if (Array.isArray(response.data.entries)) {
      logResult('History Endpoint', true, `Retrieved ${response.data.entries.length} entries`);
    } else {
      logResult('History Endpoint', false, 'Unexpected response format');
    }
  } catch (error) {
    logResult('History Endpoint', false, `Error: ${error.message}`);
    if (error.response) {
      console.log(`${colors.yellow}Response data:${colors.reset}`, error.response.data);
    }
  }
}

// Test the delete endpoint
async function testDeleteEndpoint(id) {
  if (!id) {
    console.log(`\n${colors.yellow}Skipping delete test as no entry ID is available${colors.reset}`);
    return;
  }
  
  console.log(`\n${colors.blue}Testing /:id delete endpoint...${colors.reset}`);
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log(`${colors.yellow}Response:${colors.reset}`, JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      logResult('Delete Endpoint', true, `Successfully deleted entry ${id}`);
    } else {
      logResult('Delete Endpoint', false, 'Failed to delete entry');
    }
  } catch (error) {
    logResult('Delete Endpoint', false, `Error: ${error.message}`);
    if (error.response) {
      console.log(`${colors.yellow}Response data:${colors.reset}`, error.response.data);
    }
  }
}

// Run all tests
async function runTests() {
  console.log(`${colors.blue}=== GRATITUDE API TESTS ===${colors.reset}`);
  
  await testProcessEndpoint();
  const savedEntryId = await testSaveEndpoint();
  await testHistoryEndpoint();
  await testDeleteEndpoint(savedEntryId);
  
  console.log(`\n${colors.blue}=== TESTS COMPLETED ===${colors.reset}`);
}

// Start the tests
runTests();
