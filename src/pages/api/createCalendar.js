// pages/api/createCalendar.js
import fetch from 'node-fetch';
import { writeFile } from 'fs';
import { join } from 'path';

const SAVE_PROFILE_URL = `${process.env.VERCEL_URL}/api/saveProfile`; // Adjust this if necessary

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { chatId } = req.body;

    if (!chatId) {
      return res.status(400).json({ error: 'Chat ID is required' });
    }

    try {
        // Fetch user information from Supabase
      const userInfo = await getUserInfo(chatId);

      // Prepare payload for the external API
      const payload = {
        basic_info: "example_value",
        user_knowledge: "example_value",
        user_objectives: "example_value",
        program_info: "example_value",
        user_schedule: "example_value",
        calendar_content: "example_value",
        webhook: "null",
      };

      // Send POST request to the external API
      const response = await fetch('https://multiagent.aixblock.io/api/v1/execute/result/67c524b951643fd40c0d4d1f', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        return res.status(response.status).json({ error: `Failed to create calendar: ${error.message}` });
      }

      const result = await response.json();
      const calendarContent = result.data || "No calendar content available"; // Adjust based on the actual response structure

      // Generate .ics file
      const icsFilePath = await createICSFile(calendarContent);

      // Send the file to the user in Telegram
      res.status(200).json({ message: 'Calendar created successfully', filePath: icsFilePath });
    } catch (error) {
        if (error.message === 'User profile not found') {
            // If user profile is not found, call saveProfile.js with a specific message
            await handleProfileCreation(chatId);
        } else {
            console.error(error);
            res.status(500).json({ error: 'Failed to create calendar' });
        }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getUserInfo(chatId) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?chat_id=eq.${chatId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (data.length > 0) {
    return data[0]; // Return the first user profile found
  } else {
    throw new Error('User profile not found');
  }
}

async function handleProfileCreation(chatId) {
  const userMessage = "CreatePlan"; // Define the message for saving the profile

  // Call saveProfile.js with the user message
  const response = await fetch(SAVE_PROFILE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userMessage: userMessage,
      chatId: chatId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to save profile: ${error.message}`);
  }

  // Optionally, you can return a success message or handle it as needed
  return await response.json();
}

async function createICSFile(calendarContent) {
  const icsContent = `
${calendarContent}
  `.trim();

  const filePath = join(process.cwd(), 'public', 'calendar.ics'); // Save to public directory

  return new Promise((resolve, reject) => {
    writeFile(filePath, icsContent, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(filePath);
      }
    });
  });
}
