import React, { useState } from 'react';
import { testProxy } from '../utils/proxyTest';

const ProxyTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const result = await testProxy();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Unexpected error running test'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      margin: '20px', 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '5px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>Vite Proxy Test</h2>
      <p>
        This component tests if the Vite dev server is correctly proxying API requests 
        to the backend server. Click the button below to test the proxy configuration.
      </p>
      
      <button 
        onClick={runTest}
        disabled={loading}
        style={{
          padding: '10px 15px',
          backgroundColor: loading ? '#cccccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Testing...' : 'Test Proxy'}
      </button>
      
      {testResult && (
        <div style={{
          backgroundColor: testResult.success ? '#e8f5e9' : '#ffebee',
          padding: '15px',
          borderRadius: '4px',
          border: `1px solid ${testResult.success ? '#a5d6a7' : '#ef9a9a'}`
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: testResult.success ? '#2e7d32' : '#c62828' }}>
            {testResult.success ? 'Proxy Test Successful!' : 'Proxy Test Failed'}
          </h3>
          
          {testResult.success ? (
            <div>
              <p><strong>Status:</strong> {testResult.status}</p>
              <p><strong>Data:</strong></p>
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '4px',
                overflowX: 'auto'
              }}>
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div>
              <p><strong>Error:</strong> {testResult.error}</p>
              {testResult.status && <p><strong>Status:</strong> {testResult.status}</p>}
              {testResult.data && (
                <>
                  <p><strong>Data:</strong></p>
                  <pre style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '10px', 
                    borderRadius: '4px',
                    overflowX: 'auto'
                  }}>
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </>
              )}
            </div>
          )}
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h3>How This Test Works</h3>
        <ol style={{ textAlign: 'left' }}>
          <li>The test makes a GET request to <code>/api/gratitude/history</code></li>
          <li>If Vite proxy is configured correctly, this request will be forwarded to <code>http://localhost:5000/api/gratitude/history</code></li>
          <li>The server should respond with the gratitude history data</li>
          <li>If the test fails, check that:
            <ul>
              <li>The server is running on port 5000</li>
              <li>The Vite proxy is configured correctly in <code>vite.config.js</code></li>
              <li>The server has the correct routes set up</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default ProxyTest;
