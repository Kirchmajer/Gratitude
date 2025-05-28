const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Default headers for OpenRouter
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
  'HTTP-Referer': 'https://gratitude-app.com', // Replace with your actual domain in production
  'X-Title': 'Gratitude App'
};

class LLMService {
  // Analyze if input is complete or just keywords
  static async analyzeInput(input) {
    try {
      // Simple fallback logic: if input has fewer than 5 words, consider it incomplete
      const wordCount = input.trim().split(/\s+/).length;
      if (wordCount < 5) {
        console.log('Using fallback logic for input analysis: input is too short');
        return { complete: false };
      }
      
      // If input contains "I am grateful" or similar phrases, consider it complete
      if (input.toLowerCase().includes('grateful') || 
          input.toLowerCase().includes('thankful') || 
          input.toLowerCase().includes('appreciate')) {
        console.log('Using fallback logic for input analysis: input contains gratitude keywords');
        return { complete: true };
      }
      
      try {
        const prompt = `
          You are an assistant helping users practice gratitude. Analyze if the following input is a complete gratitude statement or just keywords/phrases that need elaboration:

          User Input: "${input}"

          If it's just keywords or too vague, respond with: {"complete": false}
          If it's a complete thought that can be refined, respond with: {"complete": true}
        `;

        const response = await axios.post(OPENROUTER_URL, {
          model: 'google/gemini-2.0-flash-exp:free', // Using the free Gemini model
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 50,
        }, { headers });

        const content = response.data.choices[0].message.content.trim();
        try {
          return JSON.parse(content);
        } catch (e) {
          console.error('Error parsing LLM response:', e);
          // Use our fallback logic
          console.log('Using fallback logic after parsing error');
          return wordCount >= 5 ? { complete: true } : { complete: false };
        }
      } catch (apiError) {
        console.error('API error in analyzeInput, using fallback:', apiError.message);
        // Use our fallback logic
        console.log('Using fallback logic after API error');
        return wordCount >= 5 ? { complete: true } : { complete: false };
      }
    } catch (error) {
      console.error('Error analyzing input with LLM:', error);
      // Don't throw, use a fallback
      return { complete: input.trim().split(/\s+/).length >= 5 };
    }
  }

  // Generate clarifying questions for vague input
  static async generateQuestions(input) {
    try {
      const prompt = `
        You are an assistant helping users practice gratitude. The user has provided a vague input about what they're grateful for: "${input}"

        Generate 3 thoughtful questions that would help them elaborate on this gratitude topic. Each question should help them explore different aspects of their gratitude and teach them to articulate their feelings better.

        Format your response as a JSON array of strings containing only the questions.
      `;

      try {
        const response = await axios.post(OPENROUTER_URL, {
          model: 'google/gemini-2.0-flash-exp:free', // Using the free Gemini model
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 250,
        }, { headers });

        const content = response.data.choices[0].message.content.trim();
        try {
          return JSON.parse(content);
        } catch (e) {
          console.error('Error parsing LLM questions response:', e);
          return this.getFallbackQuestions(input);
        }
      } catch (apiError) {
        console.error('API error in generateQuestions, using fallback:', apiError.message);
        return this.getFallbackQuestions(input);
      }
    } catch (error) {
      console.error('Error generating questions with LLM:', error);
      return this.getFallbackQuestions(input);
    }
  }

  // Fallback questions when API is unavailable
  static getFallbackQuestions(input) {
    const generalQuestions = [
      "Can you tell me more about why this makes you feel grateful?",
      "How has this positively impacted your life?",
      "What specific aspects of this are you most thankful for?"
    ];
    
    // Add some input-specific questions if possible
    if (input.toLowerCase().includes('family')) {
      return [
        "What family members are you particularly grateful for and why?",
        "Can you share a specific memory with your family that makes you feel thankful?",
        "How has your family supported you in ways that you appreciate?"
      ];
    } else if (input.toLowerCase().includes('friend')) {
      return [
        "What qualities in your friends are you most grateful for?",
        "Can you recall a moment when a friend was there for you in a meaningful way?",
        "How have your friendships enriched your life?"
      ];
    } else if (input.toLowerCase().includes('health')) {
      return [
        "What aspects of your health do you appreciate the most?",
        "How does being healthy allow you to do things you enjoy?",
        "Have you had experiences that made you especially grateful for your health?"
      ];
    }
    
    return generalQuestions;
  }

  // Generate refined gratitude sentences
  static async generateSentences(input) {
    try {
      const prompt = `
        You are an assistant helping users practice gratitude. Based on this gratitude input: "${input}", generate three refined gratitude statements:

        1) A concise, direct version (max 15 words)
        2) A poetic or reflective version (max 20 words)
        3) A casual, conversational version (max 15 words)

        Format your response as a JSON object with three keys: "concise", "poetic", and "conversational", each containing the respective statement.
      `;

      try {
        const response = await axios.post(OPENROUTER_URL, {
          model: 'google/gemini-2.0-flash-exp:free', // Using the free Gemini model
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 300,
        }, { headers });

        const content = response.data.choices[0].message.content.trim();
        try {
          return JSON.parse(content);
        } catch (e) {
          console.error('Error parsing LLM sentences response:', e);
          return this.getFallbackSentences(input);
        }
      } catch (apiError) {
        console.error('API error in generateSentences, using fallback:', apiError.message);
        return this.getFallbackSentences(input);
      }
    } catch (error) {
      console.error('Error generating sentences with LLM:', error);
      return this.getFallbackSentences(input);
    }
  }
  
  // Fallback sentences when API is unavailable
  static getFallbackSentences(input) {
    return {
      concise: "I'm grateful for " + input,
      poetic: "My heart fills with gratitude when I think about " + input,
      conversational: "You know what? I'm really thankful for " + input
    };
  }
}

module.exports = LLMService;
