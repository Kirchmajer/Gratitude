const axios = require('axios');
const dotenv = require('dotenv');
const prompts = require('../utils/prompts');
const llmConfig = require('../utils/llmConfig');

dotenv.config();

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = llmConfig.OPENROUTER_URL;
const DEFAULT_MODEL = llmConfig.DEFAULT_MODEL;

// Default headers for OpenRouter
const headers = llmConfig.getHeaders(OPENROUTER_API_KEY);

// Log the model being used
console.log(`Using LLM model: ${DEFAULT_MODEL}`);

class LLMService {
  // Analyze if input is complete or just keywords (legacy method name kept for compatibility)
  static async analyzeInput(input) {
    const analysis = await this.analyzeGratitudeInput(input);
    return { 
      complete: analysis.status !== "needs_more_details" 
    };
  }

  // Analyze gratitude input to determine if it's polished, needs polishing, or needs more details
  static async analyzeGratitudeInput(input) {
    try {
      // Simple fallback logic for very short inputs
      const wordCount = input.trim().split(/\s+/).length;
      if (wordCount < 3) {
        console.log('Using fallback logic for input analysis: input is too short');
        return { 
          status: "needs_more_details",
          has_past_tense: false,
          has_reflective_style: false,
          omits_explicit_gratitude: true,
          has_beneficial_action: false,
          has_positive_impact: false,
          is_concise: true,
          has_moderate_emotion: true,
          missing_elements: ["beneficial action", "positive impact"]
        };
      }
      
      try {
        const prompt = prompts.analyzeGratitudeInput(input);

        const response = await axios.post(OPENROUTER_URL, {
          model: DEFAULT_MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: llmConfig.temperatures.analyzeGratitudeInput,
          max_tokens: llmConfig.tokenLimits.analyzeGratitudeInput,
          // Some models don't support response_format, so we'll handle parsing errors gracefully
          ...(DEFAULT_MODEL.includes('openai') ? { response_format: { type: "json_object" } } : {})
        }, { headers });

        const content = response.data.choices[0].message.content.trim();
        console.log('Raw LLM response:', content);
        
        try {
          // Try to extract JSON from the response if it's not already valid JSON
          let jsonStr = content;
          
          // If the response contains a JSON object within markdown code blocks, extract it
          const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            jsonStr = jsonMatch[1];
          }
          
          // If the response starts with text before the JSON, try to find the JSON part
          if (!jsonStr.startsWith('{')) {
            const jsonStartIndex = jsonStr.indexOf('{');
            if (jsonStartIndex !== -1) {
              jsonStr = jsonStr.substring(jsonStartIndex);
            }
          }
          
          const result = JSON.parse(jsonStr);
          console.log('Parsed analysis result:', result);
          
          // Ensure the result has the expected structure
          if (!result.status) {
            console.warn('LLM response missing status field, using fallback');
            return this.getFallbackAnalysis(input);
          }
          
          return result;
        } catch (e) {
          console.error('Error parsing LLM response:', e);
          // Use our fallback logic
          console.log('Using fallback logic after parsing error');
          return this.getFallbackAnalysis(input);
        }
      } catch (apiError) {
        console.error('API error in analyzeGratitudeInput, using fallback:', apiError.message);
        // Use our fallback logic
        console.log('Using fallback logic after API error');
        return this.getFallbackAnalysis(input);
      }
    } catch (error) {
      console.error('Error analyzing gratitude input with LLM:', error);
      // Don't throw, use a fallback
      return this.getFallbackAnalysis(input);
    }
  }

  // Fallback analysis when API is unavailable
  static getFallbackAnalysis(input) {
    const wordCount = input.trim().split(/\s+/).length;
    const hasPastTense = /\b(was|were|had|felt|made|did|gave|helped|created|allowed|enabled)\b/i.test(input);
    const hasReflectiveStyle = !/(you|your)\b/i.test(input);
    const omitsExplicitGratitude = !/(grateful|thankful|appreciate|thank|thanks)\b/i.test(input);
    const hasBeneficialAction = /(helped|supported|gave|offered|provided|shared|taught|showed|created|made)\b/i.test(input);
    const hasPositiveImpact = /(happy|joy|peace|calm|relief|comfort|strength|confidence|inspired|motivated|empowered|felt|feeling)\b/i.test(input);
    
    const missingElements = [];
    if (!hasPastTense) missingElements.push("past tense");
    if (!hasReflectiveStyle) missingElements.push("reflective style");
    if (!omitsExplicitGratitude) missingElements.push("omission of explicit gratitude phrases");
    if (!hasBeneficialAction) missingElements.push("beneficial action/quality/situation");
    if (!hasPositiveImpact) missingElements.push("positive emotion/impact");
    
    // Determine status based on missing elements
    let status;
    if (missingElements.length === 0 && wordCount >= 5) {
      status = "polished";
    } else if ((hasBeneficialAction && hasPositiveImpact) || wordCount >= 10) {
      status = "needs_polishing";
    } else {
      status = "needs_more_details";
    }
    
    return {
      status,
      has_past_tense: hasPastTense,
      has_reflective_style: hasReflectiveStyle,
      omits_explicit_gratitude: omitsExplicitGratitude,
      has_beneficial_action: hasBeneficialAction,
      has_positive_impact: hasPositiveImpact,
      is_concise: wordCount <= 30,
      has_moderate_emotion: true, // Hard to determine without LLM
      missing_elements: missingElements
    };
  }

  // Generate clarifying questions (legacy method name kept for compatibility)
  static async generateQuestions(input) {
    const question = await this.generateTargetedQuestion(input);
    return [question, 
      "Can you describe how this made you feel?", 
      "What specific aspects of this experience stood out to you?"
    ];
  }

  // Generate a targeted question based on what's missing from the input
  static async generateTargetedQuestion(input, analysisResult = null) {
    try {
      // If no analysis result is provided, analyze the input first
      if (!analysisResult) {
        analysisResult = await this.analyzeGratitudeInput(input);
      }
      
      // Determine what's missing
      const missingElements = analysisResult.missing_elements || [];
      const needsBeneficialAction = !analysisResult.has_beneficial_action;
      const needsPositiveImpact = !analysisResult.has_positive_impact;
      
      try {
        const prompt = prompts.generateTargetedQuestion(input, needsBeneficialAction, needsPositiveImpact);

        const response = await axios.post(OPENROUTER_URL, {
          model: DEFAULT_MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: llmConfig.temperatures.generateTargetedQuestion,
          max_tokens: llmConfig.tokenLimits.generateTargetedQuestion,
        }, { headers });

        const content = response.data.choices[0].message.content.trim();
        return content;
      } catch (apiError) {
        console.error('API error in generateTargetedQuestion, using fallback:', apiError.message);
        return this.getFallbackTargetedQuestion(input, needsBeneficialAction, needsPositiveImpact);
      }
    } catch (error) {
      console.error('Error generating targeted question with LLM:', error);
      return this.getFallbackTargetedQuestion(input);
    }
  }

  // Fallback targeted question when API is unavailable
  static getFallbackTargetedQuestion(input, needsBeneficialAction = true, needsPositiveImpact = true) {
    // Default questions based on what's missing
    if (needsBeneficialAction && needsPositiveImpact) {
      return "Can you describe a specific situation related to this that had a positive impact on you?";
    } else if (needsBeneficialAction) {
      return "Can you share a specific example or situation related to this?";
    } else if (needsPositiveImpact) {
      return "How did this make you feel or what positive impact did it have on you?";
    }
    
    // Topic-specific questions if we can detect the topic
    if (input.toLowerCase().includes('family')) {
      return "Can you share a specific memory with your family that had a positive impact on you?";
    } else if (input.toLowerCase().includes('friend')) {
      return "Can you recall a specific moment when a friend was there for you and how it made you feel?";
    } else if (input.toLowerCase().includes('work') || input.toLowerCase().includes('job')) {
      return "Can you describe a specific work accomplishment and how it affected you positively?";
    } else if (input.toLowerCase().includes('nature') || input.toLowerCase().includes('outside')) {
      return "Can you describe a specific moment in nature that brought you joy or peace?";
    }
    
    // General fallback
    return "Can you share more details about a specific moment related to this and how it made you feel?";
  }

  // Generate gratitude statements following the new guidelines
  static async generateGratitudeStatements(input) {
    try {
      const prompt = prompts.generateGratitudeStatements(input);

      try {
        const response = await axios.post(OPENROUTER_URL, {
          model: DEFAULT_MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: llmConfig.temperatures.generateGratitudeStatements,
          max_tokens: llmConfig.tokenLimits.generateGratitudeStatements,
          ...(DEFAULT_MODEL.includes('openai') ? { response_format: { type: "json_object" } } : {})
        }, { headers });

        const content = response.data.choices[0].message.content.trim();
        console.log('Raw gratitude statements response:', content);
        
        try {
          // Try to extract JSON from the response if it's not already valid JSON
          let jsonStr = content;
          
          // If the response contains a JSON array within markdown code blocks, extract it
          const jsonMatch = content.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            jsonStr = jsonMatch[1];
          }
          
          // If the response starts with text before the JSON, try to find the JSON part
          if (!jsonStr.startsWith('[')) {
            const jsonStartIndex = jsonStr.indexOf('[');
            if (jsonStartIndex !== -1) {
              jsonStr = jsonStr.substring(jsonStartIndex);
              // Find the matching closing bracket
              let bracketCount = 0;
              let endIndex = -1;
              for (let i = 0; i < jsonStr.length; i++) {
                if (jsonStr[i] === '[') bracketCount++;
                if (jsonStr[i] === ']') bracketCount--;
                if (bracketCount === 0) {
                  endIndex = i + 1;
                  break;
                }
              }
              if (endIndex !== -1) {
                jsonStr = jsonStr.substring(0, endIndex);
              }
            }
          }
          
          const result = JSON.parse(jsonStr);
          console.log('Parsed gratitude statements:', result);
          
          // Ensure the result is an array
          if (!Array.isArray(result)) {
            console.warn('LLM response is not an array, using fallback');
            return this.getFallbackGratitudeStatements(input);
          }
          
          // Ensure we have at least 3 statements
          if (result.length < 3) {
            console.warn('LLM response has fewer than 3 statements, adding fallbacks');
            const fallbacks = this.getFallbackGratitudeStatements(input);
            return [...result, ...fallbacks].slice(0, 3);
          }
          
          return result.slice(0, 3); // Ensure we only return 3 statements
        } catch (e) {
          console.error('Error parsing LLM gratitude statements response:', e);
          return this.getFallbackGratitudeStatements(input);
        }
      } catch (apiError) {
        console.error('API error in generateGratitudeStatements, using fallback:', apiError.message);
        return this.getFallbackGratitudeStatements(input);
      }
    } catch (error) {
      console.error('Error generating gratitude statements with LLM:', error);
      return this.getFallbackGratitudeStatements(input);
    }
  }
  
  // Fallback gratitude statements when API is unavailable
  static getFallbackGratitudeStatements(input) {
    const cleanInput = input.replace(/I('m| am) (grateful|thankful) for /i, "").replace(/thank you for /i, "");
    
    return [
      `The ${cleanInput} provided a moment of unexpected joy in an otherwise routine day.`,
      `That experience with ${cleanInput} created a sense of peace that lingered throughout the day.`,
      `The time spent with ${cleanInput} brought a renewed perspective on what truly matters.`
    ];
  }

  // Generate refined gratitude sentences (legacy method name kept for compatibility)
  static async generateSentences(input) {
    const statements = await this.generateGratitudeStatements(input);
    return {
      concise: statements[0],
      poetic: statements[1],
      conversational: statements[2]
    };
  }
}

module.exports = LLMService;
