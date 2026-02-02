# Implementation Plan: LocalDesk Landing Page

## Overview

This implementation plan breaks down the LocalDesk landing page into discrete, sequential tasks. The approach follows a bottom-up strategy: establish infrastructure first (Next.js, Supabase, dependencies), then build core components, implement the API layer, add authentication, and finally implement comprehensive testing.

Each task builds on previous work, ensuring no orphaned code. All testing tasks are included as required tasks to ensure comprehensive test coverage from the start.

## Tasks

- [x] 1. Initialize Next.js 15 project and configure dependencies
  - Create Next.js 15 app with App Router and TypeScript (strict mode)
  - Install core dependencies: `@supabase/supabase-js`, `ai` (Vercel AI SDK), `openai-edge`
  - Install UI dependencies: `tailwindcss`, `@radix-ui/react-*` (Shadcn/UI primitives), `lucide-react`
  - Install dev dependencies: `@types/node`, `@types/react`, `typescript`, `fast-check`, `@testing-library/react`, `@testing-library/jest-dom`, `jest`
  - Configure Tailwind CSS with custom colors (Danish Red: #C60C30)
  - Set up TypeScript with strict mode enabled
  - _Requirements: 8.3, 8.4, 8.5, 11.3_

- [x] 2. Set up Supabase configuration and environment variables
  - Create `.env.local` file with placeholders for OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
  - Create `.env.example` file documenting all required environment variables
  - Create `lib/supabase.ts` with Supabase client initialization
  - Add environment variable validation utility function
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 2.1 Write property test for environment variable validation
  - **Property 13: Environment Variable Validation**
  - **Validates: Requirements 11.4**

- [x] 3. Create database schema in Supabase
  - Create `profiles` table with user_id (FK to auth.users), full_name, metadata (JSONB), timestamps
  - Create `chats` table with id, user_id (FK), title, created_at, updated_at
  - Create `messages` table with id, chat_id (FK), role (CHECK constraint), content, created_at
  - Add indexes: idx_profiles_user_id, idx_chats_user_id, idx_chats_created_at, idx_messages_chat_id, idx_messages_created_at
  - Set up Row Level Security (RLS) policies for authenticated access
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 4. Implement Supabase helper functions
  - Create `lib/supabase.ts` with database helper functions
  - Implement `saveMessage(userId, userMessage, assistantMessage)` function
  - Implement `getChatHistory(userId)` function
  - Implement `getMessages(chatId)` function
  - Add error handling for database operations (log but don't throw)
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 4.1 Write property test for authenticated message persistence
  - **Property 7: Authenticated Message Persistence**
  - **Validates: Requirements 9.1, 9.2**

- [x] 4.2 Write property test for chat history retrieval
  - **Property 8: Chat History Retrieval**
  - **Validates: Requirements 9.3**

- [x] 4.3 Write unit tests for database helper functions
  - Test saveMessage with valid inputs
  - Test getChatHistory returns ordered results
  - Test getMessages returns messages in chronological order
  - Test error handling for database failures
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 5. Initialize Shadcn/UI and create base UI components
  - Run `npx shadcn-ui@latest init` to set up Shadcn/UI
  - Install Shadcn components: `button`, `input`, `card`, `avatar`
  - Create `components/ui/` directory with Shadcn components
  - Verify Tailwind configuration includes Shadcn theme
  - _Requirements: 8.4_

- [x] 6. Implement ChatMessage component
  - Create `components/ChatMessage.tsx` with TypeScript interface
  - Implement role-based styling (user: right-aligned Danish Red, assistant: left-aligned slate-100)
  - Add timestamp display in small gray text
  - Add markdown rendering support for assistant messages (use `react-markdown`)
  - Implement responsive layout for mobile/desktop
  - _Requirements: 1.2, 12.4_

- [x] 6.1 Write unit tests for ChatMessage component
  - Test user message styling and alignment
  - Test assistant message styling and alignment
  - Test timestamp rendering
  - Test markdown rendering in assistant messages
  - _Requirements: 1.2_

- [x] 7. Implement SuggestedQuestions component
  - Create `components/SuggestedQuestions.tsx` with TypeScript interface
  - Define SUGGESTED_QUESTIONS constant array with 3 questions (SKAT, visa, housing)
  - Implement onQuestionClick callback prop
  - Style buttons with hover effects and Danish Red accent
  - _Requirements: 2.1, 2.2, 2.4_

- [x] 7.1 Write property test for suggested question population
  - **Property 3: Suggested Question Population**
  - **Validates: Requirements 2.2**

- [x] 7.2 Write unit tests for SuggestedQuestions component
  - Test exactly 3 questions are displayed
  - Test onQuestionClick is called with correct question text
  - Test button hover states
  - _Requirements: 2.1, 2.2_

- [x] 8. Implement ChatInterface component
  - Create `components/ChatInterface.tsx` with TypeScript interfaces
  - Implement state management: messages array, input string, isLoading boolean
  - Create message submission handler with fetch to /api/chat
  - Implement streaming response handling using Vercel AI SDK's `useChat` hook
  - Add auto-scroll to latest message functionality
  - Conditionally render SuggestedQuestions when messages array is empty
  - Hide SuggestedQuestions after first message sent
  - Implement error handling with user-friendly error messages
  - Add loading state indicator
  - _Requirements: 1.1, 1.2, 1.3, 2.3, 12.4_

- [x] 8.1 Write property test for session context preservation
  - **Property 2: Session Context Preservation**
  - **Validates: Requirements 1.3**

- [x] 8.2 Write property test for message processing response
  - **Property 1: Message Processing Response**
  - **Validates: Requirements 1.2**

- [x] 8.3 Write unit tests for ChatInterface component
  - Test initial render shows SuggestedQuestions
  - Test SuggestedQuestions hidden after first message
  - Test message submission updates messages array
  - Test loading state during API call
  - Test error handling displays error message
  - Test auto-scroll behavior
  - _Requirements: 1.1, 1.2, 1.3, 2.3_

- [x] 9. Checkpoint - Ensure chat components render correctly
  - Verify ChatInterface, ChatMessage, and SuggestedQuestions components render without errors
  - Test component interactions in isolation
  - Ensure all tests pass, ask the user if questions arise

- [x] 10. Implement /api/chat route with OpenAI integration
  - Create `app/api/chat/route.ts` with POST handler
  - Implement request validation (check messages array format)
  - Create `buildSystemPrompt()` function with Expert Danish Consultant persona and knowledge base
  - Integrate OpenAI API using `openai-edge` and Vercel AI SDK
  - Configure streaming response with `OpenAIStream` and `StreamingTextResponse`
  - Inject system prompt into every API request
  - Add onCompletion callback to persist messages for authenticated users
  - Implement error handling for OpenAI failures and invalid requests
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [x] 10.1 Write property test for system prompt injection
  - **Property 4: System Prompt Injection**
  - **Validates: Requirements 3.1, 3.4, 10.3**

- [x] 10.2 Write property test for API input validation
  - **Property 10: API Input Validation**
  - **Validates: Requirements 10.2**

- [x] 10.3 Write property test for streaming response delivery
  - **Property 11: Streaming Response Delivery**
  - **Validates: Requirements 10.4**

- [x] 10.4 Write property test for error response handling
  - **Property 12: Error Response Handling**
  - **Validates: Requirements 10.5**

- [x] 10.5 Write property test for guest message non-persistence
  - **Property 9: Guest Message Non-Persistence**
  - **Validates: Requirements 9.4**

- [x] 10.6 Write unit tests for /api/chat route
  - Test request validation rejects malformed requests
  - Test system prompt is included in OpenAI request
  - Test streaming response format
  - Test error responses for various failure scenarios
  - Test message persistence for authenticated users
  - Test no persistence for guest users
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 11. Implement Header component with authentication
  - Create `components/Header.tsx` with TypeScript interface
  - Add LocalDesk logo (left-aligned)
  - Implement conditional rendering: "Log In" button for guests, user info for authenticated
  - Style login button with Danish Red accent
  - Integrate Supabase Auth for login button click handler
  - Add user avatar/email display for authenticated users
  - _Requirements: 5.1, 5.3, 7.1_

- [x] 11.1 Write property test for authentication session storage
  - **Property 5: Authentication Session Storage**
  - **Validates: Requirements 5.2**

- [x] 11.2 Write property test for profile creation on authentication
  - **Property 6: Profile Creation on Authentication**
  - **Validates: Requirements 6.6**

- [x] 11.3 Write unit tests for Header component
  - Test logo is displayed
  - Test "Log In" button shown for guest users
  - Test user info shown for authenticated users
  - Test login button triggers auth flow
  - _Requirements: 5.1, 5.3, 7.1_

- [x] 12. Implement Hero component
  - Create `components/Hero.tsx`
  - Add headline: "Navigate Danish Bureaucracy with Confidence"
  - Add subheadline: "Get instant answers about SKAT, visas, and housing from your AI-powered Danish consultant"
  - Add "Start Chatting" CTA button with scroll-to-chat functionality
  - Style with Nordic Clean aesthetic (white background, slate-900 text, Danish Red CTA)
  - Implement responsive layout for mobile/tablet/desktop
  - _Requirements: 7.2, 8.1, 8.2, 12.1, 12.2, 12.3_

- [x] 12.1 Write unit tests for Hero component
  - Test headline and subheadline are displayed
  - Test CTA button is present
  - Test CTA button scrolls to chat interface
  - _Requirements: 7.2_

- [x] 13. Implement Features component
  - Create `components/Features.tsx` with Feature interface
  - Define 4 features: Instant Answers (MessageSquare), Expert Knowledge (GraduationCap), No Login Required (Zap), Always Available (Clock)
  - Implement grid layout (2x2 on mobile, 4x1 on desktop)
  - Use lucide-react icons for each feature
  - Style with Nordic Clean aesthetic
  - _Requirements: 7.3, 8.5, 12.1, 12.2, 12.3_

- [x] 13.1 Write unit tests for Features component
  - Test all 4 features are displayed
  - Test correct icons are used
  - Test grid layout responsiveness
  - _Requirements: 7.3_

- [x] 14. Implement Footer component
  - Create `components/Footer.tsx`
  - Add copyright notice
  - Add links: Privacy Policy, Terms of Service, Contact
  - Style with slate-600 text and minimal design
  - _Requirements: 7.4_

- [x] 14.1 Write unit tests for Footer component
  - Test copyright notice is displayed
  - Test all legal links are present
  - _Requirements: 7.4_

- [x] 15. Implement main landing page layout
  - Create `app/page.tsx` with all components
  - Integrate Header at top
  - Add Hero section below header
  - Add Features section below hero
  - Embed ChatInterface prominently on page
  - Add Footer at bottom
  - Implement responsive layout with Tailwind CSS utilities
  - Fetch user session from Supabase and pass to Header and ChatInterface
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 12.1, 12.2, 12.3_

- [x] 15.1 Write property test for chat interface responsiveness
  - **Property 14: Chat Interface Responsiveness**
  - **Validates: Requirements 12.4**

- [x] 15.2 Write integration tests for landing page
  - Test full guest user chat flow (no auth)
  - Test authenticated user chat with persistence
  - Test responsive layout at different viewport sizes
  - _Requirements: 1.1, 1.2, 1.3, 9.1, 9.2, 12.1, 12.2, 12.3, 12.4_

- [x] 16. Implement authentication flow and profile creation
  - Create authentication UI (login modal or page)
  - Implement Supabase Auth email/password sign-in
  - Add database trigger or function to create profile on user creation
  - Test authentication flow end-to-end
  - Implement session persistence and retrieval
  - _Requirements: 5.1, 5.2, 5.4, 6.6_

- [x] 16.1 Write unit tests for authentication flow
  - Test login form validation
  - Test successful authentication creates session
  - Test profile is created for new users
  - Test error handling for invalid credentials
  - _Requirements: 5.1, 5.2, 5.4, 6.6_

- [x] 17. Implement chat history loading for authenticated users
  - Update ChatInterface to load chat history on mount for authenticated users
  - Fetch messages from most recent chat session
  - Display historical messages in chat interface
  - Ensure new messages are added to existing chat session
  - _Requirements: 9.3_

- [x] 17.1 Write unit tests for chat history loading
  - Test chat history is loaded for authenticated users
  - Test no history loaded for guest users
  - Test messages are displayed in correct order
  - _Requirements: 9.3_

- [x] 18. Implement guest session reset on page refresh
  - Ensure ChatInterface state is not persisted for guest users
  - Verify messages array is empty on page load for guests
  - Test that refreshing the page clears guest chat history
  - _Requirements: 1.4_

- [x] 18.1 Write unit tests for guest session reset
  - Test guest messages are not persisted
  - Test page refresh clears guest chat history
  - _Requirements: 1.4_

- [x] 19. Final styling and responsive design polish
  - Review all components for Nordic Clean aesthetic compliance
  - Verify Danish Red (#C60C30) is used consistently for accents
  - Test responsive layouts on mobile (320px-767px), tablet (768px-1023px), desktop (1024px+)
  - Ensure Inter or Geist Sans font is applied throughout
  - Verify ample whitespace and minimalist design
  - Test all interactive elements (buttons, inputs) have proper hover/focus states
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 19.1 Write visual regression tests
  - Capture screenshots of all components at different viewport sizes
  - Test color scheme consistency
  - Test typography consistency
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 20. Final checkpoint - End-to-end testing and deployment preparation
  - Run all unit tests and property tests
  - Test complete guest user flow (visit page, see suggestions, send message, receive response)
  - Test complete authenticated user flow (login, send message, verify persistence, reload page, verify history)
  - Verify all environment variables are documented in .env.example
  - Test error handling for missing environment variables
  - Verify no credentials are committed to version control
  - Ensure all tests pass, ask the user if questions arise

## Notes

- All tasks are required for comprehensive implementation with full test coverage
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples, edge cases, and error conditions
- Checkpoints ensure incremental validation at key milestones
- The implementation follows a bottom-up approach: infrastructure → components → API → integration
- All code should be written in TypeScript with strict mode enabled
- Use Vercel AI SDK's `useChat` hook for simplified streaming in ChatInterface
- Database operations should fail gracefully (log errors but don't crash the app)
