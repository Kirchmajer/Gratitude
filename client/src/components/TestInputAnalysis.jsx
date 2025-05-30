import React, { useState } from 'react';
import axios from 'axios';
import '../styles/TestInputAnalysis.css';

const TestInputAnalysis = () => {
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
      const response = await axios.post('/api/test/input-analysis', {
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
    <div className="test-input-analysis" style={{ maxHeight: '65vh', overflowY: 'scroll', padding: '20px'  }}>
      <h1>Test Input Analysis</h1>
      <p className="description">
        This tool helps you test and fine-tune the input analysis logic.
        Enter some text and see how it's analyzed.
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
          {loading ? 'Processing...' : '🔍 Analyze Input 🔍'}
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
            <h3>Analysis Results</h3>
            <div className="analysis-container">
              <div className="analysis-group">
                <h4>Direct Method:</h4>
                <div className="analysis-card">
                  <div className="analysis-status">
                    <span className="label">Status:</span>
                    <span className={`status-value ${result.analysis.direct.status}`}>
                      {result.analysis.direct.status}
                    </span>
                  </div>
                  <div className="analysis-details">
                    <div className="analysis-row">
                      <span className="label">Has Past Tense:</span>
                      <span className={result.analysis.direct.has_past_tense ? 'true' : 'false'}>
                        {result.analysis.direct.has_past_tense ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="analysis-row">
                      <span className="label">Has Reflective Style:</span>
                      <span className={result.analysis.direct.has_reflective_style ? 'true' : 'false'}>
                        {result.analysis.direct.has_reflective_style ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="analysis-row">
                      <span className="label">Omits Explicit Gratitude:</span>
                      <span className={result.analysis.direct.omits_explicit_gratitude ? 'true' : 'false'}>
                        {result.analysis.direct.omits_explicit_gratitude ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="analysis-row">
                      <span className="label">Has Beneficial Action:</span>
                      <span className={result.analysis.direct.has_beneficial_action ? 'true' : 'false'}>
                        {result.analysis.direct.has_beneficial_action ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="analysis-row">
                      <span className="label">Has Positive Impact:</span>
                      <span className={result.analysis.direct.has_positive_impact ? 'true' : 'false'}>
                        {result.analysis.direct.has_positive_impact ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="analysis-row">
                      <span className="label">Is Concise:</span>
                      <span className={result.analysis.direct.is_concise ? 'true' : 'false'}>
                        {result.analysis.direct.is_concise ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="analysis-row">
                      <span className="label">Has Moderate Emotion:</span>
                      <span className={result.analysis.direct.has_moderate_emotion ? 'true' : 'false'}>
                        {result.analysis.direct.has_moderate_emotion ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  {result.analysis.direct.missing_elements && result.analysis.direct.missing_elements.length > 0 && (
                    <div className="missing-elements">
                      <span className="label">Missing Elements:</span>
                      <ul>
                        {result.analysis.direct.missing_elements.map((element, index) => (
                          <li key={index}>{element}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="analysis-group">
                <h4>Standard Method:</h4>
                <div className="analysis-card">
                  <div className="analysis-status">
                    <span className="label">Status:</span>
                    <span className={`status-value ${result.analysis.standard.status}`}>
                      {result.analysis.standard.status}
                    </span>
                  </div>
                  <div className="analysis-details">
                    <div className="analysis-row">
                      <span className="label">Has Past Tense:</span>
                      <span className={result.analysis.standard.has_past_tense ? 'true' : 'false'}>
                        {result.analysis.standard.has_past_tense ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="analysis-row">
                      <span className="label">Has Reflective Style:</span>
                      <span className={result.analysis.standard.has_reflective_style ? 'true' : 'false'}>
                        {result.analysis.standard.has_reflective_style ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="analysis-row">
                      <span className="label">Omits Explicit Gratitude:</span>
                      <span className={result.analysis.standard.omits_explicit_gratitude ? 'true' : 'false'}>
                        {result.analysis.standard.omits_explicit_gratitude ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="analysis-row">
                      <span className="label">Has Beneficial Action:</span>
                      <span className={result.analysis.standard.has_beneficial_action ? 'true' : 'false'}>
                        {result.analysis.standard.has_beneficial_action ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="analysis-row">
                      <span className="label">Has Positive Impact:</span>
                      <span className={result.analysis.standard.has_positive_impact ? 'true' : 'false'}>
                        {result.analysis.standard.has_positive_impact ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="analysis-row">
                      <span className="label">Is Concise:</span>
                      <span className={result.analysis.standard.is_concise ? 'true' : 'false'}>
                        {result.analysis.standard.is_concise ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="analysis-row">
                      <span className="label">Has Moderate Emotion:</span>
                      <span className={result.analysis.standard.has_moderate_emotion ? 'true' : 'false'}>
                        {result.analysis.standard.has_moderate_emotion ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  {result.analysis.standard.missing_elements && result.analysis.standard.missing_elements.length > 0 && (
                    <div className="missing-elements">
                      <span className="label">Missing Elements:</span>
                      <ul>
                        {result.analysis.standard.missing_elements.map((element, index) => (
                          <li key={index}>{element}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="legacy-analysis">
              <h4>Legacy Analysis:</h4>
              <div className="legacy-card">
                <div className="analysis-row">
                  <span className="label">Complete:</span>
                  <span className={result.analysis.legacy.complete ? 'true' : 'false'}>
                    {result.analysis.legacy.complete ? 'Yes' : 'No'}
                  </span>
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

export default TestInputAnalysis;
