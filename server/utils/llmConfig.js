/**
 * Centralized LLM configuration for the Gratitude App
 * 
 * This file contains all the configuration parameters for the LLM,
 * ensuring consistency between the main application logic and testing components.
 */

const llmConfig = {
  // Default model to use
  DEFAULT_MODEL: process.env.LLM_MODEL || 'google/gemini-2.0-flash-exp:free',
  
  // OpenRouter API URL
  OPENROUTER_URL: 'https://openrouter.ai/api/v1/chat/completions',
  
  // Token limits for different prompt types
  tokenLimits: {
    // Analysis prompts need moderate token count for JSON responses
    analyzeGratitudeInput: 500,
    
    // Question generation needs enough tokens for thoughtful questions
    generateTargetedQuestion: 500,
    
    // Statement generation needs more tokens to generate multiple statements
    generateGratitudeStatements: 1000,
    
    // Simple API validation needs minimal tokens
    apiValidation: 10
  },
  
  // Temperature settings for different prompt types
  temperatures: {
    // Analysis needs lower temperature for consistent, factual responses
    analyzeGratitudeInput: 0.3,
    
    // Question generation needs moderate temperature for creative but focused questions
    generateTargetedQuestion: 0.7,
    
    // Statement generation needs higher temperature for varied, creative statements
    generateGratitudeStatements: 0.7,
    
    // API validation needs low temperature for consistent responses
    apiValidation: 0.3
  },
  
  // Default headers for OpenRouter
  getHeaders: (apiKey) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'HTTP-Referer': 'https://gratitude-app.com', // Replace with your actual domain in production
    'X-Title': 'Gratitude App'
  })
};

module.exports = llmConfig;
