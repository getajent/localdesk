# Requirements Document: LocalDesk Landing Page

## Introduction

LocalDesk is an AI-powered landing page designed to help Danish expats navigate Danish bureaucracy. The system provides immediate access to an AI chat assistant specialized in SKAT (Danish tax authority), visas, and housing matters. The MVP focuses on high conversion while establishing a foundation for future SaaS scaling.

## Glossary

- **System**: The LocalDesk web application
- **Guest_User**: A user interacting with the chat without authentication
- **Authenticated_User**: A user who has logged in via Supabase Auth
- **Chat_Assistant**: The AI-powered conversational interface using OpenAI GPT-4o-mini
- **Knowledge_Base**: Structured system instructions about Danish bureaucracy
- **Chat_Session**: A conversation thread between a user and the Chat_Assistant
- **Suggested_Question**: Pre-defined prompts displayed to guide user interaction
- **Danish_Red**: The accent color (#C60C30) used in the Nordic Clean design system
- **Supabase**: The backend platform providing PostgreSQL database and authentication

## Requirements

### Requirement 1: Guest Chat Access

**User Story:** As a Danish expat, I want to start chatting immediately without creating an account, so that I can quickly get answers to my bureaucracy questions.

#### Acceptance Criteria

1. WHEN a Guest_User visits the landing page, THE System SHALL display a functional chat interface without requiring authentication
2. WHEN a Guest_User submits a message, THE Chat_Assistant SHALL process and respond to the query
3. WHEN a Guest_User interacts with the chat, THE System SHALL maintain conversation context within the session
4. WHEN a Guest_User refreshes the page, THE System SHALL clear the previous chat history

### Requirement 2: Suggested Questions

**User Story:** As a new visitor, I want to see example questions, so that I understand what the assistant can help me with.

#### Acceptance Criteria

1. WHEN the chat interface loads with no message history, THE System SHALL display exactly 3 suggested questions
2. WHEN a Guest_User clicks a suggested question, THE System SHALL populate the input field with that question text
3. WHEN a Guest_User sends their first message, THE System SHALL hide the suggested questions
4. THE System SHALL include suggested questions covering SKAT, visa, and housing topics

### Requirement 3: AI Assistant Persona

**User Story:** As a user seeking help, I want the assistant to act as an expert Danish consultant, so that I receive authoritative and trustworthy guidance.

#### Acceptance Criteria

1. WHEN the Chat_Assistant generates responses, THE System SHALL inject a system prompt defining the "Expert Danish Consultant" persona
2. THE Knowledge_Base SHALL include structured information about SKAT, visas, and housing procedures
3. WHEN the Chat_Assistant responds, THE System SHALL maintain a professional and helpful tone consistent with the persona
4. THE System SHALL include the Knowledge_Base content in every API request to the AI model

### Requirement 4: Conversation Guardrails

**User Story:** As the product owner, I want the assistant to stay focused on Denmark-related topics, so that users receive relevant help and the service maintains its value proposition.

#### Acceptance Criteria

1. WHEN a user asks about non-Denmark topics, THE Chat_Assistant SHALL politely redirect the conversation to Danish bureaucracy matters
2. THE System SHALL include guardrail instructions in the system prompt to enforce topic boundaries
3. WHEN a user asks about SKAT, visas, or housing, THE Chat_Assistant SHALL provide detailed, relevant responses
4. THE Chat_Assistant SHALL decline requests for general knowledge unrelated to Danish expat needs

### Requirement 5: User Authentication

**User Story:** As a returning user, I want to log in to my account, so that I can access personalized features in the future.

#### Acceptance Criteria

1. WHEN an Authenticated_User clicks the login button, THE System SHALL initiate the Supabase Auth flow
2. WHEN authentication succeeds, THE System SHALL store the user session
3. WHEN an Authenticated_User is logged in, THE System SHALL display their authentication status in the header
4. THE System SHALL support Supabase Auth email/password authentication

### Requirement 6: Database Schema

**User Story:** As a developer, I want a scalable database structure, so that the system can grow into a full SaaS product.

#### Acceptance Criteria

1. THE System SHALL create a users table with id, email, and created_at fields
2. THE System SHALL create a profiles table with user_id, full_name, and metadata fields
3. THE System SHALL create a chats table with id, user_id, title, and timestamps
4. THE System SHALL create a messages table with id, chat_id, role, content, and timestamp fields
5. THE System SHALL establish foreign key relationships between users, profiles, chats, and messages
6. WHEN a new user authenticates, THE System SHALL create corresponding profile records

### Requirement 7: Landing Page Structure

**User Story:** As a visitor, I want a clear and compelling landing page, so that I understand the value proposition and can start using the service.

#### Acceptance Criteria

1. THE System SHALL display a header with the LocalDesk logo and login button
2. THE System SHALL display a hero section with a headline describing the service value
3. THE System SHALL display a features grid below the hero section
4. THE System SHALL display a footer with legal links (Privacy Policy, Terms of Service)
5. THE System SHALL embed the chat interface prominently on the landing page

### Requirement 8: Nordic Clean Design System

**User Story:** As a user, I want a visually appealing interface that reflects Danish design aesthetics, so that the experience feels trustworthy and professional.

#### Acceptance Criteria

1. THE System SHALL use white backgrounds with Slate-900 text as the primary color scheme
2. THE System SHALL use Danish_Red (#C60C30) for accent elements and call-to-action buttons
3. THE System SHALL use Inter or Geist Sans font family throughout the interface
4. THE System SHALL implement Shadcn/UI components for consistent design patterns
5. THE System SHALL use lucide-react icons for visual elements
6. THE System SHALL maintain a minimalist aesthetic with ample whitespace

### Requirement 9: Chat Message Persistence

**User Story:** As an authenticated user, I want my chat history saved, so that I can reference previous conversations.

#### Acceptance Criteria

1. WHEN an Authenticated_User sends a message, THE System SHALL persist the message to the messages table
2. WHEN an Authenticated_User sends a message, THE System SHALL associate it with a Chat_Session in the chats table
3. WHEN an Authenticated_User loads the page, THE System SHALL retrieve their previous Chat_Sessions
4. WHERE a Guest_User is chatting, THE System SHALL NOT persist messages to the database

### Requirement 10: AI API Integration

**User Story:** As a developer, I want a robust API route for AI interactions, so that the chat functionality is reliable and maintainable.

#### Acceptance Criteria

1. THE System SHALL create a Next.js API route at /api/chat for handling chat requests
2. WHEN the API route receives a request, THE System SHALL validate the message format
3. WHEN the API route processes a request, THE System SHALL inject the Knowledge_Base into the system prompt
4. THE System SHALL use the Vercel AI SDK to stream responses from OpenAI GPT-4o-mini
5. WHEN the API encounters an error, THE System SHALL return appropriate error messages
6. THE System SHALL include the OpenAI API key from environment variables

### Requirement 11: Environment Configuration

**User Story:** As a developer, I want secure configuration management, so that sensitive credentials are protected.

#### Acceptance Criteria

1. THE System SHALL store the OpenAI API key in environment variables
2. THE System SHALL store Supabase URL and anon key in environment variables
3. THE System SHALL provide a .env.example file documenting required variables
4. THE System SHALL validate that required environment variables are present at runtime
5. THE System SHALL NOT commit actual credentials to version control

### Requirement 12: Responsive Design

**User Story:** As a mobile user, I want the landing page to work well on my device, so that I can access help anywhere.

#### Acceptance Criteria

1. WHEN the System is viewed on mobile devices, THE layout SHALL adapt to smaller screen sizes
2. WHEN the System is viewed on tablets, THE layout SHALL optimize for medium screen sizes
3. WHEN the System is viewed on desktop, THE layout SHALL utilize available screen space effectively
4. THE Chat_Interface SHALL remain functional across all device sizes
5. THE System SHALL use Tailwind CSS responsive utilities for layout adaptation
