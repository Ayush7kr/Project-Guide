import React, { useState } from 'react';
import { UserInput } from '../types';
import { Sparkles, Users, Zap, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('Web Development');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [timeConstraint, setTimeConstraint] = useState('1 Month');
  const [teamSize, setTeamSize] = useState(1);
  const [projectGoal, setProjectGoal] = useState<'Deep Learning' | 'Rapid MVP'>('Rapid MVP');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit({ description, projectType, difficulty, timeConstraint, teamSize, projectGoal });
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
      <div className="p-1 bg-gradient-to-r from-teal-400 to-blue-500"></div>
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Describe your project</h2>
        <p className="text-slate-500 mb-6 text-sm">Tell us what you want to build using natural language.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div>
            <textarea
              className="w-full p-4 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-700 placeholder:text-slate-400 bg-slate-50 resize-none h-32"
              placeholder="e.g., I want to build a face recognition system for my college project using Python..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Traditional Selects */}
            <div className="space-y-4">
               <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Type</label>
                <select 
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm focus:border-teal-500 outline-none shadow-sm"
                >
                    <option>Web Development</option>
                    <option>Mobile App</option>
                    <option>AI / Machine Learning</option>
                    <option>Data Science</option>
                    <option>IoT / Hardware</option>
                    <option>Blockchain</option>
                    <option>Game Dev</option>
                </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Level</label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm focus:border-teal-500 outline-none shadow-sm"
                    >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Time</label>
                    <select
                        value={timeConstraint}
                        onChange={(e) => setTimeConstraint(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm focus:border-teal-500 outline-none shadow-sm"
                    >
                        <option>Hackathon (24-48h)</option>
                        <option>1-2 Weeks</option>
                        <option>1 Month</option>
                        <option>Semester</option>
                    </select>
                  </div>
               </div>
            </div>

            {/* Right Column: New Fancy Inputs */}
            <div className="space-y-6">
               {/* Team Size */}
               <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Team Size</span>
                    <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-[10px]">{teamSize} Member{teamSize > 1 ? 's' : ''}</span>
                  </label>
                  <div className="flex justify-between items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                     {[1, 2, 3, 4, 5].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setTeamSize(size)}
                          className={`w-full py-2 rounded-md text-sm font-medium transition-all ${
                             teamSize === size 
                             ? 'bg-white text-teal-600 shadow-sm ring-1 ring-teal-100' 
                             : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                           {size}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Project Goal Toggle */}
               <div>
                 <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Project Goal</label>
                 <div className="grid grid-cols-2 gap-3">
                    <button
                       type="button"
                       onClick={() => setProjectGoal('Rapid MVP')}
                       className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                          projectGoal === 'Rapid MVP'
                          ? 'bg-teal-50 border-teal-200 text-teal-700 ring-1 ring-teal-200'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                       }`}
                    >
                       <Zap className="w-5 h-5 mb-1" />
                       <span className="text-xs font-bold">Rapid MVP</span>
                    </button>
                    <button
                       type="button"
                       onClick={() => setProjectGoal('Deep Learning')}
                       className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                          projectGoal === 'Deep Learning'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-200'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                       }`}
                    >
                       <BrainCircuit className="w-5 h-5 mb-1" />
                       <span className="text-xs font-bold">Industry Standard</span>
                    </button>
                 </div>
               </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!description.trim() || isLoading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center space-x-2 relative overflow-hidden group
              ${!description.trim() || isLoading 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.98]'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-2">
                {isLoading ? (
                <span>Architecting Solution...</span>
                ) : (
                <>
                    <Sparkles className="w-5 h-5" />
                    <span>Launch Project Blueprint</span>
                </>
                )}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;