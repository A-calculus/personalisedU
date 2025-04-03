import { processMessage } from './llm';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.status(200).json({ message: 'Telegram API called' });

  try {
    const { message } = req.body;
    
    if (!message || !message.chat || !message.chat.id) {
      return res.status(400).json({ message: 'Invalid message format' });
    }

    const chatId = message.chat.id;
    const userMessage = message.text;

    // Process the message using LLM
    const aiResponse = await processMessage(userMessage, chatId);

    // Send the response back to the user
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: aiResponse,
        parse_mode: 'HTML'
      }),
    });

    return res.status(200).json({ message: 'Message processed successfully' });
  } catch (error) {
    console.error('Error processing Telegram message:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 