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
  // 'initial', 'question', 'polishing', 'polished', 'max_iterations'
  const [inputState, setInputState] = useState('initial'); 
  const [userInput, setUserInput] = useState('');
  const [question, setQuestion] = useState('');
  const [statements, setStatements] = useState([]);
  const [polishedStatement, setPolishedStatement] = useState('');
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [originalInput, setOriginalInput] = useState('');
  const [questionIteration, setQuestionIteration] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [maxIterationsMessage, setMaxIterationsMessage] = useState('');

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
  const handleProcessInput = async (input, iteration = 0, originalInputText = null) => {
    if (!input.trim()) return;
    
    try {
      setLoading(true);
      setUserInput(input);
      
      const response = await processInput({
        input, 
        questionIteration: iteration,
        originalInput: originalInputText
      });
      
      console.log('Process input response:', response);
      
      if (response.status === "needs_more_details") {
        // If input needs more details, show the targeted question
        setQuestion(response.question);
        setOriginalInput(response.originalInput);
        setQuestionIteration(response.questionIteration);
        setAnalysisResult(response.analysis);
        setInputState('question');
      } else if (response.status === "needs_polishing") {
        // If input needs polishing, show statement options
        setStatements(response.statements);
        setOriginalInput(response.originalInput);
        setAnalysisResult(response.analysis);
        setInputState('polishing');
      } else if (response.status === "polished") {
        // If input is already polished, show it directly
        setPolishedStatement(response.statement);
        setOriginalInput(response.originalInput);
        setInputState('polished');
      } else if (response.status === "max_iterations") {
        // If we've reached max iterations, show message
        setMaxIterationsMessage(response.message);
        setOriginalInput(response.originalInput);
        setInputState('max_iterations');
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
    // Increment iteration counter
    const newIteration = questionIteration + 1;
    setQuestionIteration(newIteration);
    
    // Combine original input with the answer
    const combinedInput = `${originalInput} - ${answer}`;
    
    // Process with iteration count
    await handleProcessInput(combinedInput, newIteration, originalInput);
  };

  // Save selected gratitude statement
  const handleSaveEntry = async (statement) => {
    try {
      setLoading(true);
      setSelectedStatement(statement);
      
      // Save without a tone since we're not using tones anymore
      await saveEntry(statement, originalInput, null);
      
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
    setQuestion('');
    setStatements([]);
    setPolishedStatement('');
    setSelectedStatement(null);
    setOriginalInput('');
    setQuestionIteration(0);
    setAnalysisResult(null);
    setMaxIterationsMessage('');
  };

  // Context value
  const value = {
    entries,
    loading,
    error,
    inputState,
    userInput,
    question,
    statements,
    polishedStatement,
    selectedStatement,
    questionIteration,
    analysisResult,
    maxIterationsMessage,
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
