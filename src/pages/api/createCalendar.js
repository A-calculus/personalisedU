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

        // Generate calendar file path
        const downloadPath = path.join(__dirname, '../../../downloads');
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath, { recursive: true });
        }

        const calendarPath = path.join(downloadPath, `${chatId}.ics`);

        // Write calendar data to file
        fs.writeFileSync(calendarPath, result);

        // Schedule file deletion after 1 hour
        scheduleFileDeletion(calendarPath);

        const downloadUrl = `https://${process.env.RENDER_SERVICE_URL}/downloads/${path.basename(calendarPath)}`;
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