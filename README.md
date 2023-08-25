# Inving Money Tracker
This application are mean to be the tools for my family, the feature are based on the family feedback (My Wife).

### Available Features
- [x] Record Income and Expenses
- [x] Simple Report such as:
  - [x] Expenses Categories
  - [x] Cash Flow
  - [x] Debt Percentage by Income
- [x] Multiple family records (Circle)
- [x] Invite user to circle
- [x] Weekly report by Email
- [x] Assets Planner

### Planned Features
- [ ] Assets Prediction
- [ ] Integrate with ChatGPT

### Tech Stack
- [x] Nuxt3
  - [x] Typescript
  - [x] TailwindCSS
  - [x] Flowbite
  - [x] Prisma
- [x] PostgreSQL

### Services
- [x] Supabase
  - [x] Auth
  - [x] Database
- [x] Vercel
- [x] Upstash
  - [x] Qstash
- [x] Sendgrid


### How to run Supabase functions on local
1. Start Docker
2. Run `npx supabase start`
3. Setup `supabase/.env` file, just copy the example 
4. Run `npx supabase functions serve --env-file ./supabase/.env` to start local functions
