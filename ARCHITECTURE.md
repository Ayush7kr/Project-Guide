# System Architecture - ToolWise

This document outlines the technical design and data flow of the ToolWise platform.

## 🧱 Key Components

### 1. AI Integration Layer (`services/geminiService.ts`)
- **Engine**: Gemini 2.0 Flash Lite.
- **Role**: Handles all complex logic including blueprint generation, starter kit creation, and the Architect Chat.
- **Structured Output**: Uses `responseSchema` to ensure the AI always returns valid JSON that matches our TypeScript interfaces.

### 2. State Management (`App.tsx`)
- Centralized state for the current `blueprint`, `session`, and `view`.
- Utilizes React hooks to handle transitions between the landing page, loading states, and result dashboards.

### 3. Persistence Layer (`lib/supabaseClient.ts`)
- **Database**: PostgreSQL on Supabase.
- **Table: `projects`**:
  - `id`: UUID (Primary Key)
  - `user_id`: UUID (Foreign Key to Auth.users)
  - `name`: Text
  - `blueprint_data`: JSONB (Stores the entire generated architecture)
  - `created_at`: Timestamp

### 4. UI Components (`components/`)
- **ResultsPage**: The main dashboard for viewing a generated project. Connects several sub-components like `SuccessPath` and `RiskRadar`.
- **ArchitectChat**: A persistent chat interface that provides context-aware help based on the active blueprint.
- **Dashboard**: The user's library where they can manage and delete saved projects.

## 🔄 Data Flow

1. **User Input**: User submits a project description via the `InputForm`.
2. **Generation**: `geminiService` sends a structured prompt to Gemini 2.0 Flash Lite.
3. **Drafting**: The AI returns a JSON blueprint which is stored in the app state.
4. **Saving**: If authenticated, the user can save the blueprint to Supabase.
5. **Persistence**: The `blueprint_data` JSONB contains the complete state, including any user-marked progress in the "Success Path".
6. **Retrieval**: When a project is reopened, the JSONB blob is loaded back into the app state, restoring the exact view and progress.

## 🎨 Design System
- **Colors**: Slate & Teal (Dark Mode focus).
- **Aesthetics**: Glassmorphism, Framer Motion animations, and custom SVG icons from Lucide.
