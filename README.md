# PersonalisedU

AI-Powered Learning Companion built with Next.js.

## Local Development

To run the application locally:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Or build and start for production-like environment
npm run build && npm start
```

## Deployment to Render

This application is configured for deployment on Render.

### Automatic Deployment

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Select your repository
4. Render will automatically detect the `render.yaml` configuration

### Manual Deployment

If you prefer to deploy manually:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node
   - Health Check Path: `/api/health`

### Environment Variables

Make sure to set the following environment variables in Render:

- `NODE_ENV`: Set to `production`
- `PORT`: Set to `10000` (or your preferred port)
- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
- `GEMINI_API_KEY`: Your Gemini API key
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- Any other environment variables your application needs

## Features

- Personalized user experience
- Telegram bot integration
- AI-powered responses
- Calendar creation
- Plan generation

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
