import React, { useState } from 'react';
import { UserInput, ProjectBlueprint } from './types';
import { generateBlueprint } from './services/geminiService';
import InputForm from './components/InputForm';
import ResultsPage from './components/ResultsPage';
import LoadingScreen from './components/LoadingScreen';
import { Wrench } from 'lucide-react';

type ViewState = 'landing' | 'loading' | 'results';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [blueprint, setBlueprint] = useState<ProjectBlueprint | null>(null);

  const handleFormSubmit = async (data: UserInput) => {
    setView('loading');
    try {
      const result = await generateBlueprint(data);
      setBlueprint(result);
      setView('results');
    } catch (error) {
      console.error(error);
      alert("Failed to generate blueprint. Please check your API key or try again.");
      setView('landing');
    }
  };

  const handleReset = () => {
    setBlueprint(null);
    setView('landing');
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-slate-50">
      
      {/* Conditionally render content based on view */}
      {view === 'landing' && (
        <div className="min-h-screen flex flex-col">
          {/* Navbar */}
          <nav className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
             <div className="flex items-center space-x-2 font-bold text-xl text-slate-800">
               <div className="bg-teal-600 text-white p-1.5 rounded-lg">
                 <Wrench className="w-5 h-5" />
               </div>
               <span>ToolWise</span>
             </div>
             <a href="#" className="text-sm font-medium text-slate-500 hover:text-teal-600">How it works</a>
          </nav>

          {/* Hero Content */}
          <div className="flex-grow flex flex-col items-center justify-center px-4 pb-20">
             <div className="text-center max-w-3xl mx-auto mb-10">
               <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                 Build smarter with the <span className="text-teal-600">perfect stack</span>.
               </h1>
               <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
                 Stop guessing which tools to use. Tell us your project idea, and our AI Architect will generate a tailored technology blueprint in seconds.
               </p>
             </div>

             <InputForm onSubmit={handleFormSubmit} isLoading={false} />

             {/* Footer / Social Proof */}
             <div className="mt-16 flex items-center space-x-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Simple text placeholders for logos */}
                <span className="font-bold text-slate-400">Google Gemini</span>
                <span className="font-bold text-slate-400">React</span>
                <span className="font-bold text-slate-400">Tailwind</span>
             </div>
          </div>
        </div>
      )}

      {view === 'loading' && (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingScreen />
        </div>
      )}

      {view === 'results' && blueprint && (
        <ResultsPage blueprint={blueprint} onReset={handleReset} />
      )}

    </div>
  );
};

export default App;
