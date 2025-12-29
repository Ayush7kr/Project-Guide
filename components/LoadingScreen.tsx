import React from 'react';
import { Loader2, BrainCircuit, PenTool } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-teal-200 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-teal-100 flex items-center justify-center">
          <BrainCircuit className="w-12 h-12 text-teal-600 animate-pulse" />
        </div>
        <div className="absolute -top-2 -right-2 bg-teal-500 text-white p-2 rounded-full animate-bounce">
            <PenTool className="w-4 h-4" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold text-slate-800">Architecting your tech stack...</h3>
        <p className="text-slate-500">Analyzing complexity, selecting tools, and building your roadmap.</p>
      </div>

      <div className="flex items-center space-x-2 text-sm text-teal-600 font-medium">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Processing requirements</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
