const MULTIAGENT_API_URL = 'https://multiagent.aixblock.io/api/v1';

export const createPlan = async (userData) => {
  try {
    
    // First, send the POST request to create the plan
    const response = await fetch(`${MULTIAGENT_API_URL}/execute/result/67c524b951643fd40c0d4d1f`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        basic_info: userData.basic_info,
        user_knowledge: userData.user_knowledge,
        user_objectives: userData.user_objectives,
        program_info: userData.program_info,
        user_schedule: userData.user_schedule,
        calendar_content: userData.calendar_content,
        webhook: 'N/A'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    if (!responseData.Task_id) {
      throw new Error('No Task_id in response');
    }


    // Poll for the result
    let result = null;
    let attempts = 0;
    const maxAttempts = 10; // Maximum number of polling attempts
    const pollInterval = 30000; // Poll every 1 minute

    while (attempts < maxAttempts && !result) {
      const resultResponse = await fetch(`${MULTIAGENT_API_URL}/session/result/${responseData.Task_id}`);
      
      if (!resultResponse.ok) {
        throw new Error(`HTTP error! status: ${resultResponse.status}`);
      }

      const resultData = await resultResponse.json();
      
      if (resultData.status === 'Completed') {
        result = resultData.result.result;
        break;
      }

      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      attempts++;
    }

    if (!result) {
      console.error('⏰ Timeout waiting for plan creation result');
      throw new Error('Timeout waiting for plan creation result');
    }

    return result;
  } catch (error) {
    console.error('❌ Error in createPlan:', error);
    throw error;
  }
};

// Function declaration for Gemini API
export const createPlanFunctionDeclaration = {
  name: 'create_plan',
  description: 'Creates a personalized development plan using the multiagent API.',
  parameters: {
    type: 'object',
    properties: {
      userData: {
        type: 'object',
        properties: {
          basic_info: { type: 'string', description: 'Basic information about the user' },
          user_knowledge: { type: 'string', description: 'User\'s current knowledge and skills' },
          user_objectives: { type: 'string', description: 'User\'s goals and objectives' },
          program_info: { type: 'string', description: 'Information about the program' },
          user_schedule: { type: 'string', description: 'User\'s current schedule' },
          calendar_content: { type: 'string', description: 'Calendar events and commitments' }
        },
        required: ['basic_info', 'user_knowledge', 'user_objectives', 'program_info', 'user_schedule', 'calendar_content']
      }
    },
    required: ['userData']
  }
}; 