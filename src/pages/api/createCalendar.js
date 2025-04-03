import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUserInfo } from './profileService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MULTIAGENT_API_URL = 'https://multiagent.aixblock.io/api/v1';

// Store file deletion timers
const fileDeletionTimers = new Map();

/**
 * Schedules deletion of a file after a specified time
 * @param {string} filePath - Path to the file to delete
 * @param {number} delayMs - Delay in milliseconds before deletion
 */
function scheduleFileDeletion(filePath, delayMs = 3600000) { // Default: 1 hour
    // Clear any existing timer for this file
    if (fileDeletionTimers.has(filePath)) {
        clearTimeout(fileDeletionTimers.get(filePath));
    }

    // Set new timer
    const timer = setTimeout(() => {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`🗑️ Deleted file: ${filePath}`);
            }
            fileDeletionTimers.delete(filePath);
        } catch (error) {
            console.error(`❌ Error deleting file ${filePath}:`, error);
        }
    }, delayMs);

    // Store the timer
    fileDeletionTimers.set(filePath, timer);
}

/**
 * Creates a calendar ICS file from a personalized plan
 * @param {string} chatId - The user's chat ID
 * @param {string} [personalisedPlan] - Optional personalized plan. If not provided, will fetch from user info
 * @returns {Promise<{success: boolean, message: string, filePath?: string}>} - Result of the operation
 */
async function createCalendar(chatId, personalisedPlan) {
    try {
        console.log('📤 Starting calendar creation process...');
        
        // If no plan provided, get from user info
        if (!personalisedPlan) {
            // Get user info and check previous plan
            const userInfo = await getUserInfo(chatId);
            personalisedPlan = userInfo?.previous_plan;

            // If no previous plan exists, throw an error
            if (!personalisedPlan) {
                console.error('❌ No previous plan found for user');
                throw new Error('No personalized plan found. Please create a plan first.');
            }
        }

        console.log('📤 Sending POST request to multiagent API...');
        const currentDateTime = new Date().toISOString();
        const personalised_plan = `Personalised plan: ${personalisedPlan}\nCurrent date and time: ${currentDateTime}`;
        console.log('📤 Personalised plan:', personalised_plan);
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
            console.error('❌ API request failed:', response.status, response.statusText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('📥 Received API response:', JSON.stringify(responseData, null, 2));

        if (!responseData.Task_id) {
            console.error('❌ No Task_id in response:', responseData);
            throw new Error('No Task_id in response');
        }

        console.log('✅ Received Task_id:', responseData.Task_id);

        // Poll for the result
        let result = null;
        let attempts = 0;
        const maxAttempts = 10;
        const pollInterval = 30000;

        console.log('🔄 Starting polling for results...');
        while (attempts < maxAttempts && !result) {
            console.log(`📡 Polling attempt ${attempts + 1}/${maxAttempts}`);
            const resultResponse = await fetch(`${MULTIAGENT_API_URL}/session/result/${responseData.Task_id}`);
            
            if (!resultResponse.ok) {
                console.error('❌ Polling request failed:', resultResponse.status, resultResponse.statusText);
                throw new Error(`HTTP error! status: ${resultResponse.status}`);
            }

            const resultData = await resultResponse.json();
            console.log('📥 Received polling response:', JSON.stringify(resultData, null, 2));
            
            if (resultData.status === 'Completed') {
                console.log('✨ Task completed successfully!');
                result = resultData.result.result.ics_file;
                console.log('📥 Received calendar file:', result);
                break;
            }

            await new Promise(resolve => setTimeout(resolve, pollInterval));
            attempts++;
        }

        if (!result) {
            console.error('⏰ Timeout waiting for calendar creation result');
            throw new Error('Timeout waiting for calendar creation result');
        }

        // Generate calendar file path
        const downloadPath = path.join(__dirname, '../../../downloads');
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath, { recursive: true });
        }

        const calendarPath = path.join(downloadPath, `${chatId}.ics`);

        // Write calendar data to file
        fs.writeFileSync(calendarPath, result);
        console.log('📝 Calendar file saved at:', calendarPath);

        // Schedule file deletion after 1 hour
        scheduleFileDeletion(calendarPath);
        console.log('⏱️ Scheduled deletion of calendar file after 1 hour');

        const downloadUrl = `https://${process.env.RENDER_SERVICE_URL}/downloads/${path.basename(calendarPath)}`;
        console.log('📥 Download URL:', downloadUrl);
        return {
            success: true,
            message: 'Calendar created successfully. File will be deleted after 1 hour.',
            filePath: downloadUrl
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