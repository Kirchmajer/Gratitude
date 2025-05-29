import { createContext, useState, useEffect, useContext } from 'react';
import { processInput, saveEntry, getHistory, deleteEntry } from '../utils/api';

// Create context
const GratitudeContext = createContext();

// Custom hook to use the context
export const useGratitude = () => useContext(GratitudeContext);

export const GratitudeProvider = ({ children }) => {
  // State for gratitude entries
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for input process
  const [inputState, setInputState] = useState('initial'); // 'initial', 'questions', 'suggestions'
  const [userInput, setUserInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [originalInput, setOriginalInput] = useState('');

  // Fetch history on component mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // Track if a fetch is in progress to prevent duplicate calls
  const [isFetching, setIsFetching] = useState(false);
  
  // Fetch gratitude history with debounce to prevent multiple simultaneous calls
  const fetchHistory = async () => {
    // If already fetching, don't start another fetch
    if (isFetching) return;
    
    try {
      setIsFetching(true);
      setLoading(true);
      
      const data = await getHistory();
      
      // Only update entries if we got valid data
      if (data && data.entries) {
        setEntries(data.entries);
        // Only clear error if we successfully got entries
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      // Only set error if we don't have entries yet
      if (entries.length === 0) {
        setError('Failed to fetch gratitude history');
      }
      // Re-throw the error so it can be caught by the component
      throw err;
    } finally {
      setLoading(false);
      // Add a small delay before allowing another fetch
      setTimeout(() => {
        setIsFetching(false);
      }, 1000);
    }
  };

  // Process user input
  const handleProcessInput = async (input) => {
    if (!input.trim()) return;
    
    try {
      setLoading(true);
      setUserInput(input);
      
      const response = await processInput(input);
      
      if (response.needsMore) {
        // If input needs more elaboration, show questions
        setQuestions(response.questions);
        setOriginalInput(response.originalInput);
        setInputState('questions');
      } else {
        // If input is complete, show suggestions
        setSuggestions(response.suggestions);
        setOriginalInput(response.originalInput);
        setInputState('suggestions');
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to process input');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle user's answer to a clarifying question
  const handleQuestionAnswer = async (answer) => {
    // Combine original input with the answer
    const combinedInput = `${originalInput} - ${answer}`;
    await handleProcessInput(combinedInput);
  };

  // Save selected gratitude entry
  const handleSaveEntry = async (suggestion) => {
    try {
      setLoading(true);
      setSelectedSuggestion(suggestion);
      
      await saveEntry(suggestion.text, originalInput, suggestion.tone);
      
      // Reset input state
      resetInputState();
      
      // Refresh history
      await fetchHistory();
      
      setError(null);
    } catch (err) {
      setError('Failed to save entry');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a gratitude entry
  const handleDeleteEntry = async (id) => {
    try {
      setLoading(true);
      await deleteEntry(id);
      
      // Update entries list
      setEntries(entries.filter(entry => entry.id !== id));
      
      setError(null);
    } catch (err) {
      setError('Failed to delete entry');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset input state
  const resetInputState = () => {
    setInputState('initial');
    setUserInput('');
    setQuestions([]);
    setSuggestions([]);
    setSelectedSuggestion(null);
    setOriginalInput('');
  };

  // Context value
  const value = {
    entries,
    loading,
    error,
    inputState,
    userInput,
    questions,
    suggestions,
    selectedSuggestion,
    handleProcessInput,
    handleQuestionAnswer,
    handleSaveEntry,
    handleDeleteEntry,
    resetInputState,
    fetchHistory
  };

  return (
    <GratitudeContext.Provider value={value}>
      {children}
    </GratitudeContext.Provider>
  );
};
