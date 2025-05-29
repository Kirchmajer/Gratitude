import axios from 'axios';

/**
 * Test function to verify that entries can be saved to the database
 * This function:
 * 1. Creates a test gratitude entry
 * 2. Saves it to the database
 * 3. Retrieves the history to verify it was saved
 * 4. Deletes the test entry to clean up
 */
export const testDatabaseSave = async () => {
  console.log('Testing database save functionality...');
  
  const testEntry = {
    content: `Test gratitude entry - ${new Date().toISOString()}`,
    originalInput: 'test input',
    tone: 'test'
  };
  
  try {
    // Step 1: Save the test entry
    console.log('Saving test entry to database...');
    const saveResponse = await axios.post('/api/gratitude/save', testEntry);
    
    if (!saveResponse.data.success) {
      throw new Error('Failed to save entry');
    }
    
    const savedEntry = saveResponse.data.entry;
    console.log('Entry saved successfully with ID:', savedEntry.id);
    
    // Step 2: Retrieve history to verify the entry was saved
    console.log('Retrieving history to verify entry was saved...');
    const historyResponse = await axios.get('/api/gratitude/history');
    
    const entries = historyResponse.data.entries;
    const foundEntry = entries.find(entry => entry.id === savedEntry.id);
    
    if (!foundEntry) {
      throw new Error('Saved entry not found in history');
    }
    
    console.log('Entry verified in history');
    
    // Step 3: Delete the test entry to clean up
    console.log('Deleting test entry...');
    const deleteResponse = await axios.delete(`/api/gratitude/${savedEntry.id}`);
    
    if (!deleteResponse.data.success) {
      throw new Error('Failed to delete test entry');
    }
    
    console.log('Test entry deleted successfully');
    
    // Step 4: Verify the entry was deleted
    console.log('Verifying entry was deleted...');
    const verifyResponse = await axios.get('/api/gratitude/history');
    
    const entriesAfterDelete = verifyResponse.data.entries;
    const entryStillExists = entriesAfterDelete.some(entry => entry.id === savedEntry.id);
    
    if (entryStillExists) {
      throw new Error('Entry still exists after deletion');
    }
    
    console.log('Entry deletion verified');
    
    return {
      success: true,
      message: 'Database save test completed successfully',
      details: {
        entrySaved: true,
        entryVerified: true,
        entryDeleted: true,
        entryDeletionVerified: true
      }
    };
  } catch (error) {
    console.error('Database test failed:', error);
    
    let errorDetails = {
      message: error.message
    };
    
    if (error.response) {
      errorDetails.status = error.response.status;
      errorDetails.data = error.response.data;
    }
    
    return {
      success: false,
      message: 'Database save test failed',
      error: errorDetails
    };
  }
};
