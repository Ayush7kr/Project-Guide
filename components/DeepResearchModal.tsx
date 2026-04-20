
import React from 'react';
import { DeepResearchReport } from '../types';
import { X, Target, Zap, DollarSign, BrainCircuit, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeepResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  data: DeepResearchReport | null;
}

const DeepResearchModal: React.FC<DeepResearchModalProps> = ({ isOpen, onClose, loading, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center space-x-3">
             <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                <BrainCircuit className={`w-6 h-6 ${loading ? 'animate-pulse' : ''}`} />
             </div>
             <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Gemini Deep Research</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Autonomous market and technical investigation</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar">
           {loading ? (
             <div className="flex flex-col items-center justify-center h-full space-y-6">
                <div className="relative">
                   <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                   <BrainCircuit className="w-16 h-16 text-indigo-600 dark:text-indigo-400 animate-bounce" />
                </div>
                <div className="text-center space-y-2">
                   <h4 className="text-xl font-bold text-slate-800 dark:text-white">Synthesizing Report...</h4>
                   <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                     Analyzing competitors, identifying technical advantages, and generating business models.
                   </p>
                </div>
             </div>
           ) : data ? (
             <div className="space-y-12">
               
               {/* Summary */}
               <section className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Executive Summary</h4>
                  <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {data.summary}
                  </p>
               </section>

               <div className="grid md:grid-cols-2 gap-8">
                  {/* Competitors */}
                  <section>
                     <h3 className="flex items-center text-xl font-bold text-slate-900 dark:text-white mb-6">
                        <Target className="w-6 h-6 text-red-500 mr-2" />
                        Market Competitors
                     </h3>
                     <div className="space-y-4">
                        {data.competitors.map((comp, idx) => (
                           <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                              <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{comp.name}</h5>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{comp.description}</p>
                           </div>
                        ))}
                     </div>
                  </section>

                  {/* Technical Edge */}
                  <section>
                     <h3 className="flex items-center text-xl font-bold text-slate-900 dark:text-white mb-6">
                        <Zap className="w-6 h-6 text-yellow-500 mr-2" />
                        Technical Edge
                     </h3>
                     <div className="space-y-4">
                        {data.technicalEdge.map((edge, idx) => (
                           <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-l-4 border-l-yellow-400">
                              <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{edge.feature}</h5>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{edge.whyItMatters}</p>
                           </div>
                        ))}
                     </div>
                  </section>
               </div>

               {/* Monetization */}
               <section>
                  <h3 className="flex items-center text-xl font-bold text-slate-900 dark:text-white mb-6">
                     <DollarSign className="w-6 h-6 text-green-500 mr-2" />
                     Monetization Strategies
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                     {data.monetizationStrategies.map((strat, idx) => (
                        <div key={idx} className="bg-green-50 dark:bg-green-900/10 p-5 rounded-xl border border-green-100 dark:border-green-900/30">
                           <h5 className="font-bold text-green-800 dark:text-green-300 mb-2">{strat.model}</h5>
                           <p className="text-sm text-green-700 dark:text-green-400/80 leading-snug">{strat.description}</p>
                        </div>
                     ))}
                  </div>
               </section>

             </div>
           ) : (
             <div className="text-center text-slate-500">No data available.</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default DeepResearchModal;
