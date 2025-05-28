import { useState } from 'react';
import { useGratitude } from '../contexts/GratitudeContext';
import LoadingSpinner from './LoadingSpinner';
import '../styles/InputSection.css';

const InputSection = () => {
  const {
    loading,
    error,
    inputState,
    userInput,
    questions,
    suggestions,
    handleProcessInput,
    handleQuestionAnswer,
    handleSaveEntry,
    resetInputState
  } = useGratitude();

  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleProcessInput(input);
    setInput('');
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    handleQuestionAnswer(answer);
    setAnswer('');
  };

  const handleSuggestionSelect = (suggestion) => {
    handleSaveEntry(suggestion);
  };

  const renderInitialInput = () => (
    <div className="input-container">
      <h2>What are you grateful for today?</h2>
      <p className="instruction">
        Share anything from a single word to a full thought. 
        I'll help you refine it into a meaningful gratitude statement.
      </p>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="E.g., family, the sunny weather, my morning coffee..."
          rows={4}
          required
        />
        <div className="button-container">
          <button type="submit" className="primary-button" disabled={loading || !input.trim()}>
            {loading ? <LoadingSpinner size="small" /> : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderQuestions = () => (
    <div className="questions-container">
      <h2>Let's explore your gratitude more deeply</h2>
      <p className="original-input">You mentioned: <span>{userInput}</span></p>
      
      <div className="question-box">
        <p className="question">{questions[0]}</p>
        
        <form onSubmit={handleAnswerSubmit}>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer..."
            rows={3}
            required
          />
          <div className="button-container">
            <button type="button" className="secondary-button" onClick={resetInputState}>
              Start Over
            </button>
            <button type="submit" className="primary-button" disabled={loading || !answer.trim()}>
              {loading ? <LoadingSpinner size="small" /> : 'Continue'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="other-questions">
        <h3>Other questions to consider:</h3>
        <ul>
          {questions.slice(1).map((q, index) => (
            <li key={index}>{q}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderSuggestions = () => (
    <div className="suggestions-container">
      <h2>Choose your gratitude statement</h2>
      <p className="original-input">Based on: <span>{userInput}</span></p>
      
      <div className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className="suggestion-card"
            onClick={() => handleSuggestionSelect(suggestion)}
          >
            <p className="suggestion-text">{suggestion.text}</p>
            <span className="suggestion-tone">{suggestion.tone}</span>
          </div>
        ))}
      </div>
      
      <div className="button-container">
        <button className="secondary-button" onClick={resetInputState}>
          Start Over
        </button>
      </div>
    </div>
  );

  return (
    <section className="input-section">
      {error && <div className="error-message">{error}</div>}
      
      {inputState === 'initial' && renderInitialInput()}
      {inputState === 'questions' && renderQuestions()}
      {inputState === 'suggestions' && renderSuggestions()}
    </section>
  );
};

export default InputSection;
