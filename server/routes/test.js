const express = require('express');
const TestController = require('../controllers/testController');

const router = express.Router();

// Test API connection
router.get('/connection', TestController.testConnection);

// Test API key validation
router.get('/api-key', TestController.testApiKey);

// Test fallback mechanisms
router.post('/fallback', TestController.testFallback);

// Test input analysis
router.post('/input-analysis', TestController.testInputAnalysis);

// Test targeted question generation
router.post('/targeted-question', TestController.testTargetedQuestion);

// Test gratitude statement generation
router.post('/gratitude-statements', TestController.testGratitudeStatements);

// Test processing different input types
router.post('/process-input', TestController.testProcessInput);

module.exports = router;
