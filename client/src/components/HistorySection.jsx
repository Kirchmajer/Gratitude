import { useEffect, useState } from 'react';
import { useGratitude } from '../contexts/GratitudeContext';
import { formatDate } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';
import '../styles/HistorySection.css';

const HistorySection = () => {
  const { entries, loading, error, fetchHistory, handleDeleteEntry } = useGratitude();
  const [localError, setLocalError] = useState(null);
  
  // Only fetch history if we don't already have entries
  useEffect(() => {
    if (entries.length === 0 && !loading && !error) {
      fetchHistory().catch(err => {
        setLocalError('Failed to fetch gratitude history');
      });
    }
  }, [entries.length, fetchHistory, loading, error]);

  // Use a local error state that won't be cleared by the context
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);
  
  if (loading && entries.length === 0) {
    return (
      <section className="history-section">
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading your gratitude journal...</p>
        </div>
      </section>
    );
  }

  if (localError && entries.length === 0) {
    return (
      <section className="history-section">
        <div className="error-message">
          <p>{localError}</p>
          <button 
            className="primary-button" 
            onClick={() => {
              setLocalError(null);
              fetchHistory().catch(err => {
                setLocalError('Failed to fetch gratitude history');
              });
            }}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (entries.length === 0) {
    return (
      <section className="history-section">
        <div className="empty-state">
          <h2>Your Gratitude Journal</h2>
          <p>You haven't saved any gratitude entries yet.</p>
          <p>Start by creating a new entry to begin your gratitude practice.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="history-section">
      <h2>Your Gratitude Journal</h2>
      <p className="history-intro">
        Reflecting on past moments of gratitude can amplify their positive effects.
      </p>
      
      <div className="entries-list">
        {entries.map((entry) => (
          <div key={entry.id} className="entry-card">
            <div className="entry-header">
              <span className="entry-date">{formatDate(entry.created_at)}</span>
            </div>
            
            <p className="entry-content">{entry.content}</p>
            
            <button 
              className="delete-button" 
              onClick={() => handleDeleteEntry(entry.id)}
              aria-label="Delete entry"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      {loading && <div className="loading-more"><LoadingSpinner size="small" /></div>}
    </section>
  );
};

export default HistorySection;
