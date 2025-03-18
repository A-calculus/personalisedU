// pages/api/openai.js
import fetch from 'node-fetch';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LLM_TOKEN}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // or another model of your choice
          messages: [{ role: 'user', content: message }],
        }),
      });

      const data = await response.json();
      
      // Send back the AI's reply
      const reply = data.choices[0]?.message?.content || "Sorry, I couldn't think of a response.";
      res.status(200).json({ reply });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch from OpenAI' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
