import { supabase } from '../../lib/supabase.js';
import { getUserInfo } from './profileService.js';

const MULTIAGENT_API_URL = 'https://multiagent.aixblock.io/api/v1';

/**
 * Creates a calendar ICS file from a personalized plan
 * @param {string} chatId - The user's chat ID
 * @param {string} [personalisedPlan] - Optional personalized plan. If not provided, will fetch from user info
 * @returns {Promise<{success: boolean, message: string, filePath?: string}>} - Result of the operation
 */
async function createCalendar(chatId, personalisedPlan) {
    try {
        // If no plan provided, get from user info
        if (!personalisedPlan) {
            // Get user info and check previous plan
            const userInfo = await getUserInfo(chatId);
            personalisedPlan = userInfo?.previous_plan;

            // If no previous plan exists, throw an error
            if (!personalisedPlan) {
                throw new Error('No personalized plan found. Please create a plan first.');
            }
        }

        const currentDateTime = new Date().toISOString();
        const personalised_plan = `Personalised plan: ${personalisedPlan}\nCurrent date and time: ${currentDateTime}`;
        const response = await fetch(`${MULTIAGENT_API_URL}/execute/result/67c56384b4a75c480af3b502`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalised_plan: String(personalised_plan),
                webhook: `N/A`
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
        const maxAttempts = 10;
        const pollInterval = 30000;

        while (attempts < maxAttempts && !result) {
            const resultResponse = await fetch(`${MULTIAGENT_API_URL}/session/result/${responseData.Task_id}`);
            
            if (!resultResponse.ok) {
                throw new Error(`HTTP error! status: ${resultResponse.status}`);
            }

            const resultData = await resultResponse.json();
            
            if (resultData.status === 'Completed') {
                result = resultData.result.result.ics_file;
                break;
            }

            await new Promise(resolve => setTimeout(resolve, pollInterval));
            attempts++;
        }

        if (!result) {
            throw new Error('Timeout waiting for calendar creation result');
        }

        // Upload to Supabase Storage
        const fileName = `${chatId}.ics`;
        const { error } = await supabase.storage
            .from('personalisedu')
            .upload(fileName, result, {
                cacheControl: '3600',
                upsert: true,
                contentType: 'text/calendar'
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw new Error(`Error uploading to Supabase: ${error.message}`);
        }

        // Create a download URL for the file
        const { data: downloadData, error: downloadError } = await supabase.storage
            .from('personalisedu')
            .createSignedUrl(fileName, 3600); // 1 hour expiry

        if (downloadError) {
            console.error('Error creating signed URL:', downloadError);
            throw new Error(`Error creating download URL: ${downloadError.message}`);
        }

        return {
            success: true,
            message: 'Calendar created successfully.',
            filePath: downloadData.signedUrl
        };


    } catch (error) {
        console.error('❌ Error in createCalendar:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

// Function declaration for LLM tool
export const createCalendarFunctionDeclaration = {
    name: 'create_calendar',
    description: 'Creates a calendar ICS file from a personalized plan',
    parameters: {
        type: 'object',
        properties: {
            chatId: {
                type: 'string',
                description: 'The user\'s chat ID'
            },
            personalisedPlan: {
                type: 'string',
                description: 'The personalized plan to create a calendar from. If not provided, will fetch from user info.'
            }
        },
        required: ['chatId']
    }
};

export { createCalendar }; 