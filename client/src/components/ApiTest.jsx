import React, { useState } from 'react';
import { testOpenRouterAPI } from '../utils/apiTest';

const ApiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const runTest = async () => {
    setLoading(true);
    try {
      const result = await testOpenRouterAPI();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Unexpected error running test',
        error: {
          message: error.message
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const getStatusIcon = (test) => {
    // Check if this is a rate-limited success (has warning)
    if (test.status === 'success' && test.warning === 'Rate limited') {
      return '⚠️'; // Warning icon for rate-limited success
    }
    
    switch (test.status) {
      case 'success':
        return '✅';
      case 'failed':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '❓';
    }
  };

  return (
    <div style={{ 
      margin: '20px', 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '5px',
      backgroundColor: '#f9f9f9',
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
      <h2>OpenRouter API Test</h2>
      <p>
        This component tests the OpenRouter API integration, including:
      </p>
      <ol style={{ textAlign: 'left' }}>
        <li>API Connection: Verifies if the OpenRouter API is reachable</li>
        <li>API Key Validation: Checks if the API key is valid</li>
        <li>Fallback Mechanisms: Tests if fallbacks work when the API is unavailable</li>
        <li>Input Processing: Verifies that different types of inputs are processed correctly</li>
      </ol>
      
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
        {loading ? 'Testing...' : 'Test OpenRouter API'}
      </button>
      
      {testResult && (
        <div style={{
          backgroundColor: testResult.success ? '#e8f5e9' : '#ffebee',
          padding: '15px',
          borderRadius: '4px',
          border: `1px solid ${testResult.success ? '#a5d6a7' : '#ef9a9a'}`
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: testResult.success ? '#2e7d32' : '#c62828' }}>
            {testResult.success ? 'API Test Successful!' : 'API Test Failed'}
          </h3>
          
          <p><strong>Status:</strong> {testResult.message}</p>
          
          {testResult.tests && (
            <div style={{ marginTop: '15px' }}>
              <h4 style={{ marginBottom: '10px' }}>Test Results:</h4>
              
              {/* API Connection Test */}
              <div 
                onClick={() => toggleSection('apiConnection')}
                style={{
                  cursor: 'pointer',
                  padding: '8px',
                  backgroundColor: testResult.tests.apiConnection.status === 'success' ? '#c8e6c9' : '#ffcdd2',
                  borderRadius: '4px',
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>
                  <strong>1. API Connection</strong> {getStatusIcon(testResult.tests.apiConnection)}
                </span>
                <span>{expandedSection === 'apiConnection' ? '▼' : '▶'}</span>
              </div>
              
              {expandedSection === 'apiConnection' && (
                <div style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '10px', 
                  borderRadius: '4px',
                  marginTop: '5px'
                }}>
                  {testResult.tests.apiConnection.status === 'success' ? (
                    <div>
                      <p>Successfully connected to OpenRouter API</p>
                      {testResult.tests.apiConnection.details && (
                        <pre style={{ 
                          backgroundColor: '#eee', 
                          padding: '10px', 
                          borderRadius: '4px',
                          overflowX: 'auto'
                        }}>
                          {JSON.stringify(testResult.tests.apiConnection.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p>Failed to connect to OpenRouter API</p>
                      {testResult.tests.apiConnection.details && (
                        <div>
                          <pre style={{ 
                            backgroundColor: '#eee', 
                            padding: '10px', 
                            borderRadius: '4px',
                            overflowX: 'auto',
                            marginBottom: '10px'
                          }}>
                            {JSON.stringify(testResult.tests.apiConnection.details, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {testResult.tests.apiConnection.troubleshooting && (
                        <div style={{ marginTop: '10px' }}>
                          <h5 style={{ marginBottom: '5px' }}>Troubleshooting Tips:</h5>
                          <ul style={{ marginLeft: '20px' }}>
                            {testResult.tests.apiConnection.troubleshooting.map((tip, i) => (
                              <li key={i} style={{ marginBottom: '5px' }}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* API Key Test */}
              <div 
                onClick={() => toggleSection('apiKey')}
                style={{
                  cursor: 'pointer',
                  padding: '8px',
                  backgroundColor: testResult.tests.apiKey.status === 'success' 
                    ? (testResult.tests.apiKey.warning === 'Rate limited' ? '#fff9c4' : '#c8e6c9') 
                    : '#ffcdd2',
                  borderRadius: '4px',
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>
                  <strong>2. API Key Validation</strong> {getStatusIcon(testResult.tests.apiKey)}
                </span>
                <span>{expandedSection === 'apiKey' ? '▼' : '▶'}</span>
              </div>
              
              {expandedSection === 'apiKey' && (
                <div style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '10px', 
                  borderRadius: '4px',
                  marginTop: '5px'
                }}>
                  {testResult.tests.apiKey.status === 'success' ? (
                    <div>
                      <p>
                        {testResult.tests.apiKey.warning === 'Rate limited' 
                          ? 'API key is valid but rate limited (this is normal for free tier usage)' 
                          : 'API key is valid and working correctly'}
                      </p>
                      {testResult.tests.apiKey.details && (
                        <pre style={{ 
                          backgroundColor: '#eee', 
                          padding: '10px', 
                          borderRadius: '4px',
                          overflowX: 'auto'
                        }}>
                          {JSON.stringify(testResult.tests.apiKey.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p>API key validation failed</p>
                      {testResult.tests.apiKey.details && (
                        <div>
                          <pre style={{ 
                            backgroundColor: '#eee', 
                            padding: '10px', 
                            borderRadius: '4px',
                            overflowX: 'auto',
                            marginBottom: '10px'
                          }}>
                            {JSON.stringify(testResult.tests.apiKey.details, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {testResult.tests.apiKey.details && testResult.tests.apiKey.details.troubleshooting && (
                        <div style={{ marginTop: '10px' }}>
                          <h5 style={{ marginBottom: '5px' }}>Troubleshooting Tips:</h5>
                          <ul style={{ marginLeft: '20px' }}>
                            {testResult.tests.apiKey.details.troubleshooting.map((tip, i) => (
                              <li key={i} style={{ marginBottom: '5px' }}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Fallback Mechanisms Test */}
              <div 
                onClick={() => toggleSection('fallbackMechanisms')}
                style={{
                  cursor: 'pointer',
                  padding: '8px',
                  backgroundColor: testResult.tests.fallbackMechanisms.status === 'success' ? '#c8e6c9' : '#ffcdd2',
                  borderRadius: '4px',
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>
                  <strong>3. Fallback Mechanisms</strong> {getStatusIcon(testResult.tests.fallbackMechanisms)}
                </span>
                <span>{expandedSection === 'fallbackMechanisms' ? '▼' : '▶'}</span>
              </div>
              
              {expandedSection === 'fallbackMechanisms' && (
                <div style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '10px', 
                  borderRadius: '4px',
                  marginTop: '5px'
                }}>
                  {testResult.tests.fallbackMechanisms.status === 'success' ? (
                    <div>
                      <p>Fallback mechanisms are working correctly</p>
                      {testResult.tests.fallbackMechanisms.details && (
                        <pre style={{ 
                          backgroundColor: '#eee', 
                          padding: '10px', 
                          borderRadius: '4px',
                          overflowX: 'auto'
                        }}>
                          {JSON.stringify(testResult.tests.fallbackMechanisms.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p>Fallback mechanisms test failed</p>
                      {testResult.tests.fallbackMechanisms.details && (
                        <pre style={{ 
                          backgroundColor: '#eee', 
                          padding: '10px', 
                          borderRadius: '4px',
                          overflowX: 'auto'
                        }}>
                          {JSON.stringify(testResult.tests.fallbackMechanisms.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Input Processing Test */}
              <div 
                onClick={() => toggleSection('inputProcessing')}
                style={{
                  cursor: 'pointer',
                  padding: '8px',
                  backgroundColor: testResult.tests.inputProcessing.status === 'success' ? '#c8e6c9' : '#ffcdd2',
                  borderRadius: '4px',
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>
                  <strong>4. Input Processing</strong> {getStatusIcon(testResult.tests.inputProcessing)}
                </span>
                <span>{expandedSection === 'inputProcessing' ? '▼' : '▶'}</span>
              </div>
              
              {expandedSection === 'inputProcessing' && (
                <div style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '10px', 
                  borderRadius: '4px',
                  marginTop: '5px'
                }}>
                  {testResult.tests.inputProcessing.status === 'success' ? (
                    <div>
                      <p>Input processing is working correctly for different input types</p>
                      {testResult.tests.inputProcessing.details && 
                       testResult.tests.inputProcessing.details.inputTests && (
                        <div>
                          {testResult.tests.inputProcessing.details.inputTests.map((test, index) => (
                            <div key={index} style={{ marginBottom: '15px' }}>
                              <h5 style={{ marginBottom: '5px' }}>Test {index + 1}: {test.inputType}</h5>
                              <p><strong>Input:</strong> "{test.input}"</p>
                              <pre style={{ 
                                backgroundColor: '#eee', 
                                padding: '10px', 
                                borderRadius: '4px',
                                overflowX: 'auto'
                              }}>
                                {JSON.stringify(test.result, null, 2)}
                              </pre>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p>Input processing test failed</p>
                      {testResult.tests.inputProcessing.details && (
                        <pre style={{ 
                          backgroundColor: '#eee', 
                          padding: '10px', 
                          borderRadius: '4px',
                          overflowX: 'auto'
                        }}>
                          {JSON.stringify(testResult.tests.inputProcessing.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {testResult.error && (
            <div>
              <div 
                onClick={() => toggleSection('error')}
                style={{
                  cursor: 'pointer',
                  padding: '8px',
                  backgroundColor: '#ffcdd2',
                  borderRadius: '4px',
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span><strong>Error Details</strong></span>
                <span>{expandedSection === 'error' ? '▼' : '▶'}</span>
              </div>
              
              {expandedSection === 'error' && (
                <div style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '10px', 
                  borderRadius: '4px',
                  marginTop: '5px'
                }}>
                  <p><strong>Error Message:</strong> {testResult.error.message}</p>
                  {testResult.error.status && <p><strong>Status Code:</strong> {testResult.error.status}</p>}
                  {testResult.error.data && (
                    <>
                      <p><strong>Response Data:</strong></p>
                      <pre style={{ 
                        backgroundColor: '#eee', 
                        padding: '10px', 
                        borderRadius: '4px',
                        overflowX: 'auto'
                      }}>
                        {JSON.stringify(testResult.error.data, null, 2)}
                      </pre>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {testResult && testResult.apiKeyInfo && (
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
          border: '1px solid #90caf9'
        }}>
          <h3 style={{ marginTop: '0' }}>API Key Information</h3>
          <p>{testResult.apiKeyInfo.note}</p>
          <ul style={{ textAlign: 'left' }}>
            {testResult.apiKeyInfo.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h3>How This Test Works</h3>
        <p>This test verifies the OpenRouter API integration by:</p>
        <ol style={{ textAlign: 'left' }}>
          <li><strong>API Connection:</strong> Checking if the OpenRouter API is reachable</li>
          <li><strong>API Key Validation:</strong> Verifying that the API key is valid and properly configured</li>
          <li><strong>Fallback Mechanisms:</strong> Testing if the fallback logic works when the API is unavailable</li>
          <li><strong>Input Processing:</strong> Ensuring that different types of user inputs are processed correctly</li>
        </ol>
        <p>These tests help ensure that the gratitude app can function even when there are issues with the LLM API.</p>
      </div>
    </div>
  );
};

export default ApiTest;
