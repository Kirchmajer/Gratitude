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
    question,
    statements,
    polishedStatement,
    questionIteration,
    maxIterationsMessage,
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

  const handleStatementSelect = (statement) => {
    handleSaveEntry(statement);
  };

  const renderInitialInput = () => (
    <div className="input-container">
      <h2>What are you grateful for today?</h2>
      <p className="instruction">
        Share anything from a single word to a full thought. 
        I'll help you refine it into a meaningful statement of gratitude.
      </p>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="E.g., family, the sunny weather, my morning coffee..."
          rows={4}
          maxLength={250}
          required
        />
        <div className="character-count">
          {input.length}/250 characters
        </div>
        <div className="button-container">
          <button type="submit" className="primary-button" disabled={loading || !input.trim()}>
            {loading ? <LoadingSpinner size="small" /> : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderQuestion = () => (
    <div className="question-container">
      <h2>Let's explore your gratitude more deeply</h2>
      <p className="original-input">You mentioned: <span>{userInput}</span></p>
      
      <div className="question-box">
        <p className="question">{question}</p>
        <p className="question-iteration">Question {questionIteration + 1} of 3</p>
        
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
    </div>
  );

  const renderPolishingOptions = () => (
    <div className="polishing-container">
      <h2>Choose your statement of gratitude</h2>
      <p className="original-input">Based on: <span>{userInput}</span></p>
      
      <div className="statements-list">
        {statements.map((statement, index) => (
          <div 
            key={index} 
            className="statement-card"
            onClick={() => handleStatementSelect(statement)}
          >
            <p className="statement-text">{statement}</p>
            <button className="select-button">Select</button>
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

  const renderPolishedStatement = () => (
    <div className="polished-container">
      <h2>Your Statement of Gratitude</h2>
      <p className="original-input">Based on: <span>{userInput}</span></p>
      
      <div className="polished-statement-card">
        <p className="polished-statement-text">{polishedStatement}</p>
        <div className="button-container">
          <button className="primary-button" onClick={() => handleSaveEntry(polishedStatement)}>
            Save to Journal
          </button>
          <button className="secondary-button" onClick={resetInputState}>
            Start Over
          </button>
        </div>
      </div>
    </div>
  );

  const renderMaxIterationsMessage = () => (
    <div className="max-iterations-container">
      <h2>Let's Take a Step Back</h2>
      <p className="max-iterations-message">{maxIterationsMessage}</p>
      
      <div className="button-container">
        <button className="primary-button" onClick={resetInputState}>
          Start Over
        </button>
      </div>
    </div>
  );

  return (
    <section className="input-section">
      {error && <div className="error-message">{error}</div>}
      
      {inputState === 'initial' && renderInitialInput()}
      {inputState === 'question' && renderQuestion()}
      {inputState === 'polishing' && renderPolishingOptions()}
      {inputState === 'polished' && renderPolishedStatement()}
      {inputState === 'max_iterations' && renderMaxIterationsMessage()}
    </section>
  );
};

export default InputSection;
