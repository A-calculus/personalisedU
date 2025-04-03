import { GoogleGenAI } from '@google/genai';
import { PROFILE_PROMPT } from '../../prompts/profilePrompt';
import { profileFunctionDeclarations, getUserInfo, saveUserInfo } from './profileService';
import { createPlan, createPlanFunctionDeclaration } from './createPlanService';
import { createCalendar, createCalendarFunctionDeclaration } from './createCalendar';
import { getContext, addMessageToContext, updateContext } from './contextService';

// Configure the client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Function to handle function calls
const handleFunctionCall = async (functionCall, chatId) => {
  const { name, args } = functionCall;

  let result;
  switch (name) {
    case 'get_user_info':
      result = await getUserInfo(chatId);
      if (result) {
        updateContext(chatId, { userData: result });
        return {
          success: true,
          message: 'User information retrieved successfully',
          userData: result
        };
      } else {
        return {
          success: false,
          message: 'No user information found'
        };
      }
    case 'save_user_info':
      result = await saveUserInfo(chatId, args.userData);
      if (result) {
        updateContext(chatId, { userData: result });
        return {
          success: true,
          message: 'User information saved successfully',
          userData: result
        };
      } else {
        return {
          success: false,
          message: 'Failed to save user information'
        };
      }
    case 'create_plan':
      result = await createPlan(args.userData);
      if (result) {
        // Save the plan to the user's profile
        const userData = {
          ...args.userData,
          previous_plan: result
        };
        await saveUserInfo(chatId, userData);
        updateContext(chatId, { userData: `Personalised plan: ${result}` });
        return {
          success: true,
          message: 'Plan created successfully',
          plan: result
        };
      } else {
        return {
          success: false,
          message: 'Failed to create plan'
        };
      }
    case 'create_calendar':
      result = await createCalendar(chatId, args.personalisedPlan);
      if (result.success) {
        updateContext(chatId, { calendarPath: result.filePath });
        // Return a message with the calendar path
        return {
          success: true,
          message: `Calendar created successfully. You can download it from: ${result.filePath}`,
          filePath: result
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to create calendar'
        };
      }
    default:
      throw new Error(`Unknown function: ${name}`);
  }

  return result;
};

// Helper function to get text from response
const getResponseText = (response) => {
  try {
    if (response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) {
      return response.candidates[0].content.parts[0].text;
    }
    if (response.text) {
      return response.text;
    }
    return 'Sorry, I encountered an error processing the response.';
  } catch (error) {
    console.error('❌ Error getting response text:', error);
    return 'Sorry, I encountered an error processing the response.';
  }
};

export const processMessage = async (message, chatId) => {
  try {

    // Get or create context for this chat
    const context = getContext(chatId);
    
    // Add user message to context
    addMessageToContext(chatId, {
      role: 'user',
      content: message
    });

    // Build the prompt with context
    let fullPrompt = PROFILE_PROMPT;
    
    // Add user data if available
    if (context.userData) {
      fullPrompt += `\n\nCurrent user data:\n${JSON.stringify(context.userData, null, 2)}`;
    }

    // Add recent conversation history (last 20 messages)
    const recentMessages = context.messages.slice(-20);
    if (recentMessages.length > 0) {
      fullPrompt += '\n\nRecent conversation history:';
      recentMessages.forEach(msg => {
        fullPrompt += `\n${msg.role}: ${msg.content}`;
      });
    }

    // Add current message
    fullPrompt += `\n\nCurrent message: ${message}`;

    // Send request with function declarations
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ text: fullPrompt }],
      config: {
        tools: [{
          functionDeclarations: [
            profileFunctionDeclarations.getUserInfo,
            profileFunctionDeclarations.saveUserInfo,
            createPlanFunctionDeclaration,
            createCalendarFunctionDeclaration
          ]
        }],
      },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });


    // Check for function calls in the response
    if (response.functionCalls && response.functionCalls.length > 0) {
      
      // Process all function calls in parallel
      const functionCallPromises = response.functionCalls.map(async (functionCall) => {
        const result = await handleFunctionCall(functionCall, chatId);
        
        // Add function call and result to context
        addMessageToContext(chatId, {
          role: 'assistant',
          content: `Function ${functionCall.name} called with result: ${JSON.stringify(result)}`
        });
        
        return {
          functionName: functionCall.name,
          result
        };
      });
      
      // Wait for all function calls to complete
      const functionResults = await Promise.all(functionCallPromises);
      
      // Generate a response based on all function results
      
      let followUpPrompt = fullPrompt;
      
      // Add all function results to the prompt
      followUpPrompt += '\n\nFunction calls and their results:';
      functionResults.forEach(({ functionName, result }) => {
        followUpPrompt += `\n\nFunction ${functionName} was called with result: ${JSON.stringify(result)}`;
      });
      
      const followUpResponse = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ text: followUpPrompt }],
      });

      const followUpText = getResponseText(followUpResponse);

      // Add follow-up response to context
      addMessageToContext(chatId, {
        role: 'assistant',
        content: followUpText
      });

      return followUpText;
    }

    // Add direct response to context
    const responseText = getResponseText(response);
    addMessageToContext(chatId, {
      role: 'assistant',
      content: responseText
    });

    return responseText;
  } catch (error) {
    throw error;
  }
}; 