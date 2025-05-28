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

// Get all gratitude entries
export const getHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
  } catch (error) {
    console.error('Error getting history:', error);
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

// Format date for display
export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
