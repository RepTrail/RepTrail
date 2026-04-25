# RepTrail - Personal Trainer Dashboard

Elite Local-First platform for trainers and students.

## 🏗️ Project Structure

- `src/`: Main application code (Next.js App Router)
  - `actions/`: Server Actions for database operations
  - `components/`: UI components (feature-based and shared)
  - `hooks/`: Custom React hooks
  - `lib/`: Utilities, database clients, and shared logic
  - `services/`: Business logic services
- `supabase/`: Database configuration and history
  - `migrations/`: Historical SQL migration files
- `scripts/`: Diagnostic, audit, and debug scripts
- `docs/`: Deployment and technical documentation
- `public/`: Static assets (images, icons, PWA manifest)
- `tests/`: Automated tests (Playwright)

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **State Management**: TanStack Query (React Query)
- **Architecture**: Local-First Elite (IndexedDB + Sync Engine)
- **Styling**: Tailwind CSS + Shadcn/UI

## 📄 Documentation

Check the [docs/](file:///c:/Users/Marcos/Desktop/pra%20usar%20dps/5%20-%20Trabalho/3%20-%20Pessoais/RepTrail/web/docs) folder for deployment instructions and technical details.
