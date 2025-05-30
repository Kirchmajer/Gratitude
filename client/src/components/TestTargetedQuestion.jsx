import React, { useState } from 'react';
import axios from 'axios';
import '../styles/TestTargetedQuestion.css';

const TestTargetedQuestion = () => {
  const [input, setInput] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [skipAnalysis, setSkipAnalysis] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('/api/test/targeted-question', {
        input,
        customPrompt: customPrompt || undefined,
        skipAnalysis
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-targeted-question" style={{ height: '65vh', overflowY: 'scroll', padding: '20px' }}>
      <h1>Test Targeted Question Generation</h1>
      <p className="description">
        This tool helps you test and fine-tune the targeted question generation logic.
        Enter some text and see what questions are generated based on the analysis.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="input">Input Text:</label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter some text to analyze..."
            required
            style={{ maxHeight: '100px' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="customPrompt">Custom Prompt (optional):</label>
          <textarea
            id="customPrompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter a custom prompt to override the default..."
            rows={4}
            style={{ maxHeight: '150px' }}
          />
        </div>

        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="skipAnalysis"
            checked={skipAnalysis}
            onChange={(e) => setSkipAnalysis(e.target.checked)}
          />
          <label htmlFor="skipAnalysis">
            Skip analysis (use mock analysis result)
          </label>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="submit-button"
          style={{ 
            marginTop: '20px', 
            display: 'block', 
            backgroundColor: '#2196F3', 
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Processing...' : '⚡ Generate Question ⚡'}
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
            <h3>Input Analysis</h3>
            <div className="code-block">
              <pre>{JSON.stringify(result.analysis, null, 2)}</pre>
            </div>
          </div>

          <div className="result-section">
            <h3>Generated Questions</h3>
            <div className="questions">
              <div className="question-card">
                <h4>Direct Question:</h4>
                <p>{result.question.direct}</p>
              </div>
              <div className="question-card">
                <h4>Standard Method Question:</h4>
                <p>{result.question.standard}</p>
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

export default TestTargetedQuestion;
