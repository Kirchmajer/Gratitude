const express = require('express');
const GratitudeController = require('../controllers/gratitudeController');

const router = express.Router();

// Process user input
router.post('/process', GratitudeController.processInput);

// Save a gratitude entry
router.post('/save', GratitudeController.saveEntry);

// Get all gratitude entries
router.get('/history', GratitudeController.getHistory);

// Delete a gratitude entry
router.delete('/:id', GratitudeController.deleteEntry);

module.exports = router;
