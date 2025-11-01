// src/utils/geminiAI.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Track if API has failed to avoid repeated attempts
// Reset this to false to allow retrying with the new API key
let apiFailed = false;

// Check if we have an API key before initializing
if (!API_KEY) {
  console.warn('Gemini API key is not configured. AI features will use fallback responses.');
}

// Note: If API key is not properly configured for specific models, 
// the system will fall back to simple analysis
// Using models compatible with various API versions (v1, v1alpha, v1beta, etc.)
// Prioritizing models that are more commonly available
// Including newer models based on documentation
const MODEL_NAMES = [
  "gemini-2.5-flash",
  "models/gemini-2.5-flash",
  "gemini-1.5-flash",
  "models/gemini-1.5-flash",
  "gemini-1.5-pro", 
  "models/gemini-1.5-pro",
  "gemini-1.0-pro",
  "models/gemini-1.0-pro",
  "gemini-pro",
  "models/gemini-pro"
];

// Simple fallback sentiment analysis using basic keyword matching
function simpleSentimentAnalysis(text) {
  const positiveWords = ['happy', 'good', 'great', 'excellent', 'wonderful', 'amazing', 'fantastic', 'love', 'like', 'enjoy', 'pleased', 'satisfied', 'blessed', 'grateful', 'thankful', 'joy', 'excited', 'thrilled', 'delighted'];
  const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'frustrated', 'anxious', 'worried', 'stressed', 'depressed', 'upset', 'disappointed', 'hurt', 'lonely', 'overwhelmed', 'struggling', 'tired', 'exhausted'];

  let positiveCount = 0;
  let negativeCount = 0;
  
  const words = text.toLowerCase().split(/\s+/);
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// Function to reset API failure state to allow retrying API calls
export const resetApiFailure = () => {
  apiFailed = false;
};

// Function to force retry API after configuration updates
export const forceApiRetry = () => {
  apiFailed = false;
};

// Function to add delay between API calls to avoid rate limits
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeSentiment = async (text) => {
  // If API has previously failed, use fallback directly
  if (apiFailed || !API_KEY) {
    return simpleSentimentAnalysis(text);
  }
  
  try {
    // Try to initialize the API and model
    const genAI = new GoogleGenerativeAI(API_KEY);
    let model = null;
    let modelName = null;
    
    // Try each model name until one works - simplified approach
    for (const name of MODEL_NAMES) {
      try {
        model = genAI.getGenerativeModel({ model: name });
        
        // Test the model with a simple generation to ensure it's working
        const result = await model.generateContent("Hello");
        const response = await result.response;
        
        modelName = name;
        break; // Found a working model, exit the loop
      } catch (e) {
        model = null; // Ensure model is null if this one fails
        await delay(200); // Add small delay between attempts to avoid rate limits
        continue;
      }
    }
    
    if (!model) {
      apiFailed = true; // Set flag to avoid repeated API attempts
      return simpleSentimentAnalysis(text);
    }
    
    // Now use the confirmed working model for the actual task
    try {
      const prompt = `Analyze the sentiment of the following text and respond with only one word: positive, negative, or neutral.\n\nText: "${text}"\n\nSentiment:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const sentiment = response.text().trim().toLowerCase();

      // Validate the response
      if (['positive', 'negative', 'neutral'].includes(sentiment)) {
        return sentiment;
      } else {
        // Default to neutral if the response is not one of the expected values
        return 'neutral';
      }
    } catch (generationError) {
      // If generation fails, set flag and use fallback
      apiFailed = true;
      return simpleSentimentAnalysis(text);
    }
  } catch (error) {
    apiFailed = true; // Set flag to avoid repeated API attempts
    // Use simple fallback on error
    return simpleSentimentAnalysis(text);
  }
};

export const generateEmpatheticResponse = async (userMessage, conversationHistory = []) => {
  // If API has previously failed, use fallback directly
  if (apiFailed || !API_KEY) {
    return getFallbackResponse(userMessage);
  }
  
  try {
    // Try to initialize the API and model
    const genAI = new GoogleGenerativeAI(API_KEY);
    let model = null;
    
    // Try each model name until one works - simplified approach
    for (const name of MODEL_NAMES) {
      try {
        model = genAI.getGenerativeModel({ model: name });
        
        // Test the model with a simple generation to ensure it's working
        const result = await model.generateContent("Hello");
        const response = await result.response;
        
        break; // Found a working model, exit the loop
      } catch (e) {
        model = null; // Ensure model is null if this one fails
        await delay(200); // Add small delay between attempts to avoid rate limits
        continue;
      }
    }
    
    if (!model) {
      apiFailed = true; // Set flag to avoid repeated API attempts
      return getFallbackResponse(userMessage);
    }
    
    // Now use the confirmed working model for the actual task
    try {
      // Prepare conversation context
      let context = `You are an empathetic AI mental health support assistant. Respond in a compassionate, understanding, and supportive way. Keep responses concise but meaningful. Focus on acknowledging the user's feelings and providing helpful guidance.\n\n`;
      
      if (conversationHistory.length > 0) {
        context += "Previous conversation:\n";
        conversationHistory.forEach((turn, index) => {
          context += `${turn.sender}: ${turn.text}\n`;
        });
        context += "\n";
      }
      
      context += `User: ${userMessage}\nAI Response:`;

      const result = await model.generateContent(context);
      const response = await result.response;
      const aiResponse = response.text().trim();
      
      return aiResponse;
    } catch (generationError) {
      // If generation fails, set flag and use fallback
      apiFailed = true;
      return getFallbackResponse(userMessage);
    }
  } catch (error) {
    apiFailed = true; // Set flag to avoid repeated API attempts
    return getFallbackResponse(userMessage);
  }
};

// Fallback function for empathetic responses
function getFallbackResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('stressed') || lowerMessage.includes('stress') || lowerMessage.includes('overwhelm')) {
    return "I can sense you're feeling stressed. It's completely normal to feel this way. Have you tried taking a few deep breaths or going for a short walk? Sometimes stepping away for a moment can help.";
  } else if (lowerMessage.includes('sad') || lowerMessage.includes('depress') || lowerMessage.includes('unhappy') || lowerMessage.includes('down')) {
    return "I'm sorry you're feeling down. Remember that difficult emotions are temporary. Have you considered talking to someone you trust about how you're feeling?";
  } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worry') || lowerMessage.includes('anxiety')) {
    return "Anxiety can be overwhelming, but you're not alone in this. Try to focus on your breathing and take things one step at a time. Would it help to talk about what's making you anxious?";
  } else if (lowerMessage.includes('happy') || lowerMessage.includes('excited') || lowerMessage.includes('great')) {
    return "I'm glad to hear something positive! It's wonderful that you're feeling good. Try to hold onto this feeling and maybe do something nice for yourself today.";
  } else {
    return "I'm here to listen. Could you tell me more about what you're feeling? Sometimes expressing our thoughts can be the first step toward feeling better.";
  }
}