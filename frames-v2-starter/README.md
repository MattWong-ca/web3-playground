# Frames v2 Starter Kit

A full-featured starter kit for building Farcaster Frames v2 applications with Next.js. This project provides a robust foundation with authentication, notifications, and essential tooling pre-configured.

## Features

- 🔐 **Authentication** - Built-in Farcaster authentication using Frame SDK
- 📨 **Notifications** - Ready-to-use Frame notifications system
- 🔄 **State Management** - TanStack Query for efficient server state management
- 🎨 **Styling** - Tailwind CSS for rapid UI development
- 📊 **Analytics** - PostHog integration for tracking user interactions
- 🐛 **Error Tracking** - Sentry integration for monitoring errors
- 🔍 **Type Safety** - Full TypeScript support
- 🚀 **API Routes** - Pre-configured API endpoints for user management
- 💾 **Database** - Redis integration for data persistence
- ⚡ **Background Jobs** - QStash integration for handling async tasks

## Prerequisites

- Node.js 18+
- Redis database (Upstash recommended)
- Neynar API key
- PostHog account (optional)
- Sentry account (optional)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/builders-garden/frames-v2-starter
cd frames-v2-starter
````

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env` file based on `.env.sample`:

```env
NEXT_PUBLIC_URL=http://localhost:3000
JWT_SECRET=your-secret-key
NEYNAR_API_KEY=your-neynar-api-key
KV_API_URL=your-redis-url
KV_API_TOKEN=your-redis-token
QSTASH_TOKEN=your-qstash-token
QSTASH_CURRENT_SIGNING_KEY=your-qstash-signing-key
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=your-posthog-host
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing Your Frame
1. Run yarn frames
2. Generate domain account association for http://localhost:3000
3. Paste it in your manifest (farcaster.json)
4. Debug and Test interactions from the debugger

## Project Structure

```
├── app/                # Next.js app router pages and API routes
├── components/         # React components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and configurations
├── public/            # Static assets
└── types/             # TypeScript type definitions
```

## Key Components

- `components/Demo.tsx` - Example component showing Frame authentication
- `hooks/use-sign-in.ts` - Hook for handling Farcaster authentication
- `lib/notifications.ts` - Frame notifications implementation
- `lib/db/index.ts` - Database operations
- `middleware.ts` - API route authentication

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this starter kit for any project.

## Support

If you have any questions or need help, please open an issue in the repository.
