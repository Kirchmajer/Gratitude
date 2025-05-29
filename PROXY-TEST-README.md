# Vite Proxy Test

This project includes a tool to test if the Vite development server is correctly proxying API requests to the backend Express server.

## Background

In a full-stack JavaScript application with a separate frontend and backend, the frontend development server needs to proxy API requests to the backend server during development. This prevents CORS issues and allows the frontend to make API requests as if they were being served from the same origin.

In this project:
- The frontend (React) runs on `http://localhost:3000` using Vite
- The backend (Express) runs on `http://localhost:5000`
- Vite is configured to proxy requests from `/api/*` to `http://localhost:5000/api/*`

## Testing the Proxy

We've created a simple tool to test if the proxy is working correctly. This tool:

1. Starts both the frontend and backend servers
2. Provides a UI to test if API requests are being correctly proxied
3. Shows detailed results of the test

### Running the Test

```bash
npm run test-proxy
```

This will:
1. Start the Express server
2. Start the Vite dev server
3. Provide instructions in the console

### Using the Test UI

1. Open your browser to http://localhost:3000
2. Click the "Test Mode" button in the bottom right corner
3. Click the "Test Proxy" button to run the test
4. Check the results to see if the proxy is working correctly

### Interpreting the Results

- **Success**: If the test is successful, you'll see a green box with the response from the server. This means the proxy is working correctly.
- **Failure**: If the test fails, you'll see a red box with an error message. This could mean:
  - The server is not running
  - The proxy is not configured correctly
  - There's an issue with the API endpoint

## Troubleshooting

If the test fails, check:

1. **Server Running**: Make sure the Express server is running on port 5000
2. **Proxy Configuration**: Check the proxy configuration in `client/vite.config.js`
3. **API Endpoint**: Verify that the `/api/gratitude/history` endpoint is correctly implemented on the server
4. **Network Issues**: Check for any network issues or firewall settings that might be blocking the connection

## Proxy Configuration

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
