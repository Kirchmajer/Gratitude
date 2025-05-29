import React, { useState } from 'react';
import { testDatabaseSave } from '../utils/databaseTest';

const DatabaseTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const runTest = async () => {
    setLoading(true);
    try {
      const result = await testDatabaseSave();
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

  return (
    <div style={{ 
      margin: '20px', 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '5px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>Database Save Test</h2>
      <p>
        This component tests if gratitude entries can be successfully saved to and retrieved from the database.
        The test will:
      </p>
      <ol style={{ textAlign: 'left' }}>
        <li>Create a test gratitude entry</li>
        <li>Save it to the database</li>
        <li>Retrieve the history to verify it was saved</li>
        <li>Delete the test entry to clean up</li>
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
        {loading ? 'Testing...' : 'Test Database Save'}
      </button>
      
      {testResult && (
        <div style={{
          backgroundColor: testResult.success ? '#e8f5e9' : '#ffebee',
          padding: '15px',
          borderRadius: '4px',
          border: `1px solid ${testResult.success ? '#a5d6a7' : '#ef9a9a'}`
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: testResult.success ? '#2e7d32' : '#c62828' }}>
            {testResult.success ? 'Database Test Successful!' : 'Database Test Failed'}
          </h3>
          
          <p><strong>Status:</strong> {testResult.message}</p>
          
          {testResult.success ? (
            <div>
              <div 
                onClick={() => toggleSection('details')}
                style={{
                  cursor: 'pointer',
                  padding: '8px',
                  backgroundColor: '#c8e6c9',
                  borderRadius: '4px',
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span><strong>Test Details</strong></span>
                <span>{expandedSection === 'details' ? '▼' : '▶'}</span>
              </div>
              
              {expandedSection === 'details' && (
                <div style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '10px', 
                  borderRadius: '4px',
                  marginTop: '5px'
                }}>
                  <ul style={{ textAlign: 'left', margin: '0', paddingLeft: '20px' }}>
                    <li>Entry Saved: {testResult.details.entrySaved ? '✅' : '❌'}</li>
                    <li>Entry Verified in History: {testResult.details.entryVerified ? '✅' : '❌'}</li>
                    <li>Entry Deleted: {testResult.details.entryDeleted ? '✅' : '❌'}</li>
                    <li>Deletion Verified: {testResult.details.entryDeletionVerified ? '✅' : '❌'}</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
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
      
      <div style={{ marginTop: '20px' }}>
        <h3>How This Test Works</h3>
        <p>This test verifies the complete database operation cycle:</p>
        <ol style={{ textAlign: 'left' }}>
          <li>It creates a unique test entry with a timestamp</li>
          <li>Saves the entry to the database using the <code>/api/gratitude/save</code> endpoint</li>
          <li>Retrieves all entries using <code>/api/gratitude/history</code> to verify the entry was saved</li>
          <li>Deletes the test entry using <code>/api/gratitude/:id</code> to clean up</li>
          <li>Verifies the entry was successfully deleted</li>
        </ol>
        <p>If all steps complete successfully, the database functionality is working correctly.</p>
      </div>
    </div>
  );
};

export default DatabaseTest;
