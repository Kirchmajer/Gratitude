import axios from 'axios';

const API_URL = '/api/gratitude';

// Process user input
export const processInput = async (input) => {
  try {
    const response = await axios.post(`${API_URL}/process`, { input });
    return response.data;
  } catch (error) {
    console.error('Error processing input:', error);
    throw error;
  }
};

// Save a gratitude entry
export const saveEntry = async (content, originalInput, tone) => {
  try {
    const response = await axios.post(`${API_URL}/save`, {
      content,
      originalInput,
      tone
    });
    return response.data;
  } catch (error) {
    console.error('Error saving entry:', error);
    throw error;
  }
};

// Get all gratitude entries with retry logic
export const getHistory = async (retryCount = 0) => {
  try {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
  } catch (error) {
    console.error('Error getting history:', error);
    
    // If we get a network error or 5xx server error and haven't retried too many times, retry
    if ((error.code === 'ECONNABORTED' || 
         (error.response && error.response.status >= 500)) && 
        retryCount < 2) {
      console.log(`Retrying history fetch (attempt ${retryCount + 1})...`);
      
      // Wait a bit before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
      
      // Retry the request
      return getHistory(retryCount + 1);
    }
    
    throw error;
  }
};

// Delete a gratitude entry
export const deleteEntry = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
};

// Format date for display (date only, no time)
export const formatDate = (dateString) => {
  // Parse the ISO string into a Date object
  const date = new Date(dateString);
  
  // Format options for Australian locale - date only, no time
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  };
  
  // Use Australian locale for proper formatting
  return date.toLocaleString('en-AU', options);
};
