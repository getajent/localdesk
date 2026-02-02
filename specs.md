# LocalDesk — GDD (LLM Input)

## 1. Project
LocalDesk is an AI-powered platform that helps migrants in Denmark understand everyday bureaucracy.
It combines government-level trust with a calm, human-friendly SaaS experience.

Goal: reduce confusion, explain processes clearly, and guide users to correct next steps.

---

## 2. Product Strategy

### MVP (Now)
- Single-page experience
- No authentication enabled
- No persistent user data
- AI chat with curated knowledge
- Fast iteration and deployment

### Future (Planned, NOT MVP)
- User accounts and authentication
- Saved chat history
- Personalization
- Multi-language routing
- Analytics and feedback

Architecture must support future expansion without refactoring.

---

## 3. Design Rules
- Scandinavian minimalism
- Clean layouts with generous whitespace
- Card-based UI
- Calm, premium consulting vibe

### Colors
- Primary (CTA only): Danish Red `#C8102E`
- Accent: Warm Blue (chat, links)
- Base: White / Off-white / Light gray

Rules:
- Never overuse red
- No aggressive animations
- Clarity over decoration

---

## 4. Tone of Voice (LLM Rules)
- Friendly but professional
- Simple language
- No legal or bureaucratic jargon
- Never alarming or judgmental
- Always explain next steps

Do NOT:
- Give legal advice
- Assume user knowledge
- Claim authority

---

## 5. Core Features

### MVP
- Hero section
- AI chat interface
- Suggested questions
- Topic cards:
  - Housing
  - Jobs
  - Taxes
  - Healthcare
- Language-ready UI
- Fully responsive

### Future
- User dashboard
- Saved conversations
- Personalized answers
- Multi-page content (SEO)

---

## 6. Knowledge System

### MVP
- Static, curated local knowledge files

```txt
/data
 ├─ housing.md
 ├─ jobs.md
 ├─ taxes.md
 └─ healthcare.md
