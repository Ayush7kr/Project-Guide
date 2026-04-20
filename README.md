# ToolWise - Project Blueprint Architect 🛠️

ToolWise is an AI-powered platform designed for developers and students to architect their project ideas with precision. It generates comprehensive technical blueprints, implementation strategies, and interactive roadmaps to help you go from "idea" to "shipped" faster.

## 🚀 Features

- **AI Blueprint Generation**: Powered by Gemini 2.0 Flash Lite for high-speed, intelligent architecting.
- **Dual Strategy Approaches**: Compare "Industry Standard" vs. "Rapid MVP" stacks for every project.
- **Interactive Success Path**: A phase-by-Step roadmap with curated learning resources and progress tracking.
- **Deep Research**: Automated market analysis, competitor research, and monetization strategies.
- **Step-by-Step Code Guide**: Functional boilerplate, folder structures, and setup scripts for your specific stack.
- **Cloud Persistence**: Save your projects and track progress across sessions using Supabase.
- **Architect Chat**: A context-aware AI assistant to answer technical questions about your specific blueprint.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **AI Engine**: Google Gemini 2.0 Flash Lite
- **Backend/Database**: Supabase (Auth & PostgreSQL)
- **Icons**: Lucide React
- **Export**: jsPDF

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- A Google AI (Gemini) API Key
- A Supabase Project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/toolwise.git
   cd toolwise
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📄 License
MIT License - feel free to use this to build amazing things!
