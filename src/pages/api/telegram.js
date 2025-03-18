// pages/api/telegram.js
import fetch from 'node-fetch';

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
const SAVE_PROFILE_URL = `${process.env.VERCEL_URL}/api/saveProfile`;
const CREATE_PLAN_URL = `${process.env.VERCEL_URL}/api/createPlan`;
const CREATE_CALENDAR_URL = `${process.env.VERCEL_URL}/api/createCalendar`;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { message, callback_query } = req.body;
    
        if (callback_query) {
          const chatId = callback_query.message.chat.id;
          const callbackData = callback_query.data;
    
          if (callbackData === 'create_plan') {
            // Call the createPlan endpoint
            await createPlan(chatId);
          }
         else if (callbackData === 'create_calendar') {
            // Call the createCalendar endpoint
            await createCalendar(chatId);
          }
        } else if (message && message.text) {
          const chatId = message.chat.id;
          const userMessage = message.text;
    
          if (userMessage === '/start') {
            await showMenu(chatId);
          } else {
            await saveUserProfile(chatId, userMessage);
          }
        }
        

        res.status(200).json({ status: 'ok' });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function createPlan(chatId) {
    const response = await fetch(CREATE_PLAN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: chatId,
      }),
    });
  
    const data = await response.json();
  
    if (response.ok) {
      await sendMessage(chatId, 'Your plan has been created successfully!');
    } else {
      await sendMessage(chatId, `Failed to create plan: ${data.error}`);
    }
}

async function createCalendar(chatId) {
    const response = await fetch(CREATE_CALENDAR_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chatId: chatId,
        }),
    });
    
    const data = await response.json();

    if (response.ok) {
        const filePath = `${process.env.VERCEL_URL}/calendar.ics`; // Adjust based on your deployment
        await sendMessage(chatId, `Your calendar has been created! You can download it [here](${filePath}).`);
    } else {
        await sendMessage(chatId, `Failed to create calendar: ${data.error}`);
    }
}

async function sendMessage(chatId, text) {
  const url = `${TELEGRAM_API_URL}/sendMessage`;

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

async function showMenu(chatId) {
  const url = `${TELEGRAM_API_URL}/sendMessage`;

  const keyboard = {
    inline_keyboard: [
      [
        { text: 'Create Plan', callback_data: 'create_plan' },
        { text: 'Create Calendar', callback_data: 'create_calendar' },
    ],
    ],
  };

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: 'Please choose an option:',
        reply_markup: keyboard,
      }),
    });
  } catch (error) {
    console.error('Error showing menu:', error);
  }
}


async function saveUserProfile(chatId, userMessage) {
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
  
    const data = await response.json();
  
    if (response.ok) {
      await sendMessage(chatId, 'Your profile has been saved successfully!');
    } else {
      await sendMessage(chatId, `Failed to save profile: ${data.error}`);
    }
  }
