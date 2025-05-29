# Gratitude App Tests

This project includes tools to test various aspects of the Gratitude app's functionality:

1. **Proxy Test**: Verifies if the Vite development server is correctly proxying API requests to the backend Express server.
2. **Database Test**: Verifies if gratitude entries can be successfully saved to and retrieved from the database.
3. **API Test**: Verifies the OpenRouter API connection, key validation, fallback mechanisms, and input processing.

## Running the Tests

```bash
npm run test-app
```

This will:
1. Start the Express server
2. Start the Vite dev server
3. Provide instructions in the console for running all tests

## Test 1: Proxy Test

### Background

In a full-stack JavaScript application with a separate frontend and backend, the frontend development server needs to proxy API requests to the backend server during development. This prevents CORS issues and allows the frontend to make API requests as if they were being served from the same origin.

In this project:
- The frontend (React) runs on `http://localhost:3000` using Vite
- The backend (Express) runs on `http://localhost:5000`
- Vite is configured to proxy requests from `/api/*` to `http://localhost:5000/api/*`

### Testing the Proxy

The Proxy Test verifies if API requests are being correctly proxied from the frontend to the backend:

1. Makes a request to the `/api/gratitude/history` endpoint
2. Checks if the request is successfully proxied to the backend
3. Shows detailed results of the test

### Using the Proxy Test

1. Open your browser to http://localhost:3000
2. Click the "Test Mode" button in the bottom right corner
3. Ensure "Proxy Test" is selected in the test navigation
4. Click the "Test Proxy" button to run the test
5. Check the results to see if the proxy is working correctly

### Interpreting the Proxy Test Results

- **Success**: If the test is successful, you'll see a green box with the response from the server. This means the proxy is working correctly.
- **Failure**: If the test fails, you'll see a red box with an error message. This could mean:
  - The server is not running
  - The proxy is not configured correctly
  - There's an issue with the API endpoint

### Troubleshooting Proxy Issues

If the test fails, check:

1. **Server Running**: Make sure the Express server is running on port 5000
2. **Proxy Configuration**: Check the proxy configuration in `client/vite.config.js`
3. **API Endpoint**: Verify that the `/api/gratitude/history` endpoint is correctly implemented on the server
4. **Network Issues**: Check for any network issues or firewall settings that might be blocking the connection

## Test 2: Database Test

### Background

The Gratitude app stores user entries in a SQLite database. This test verifies that the database operations are working correctly.

### Testing the Database

The Database Test verifies the complete database operation cycle:

1. Creates a test gratitude entry with a timestamp
2. Saves the entry to the database
3. Retrieves the history to verify the entry was saved
4. Deletes the test entry to clean up
5. Verifies the entry was successfully deleted

### Using the Database Test

1. Open your browser to http://localhost:3000
2. Click the "Test Mode" button in the bottom right corner
3. Click the "Database Test" button in the test navigation
4. Click the "Test Database Save" button to run the test
5. Check the results to see if the database operations are working correctly

### Interpreting the Database Test Results

- **Success**: If the test is successful, you'll see a green box with details of the successful operations. This means the database functionality is working correctly.
- **Failure**: If the test fails, you'll see a red box with an error message. This could mean:
  - The server is not running
  - There's an issue with the database connection
  - One of the database operations (save, retrieve, delete) failed

### Troubleshooting Database Issues

If the test fails, check:

1. **Server Running**: Make sure the Express server is running on port 5000
2. **Database File**: Check if the SQLite database file exists at `server/db/data/gratitude.db`
3. **API Endpoints**: Verify that the database-related API endpoints are correctly implemented on the server
4. **Database Permissions**: Ensure the application has permission to read/write to the database file

## Test 3: OpenRouter API Test

### Background

The Gratitude app uses the OpenRouter API to access large language models for processing user input. This test verifies that the API integration is working correctly.

### Testing the API

The API Test verifies several aspects of the OpenRouter API integration:

1. **API Connection**: Checks if the OpenRouter API is reachable
2. **API Key Validation**: Verifies that the API key is valid and properly configured
3. **Fallback Mechanisms**: Tests if the fallback logic works when the API is unavailable
4. **Input Processing**: Ensures that different types of user inputs are processed correctly

### Using the API Test

1. Open your browser to http://localhost:3000
2. Click the "Test Mode" button in the bottom right corner
3. Click the "API Test" button in the test navigation
4. Click the "Test OpenRouter API" button to run the test
5. Check the results to see if the API integration is working correctly

### Interpreting the API Test Results

- **Success**: If the test is successful, you'll see a green box with details of the successful operations. This means the API integration is working correctly.
- **Warning**: If the API key is valid but rate-limited, you'll see a yellow box with a warning icon (⚠️). This is normal for free tier usage and doesn't indicate a problem with your setup.
- **Failure**: If the test fails, you'll see a red box with an error message. This could mean:
  - The OpenRouter API is unreachable
  - The API key is invalid or not configured
  - There's an issue with the fallback mechanisms
  - Input processing is not working correctly

### Troubleshooting API Issues

If the test fails, check:

1. **API Key**: Ensure the OPENROUTER_API_KEY is correctly set in the .env file
   - Get a valid API key from https://openrouter.ai/keys
   - Add it to your server/.env file as OPENROUTER_API_KEY=your_key_here
   - Ensure the key starts with 'sk-or-' and has no spaces or quotes
   - Restart the server after updating the .env file
2. **Internet Connection**: Verify that the server has internet access to reach the OpenRouter API
3. **Rate Limits**: If you see a rate limit warning, this is normal for free tier usage
   - Wait a few minutes before trying again
   - Consider upgrading your OpenRouter plan for higher rate limits
4. **Fallback Logic**: Review the fallback implementation in the LLMService

The API test component will display detailed troubleshooting tips for each specific issue that is detected.

## Technical Details

### Proxy Configuration

The proxy is configured in `client/vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

This configuration tells Vite to forward any requests that start with `/api` to `http://localhost:5000/api`.

### Database Schema

The database schema is defined in `server/db/database.js`:

```javascript
CREATE TABLE IF NOT EXISTS gratitude_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  original_input TEXT,
  tone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

This schema stores gratitude entries with the following fields:
- `id`: A unique identifier for each entry
- `content`: The final gratitude statement
- `original_input`: The user's original input
- `tone`: The tone of the gratitude statement (concise, poetic, conversational)
- `created_at`: The timestamp when the entry was created

### OpenRouter API Integration

The OpenRouter API is integrated through the LLMService in `server/services/llmService.js`:

```javascript
// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Default headers for OpenRouter
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
  'HTTP-Referer': 'https://gratitude-app.com',
  'X-Title': 'Gratitude App'
};
```

The service includes fallback mechanisms to handle cases where the API is unavailable:

```javascript
// If API call fails, use fallback logic
catch (error) {
  console.error('API error, using fallback:', error.message);
  return wordCount >= 5 ? { complete: true } : { complete: false };
}
```
