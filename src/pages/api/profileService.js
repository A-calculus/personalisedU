import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TABLE_NAME = 'user_profiles';

export const getUserInfo = async (chatId) => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('chat_id', chatId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('❌ Error in getUserInfo:', error);
    return null;
  }
};

export const saveUserInfo = async (chatId, userData) => {
  try {

    // First, check if the record exists
    const { data: existingData, error: checkError } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('chat_id', chatId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { 
      throw checkError;
    }

    let result;
    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({
          ...userData
        })
        .eq('chat_id', chatId)
        .select()
        .single();

      if (error) {
        throw error;
      }
      result = data;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert({
          chat_id: chatId,
          ...userData
        })
        .select()
        .single();

      if (error) {
        throw error;
      }
      result = data;
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Function declarations for Gemini API
export const profileFunctionDeclarations = {
  getUserInfo: {
    name: 'get_user_info',
    description: 'Retrieves user profile information from the database.',
    parameters: {
      type: 'object',
      properties: {
        chatId: {
          type: 'string',
          description: 'Telegram chat ID of the user'
        }
      },
      required: ['chatId']
    }
  },
  saveUserInfo: {
    name: 'save_user_info',
    description: 'Saves or updates user profile information in the database.',
    parameters: {
      type: 'object',
      properties: {
        chatId: {
          type: 'string',
          description: 'Telegram chat ID of the user'
        },
        userData: {
          type: 'object',
          properties: {
            basic_info: { type: 'string', description: 'Basic information about the user' },
            user_knowledge: { type: 'string', description: 'User\'s current knowledge and skills' },
            user_objectives: { type: 'string', description: 'User\'s goals and objectives' },
            program_info: { type: 'string', description: 'Information about the program' },
            user_schedule: { type: 'string', description: 'User\'s current schedule' },
            calendar_content: { type: 'string', description: 'Calendar events and commitments' },
            previous_plan: { type: 'string', description: 'The personalised plan, use N/A if not available' }
          },
          required: ['basic_info', 'user_knowledge', 'user_objectives', 'program_info', 'user_schedule', 'calendar_content', 'previous_plan']
        }
      },
      required: ['chatId', 'userData']
    }
  }
};