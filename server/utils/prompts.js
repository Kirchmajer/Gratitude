/**
 * Centralized prompts for the Gratitude App
 * 
 * This file contains all the prompts used in the app, ensuring consistency
 * between the main application logic and testing components.
 */

const prompts = {
  /**
   * Prompt for analyzing gratitude input
   * @param {string} input - The user's input text
   * @returns {string} The formatted prompt
   */
  analyzeGratitudeInput: (input) => `
    You are an assistant helping users practice gratitude. Analyze the following input to determine if it's a properly composed "statement of gratitude":

    User Input: "${input}"

    A properly composed statement of gratitude must:
    1. The entire statement must be composed in the past tense.
    2. The statement must be reflective in nature, akin to a personal journal entry or a quiet contemplation. It must not be directly addressed to any specific person or entity (i.e., avoid using "you" or similar direct address pronouns). The gratitude is implicitly for the writer's own reflection or for a general, passive audience.
    3. The statement must deliberately omit any explicit phrases that directly state gratitude, such as "I appreciated," "I'm grateful for," "Thank you," "I was thankful for," or similar constructions. The feeling of gratitude should be implied by the positive impact described.
    4. The statement must describe a specific past action, quality, possession or situation that was beneficial or positive for the writer. This description should then be followed by a clear articulation of the resulting positive emotion or impact experienced by the writer. The beneficial action/quality should inherently convey why gratitude would be felt. The emotion/impact word should describe the writer's personal feeling or state.
    6. The statement must be clear and concise, avoiding verbose explanations, unnecessary jargon, or repetitive phrasing. Get straight to the point.
    7. The statement must avoid over-accentuating feelings. Use balanced and natural language to describe emotions, steering clear of overly dramatic, intense, or exaggerated emotional descriptors.

    Given the status can be described as: Polished: already a polished 'statement of gratitude'; Needs polishing: Isn't a polished 'statement of gratitude' but both a specific past action, quality, or situation that was beneficial or positive is discernible as well as a resulting positive emotion or impact experienced by the writer is discernible. This can therefore be converted into a polished 'statement of gratitude' by the LLM.; Needs more details: Isn't a polished 'statement of gratitude' and needs either a specific past action, quality, or situation that was beneficial or positive is discernible or a resulting positive emotion or impact experienced by the writer. The app needs to ask follow up questions to discern the specific past action, quality, or situation that was beneficial or positive and/or the resulting positive emotion or impact experienced by the writer. And then convert it into a polished 'statement of gratitude'.

    Respond with a JSON object:
    {
      "status": "polished" | "needs_polishing" | "needs_more_details",
      "has_past_tense": true | false,
      "has_reflective_style": true | false,
      "omits_explicit_gratitude": true | false,
      "has_beneficial_action": true | false,
      "has_positive_impact": true | false,
      "is_concise": true | false,
      "has_moderate_emotion": true | false,
      "missing_elements": ["list of missing elements"]
    }
  `,

  /**
   * Prompt for generating a targeted question based on what's missing from the input
   * @param {string} input - The user's input text
   * @param {boolean} needsBeneficialAction - Whether the input needs a beneficial action
   * @param {boolean} needsPositiveImpact - Whether the input needs a positive impact
   * @returns {string} The formatted prompt
   */
  generateTargetedQuestion: (input, needsBeneficialAction, needsPositiveImpact) => `
    You are a warm and empathetic guide, helping individuals deepen their practice of gratitude. The user has shared the following thought:
    
    "${input}"

    It appears there's an opportunity to explore a bit more about: ${needsBeneficialAction ? 'a specific past action, quality, possession, or situation that was helpful or positive for you' : ''}${(needsBeneficialAction && needsPositiveImpact) ? ' and ' : ''}${needsPositiveImpact ? 'how that experience made you feel or what positive impact it had on you' : ''}.

    To help you articulate your gratitude more fully, please offer ONE gentle, open-ended question. This question should encourage reflection and help them uncover the missing detail(s) in a thoughtful way.

    Simply provide the question, without any additional conversational text or explanation.
  `,

  /**
   * Prompt for generating gratitude statements
   * @param {string} input - The user's input text
   * @returns {string} The formatted prompt
   */
  generateGratitudeStatements: (input) => `
    You are an assistant helping users practice gratitude. Based on this input:

    "${input}"

    Generate three different "statements of gratitude" given, A properly composed statement of gratitude must:
      1. The entire statement must be composed in the past tense.
      2. The statement must be reflective in nature, akin to a personal journal entry or a quiet contemplation. It must not be directly addressed to any specific person or entity (i.e., avoid using "you" or similar direct address pronouns). The gratitude is implicitly for the writer's own reflection or for a general, passive audience.
      3. The statement must deliberately omit any explicit phrases that directly state gratitude, such as "I appreciated," "I'm grateful for," "Thank you," "I was thankful for," or similar constructions. The feeling of gratitude should be implied by the positive impact described.
      4. The statement must describe a specific past action, quality, possession, or situation that was beneficial or positive for the writer. This description should then be followed by a clear articulation of the resulting positive emotion or impact experienced by the writer. The beneficial action/quality should inherently convey why gratitude would be felt. The emotion/impact word should describe the writer's personal feeling or state.
      6. The statement must be clear and concise, avoiding verbose explanations, unnecessary jargon, or repetitive phrasing. Get straight to the point.
      7. The statement must avoid over-accentuating feelings. Use balanced and natural language to describe emotions, steering clear of overly dramatic, intense, or exaggerated emotional descriptors.

    Format your response as a JSON array of three strings, each containing a different statement formed with a warm, casual and positive tone.
  `
};

module.exports = prompts;
