# Solo Builder Command Center

AI-powered dashboard for GitHub/Vercel/Notion integrations.

## Features

- **AIRA Design System**: Custom sci-fi inspired UI with Tailwind CSS.
- **Gemini AI Integration**: Built-in AI assistant using Google's `gemini-2.5-flash` model.
- **Real-time Status**: Mock data visualization for project deployments.
- **Responsive Layout**: Mobile-first design using Next.js App Router.  - Updated with functional navigation and real activity feed

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Motion (Framer Motion)
- **AI**: Google Gemini API (`@google/genai`)
- **Auth**: NextAuth.js (Ready for configuration)

## Setup Instructions

### 1. Environment Variables

Ensure your `.env` file has the following keys:

```bash
# Required for AI features
GEMINI_API_KEY="your_api_key_here"

# Optional: NextAuth configuration
NEXTAUTH_SECRET="your_secret_here"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

## Deployment to Vercel

1.  Push this repository to GitHub.
2.  Import the project in Vercel.
3.  Add the `GEMINI_API_KEY` environment variable in Vercel project settings.
4.  Deploy!

## Testing Gemini API

### Client-Side (Recommended)
The dashboard includes an "AI Assistant" panel. Type a prompt and hit Enter. The app will use the `NEXT_PUBLIC_GEMINI_API_KEY` to fetch a response directly from Google's servers.

### Server-Side Endpoint
You can also test the API route directly:

```bash
curl -X POST http://localhost:3000/app/api/test-gemini \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain quantum computing in 5 words"}'
```

## Project Structure

- `app/globals.css`: AIRA design system configuration (Tailwind v4 theme).
- `components/ui/ProjectCard.tsx`: Reusable project status card.
- `app/page.tsx`: Main dashboard view.
- `app/api/test-gemini/route.ts`: Server-side API route example.
