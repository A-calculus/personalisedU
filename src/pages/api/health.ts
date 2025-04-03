import { NextApiRequest, NextApiResponse } from 'next';
import * as dotenv from 'dotenv';

dotenv.config();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.status(200).json({
    status: 'ok',
    message: 'Bot is running',
    botLink: process.env.TELEGRAM_BOT_LINK || 'https://t.me/PersonalisedU_Bot'
  });
} 

