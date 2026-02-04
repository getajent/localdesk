# LocalDesk

Navigate Danish Bureaucracy with Confidence - An AI-powered landing page for Danish expats.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn/UI
- **AI**: Vercel AI SDK with OpenAI GPT-4o-mini
- **Backend**: Supabase (PostgreSQL + Auth)
- **Testing**: Jest + React Testing Library + fast-check (property-based testing)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Then fill in your credentials in `.env.local`:
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### RAG Setup (Required for Documentation Search)

1. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
2. Apply database migration: `supabase/migrations/003_create_documents_table.sql`
3. Index documentation:
```bash
npm run index-docs
```

See `QUICK_START_RAG.md` for detailed setup instructions.

### Testing

Run unit tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Test document search:
```bash
npm run test-search "your question"
```

## Project Structure

```
localdesk/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── chat/         # Chat API endpoint
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/               # Shadcn/UI components
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── Footer.tsx
│   ├── ChatInterface.tsx
│   ├── ChatMessage.tsx
│   └── SuggestedQuestions.tsx
├── lib/                   # Utility functions
│   └── supabase.ts       # Supabase client
└── .kiro/specs/          # Feature specifications
```

## Features

- **RAG-Powered Chat**: AI uses your curated Denmark living documentation for accurate answers
- **Guest Chat Access**: Start chatting immediately without authentication
- **AI Assistant**: Expert Danish consultant persona specialized in SKAT, visas, and housing
- **Vector Search**: Finds relevant documentation using semantic similarity
- **Suggested Questions**: Pre-defined prompts to guide users
- **Authentication**: Supabase Auth for returning users
- **Chat History**: Persistent chat sessions for authenticated users
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Nordic Clean Design**: Minimalist aesthetic with Danish Red accents

## Development

This project follows a spec-driven development approach. See `.kiro/specs/localdesk-landing-page/` for detailed requirements, design, and implementation tasks.

## License

Private - All rights reserved
