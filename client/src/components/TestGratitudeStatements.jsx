import React, { useState } from 'react';
import axios from 'axios';
import '../styles/TestGratitudeStatements.css';

const TestGratitudeStatements = () => {
  const [input, setInput] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('/api/test/gratitude-statements', {
        input,
        customPrompt: customPrompt || undefined
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-gratitude-statements">
      <h1>Test Gratitude Statement Generation</h1>
      <p className="description">
        This tool helps you test and fine-tune the gratitude statement generation logic.
        Enter some text and see what statements are generated.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="input">Input Text:</label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter some text to generate statements from..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customPrompt">Custom Prompt (optional):</label>
          <textarea
            id="customPrompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter a custom prompt to override the default..."
            rows={6}
          />
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Processing...' : 'Generate Statements'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="result-container">
          <h2>Results</h2>
          
          <div className="result-section">
            <h3>Generated Statements</h3>
            <div className="statements-container">
              <div className="statements-group">
                <h4>Direct Method:</h4>
                <div className="statements-list">
                  {result.statements.direct.map((statement, index) => (
                    <div key={`direct-${index}`} className="statement-card">
                      <p>{statement}</p>
                      <span className="statement-number">Statement {index + 1}</span>
                    </div>
                  ))}
                </div>
                {result.extractionMethod && (
                  <div className="extraction-method">
                    <p><strong>Extraction Method:</strong> {result.extractionMethod}</p>
                  </div>
                )}
              </div>
              
              <div className="statements-group">
                <h4>Standard Method:</h4>
                <div className="statements-list">
                  {result.statements.standard.map((statement, index) => (
                    <div key={`standard-${index}`} className="statement-card">
                      <p>{statement}</p>
                      <span className="statement-number">Statement {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="result-section">
            <h3>Prompt Used</h3>
            <div className="code-block">
              <pre>{result.prompt.used}</pre>
            </div>
          </div>

          {result.rawResponse && (
            <div className="result-section">
              <h3>Raw API Response</h3>
              <div className="code-block">
                <pre>{JSON.stringify(result.rawResponse, null, 2)}</pre>
              </div>
            </div>
          )}

          {result.error && (
            <div className="result-section">
              <h3>API Error</h3>
              <div className="code-block">
                <pre>{JSON.stringify(result.error, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestGratitudeStatements;
