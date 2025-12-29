import React from 'react';
import { Tool, DifficultyLevel } from '../types';
import { 
  Database, 
  Code, 
  Layout, 
  Server, 
  Cloud, 
  Cpu, 
  Globe, 
  Terminal,
  CheckCircle2,
  GraduationCap,
  ExternalLink,
  Youtube,
  BookOpen,
  PlayCircle
} from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

const getIconForCategory = (category: string) => {
  const lowerCat = category.toLowerCase();
  if (lowerCat.includes('data')) return <Database className="w-6 h-6" />;
  if (lowerCat.includes('web') || lowerCat.includes('front')) return <Layout className="w-6 h-6" />;
  if (lowerCat.includes('back') || lowerCat.includes('api')) return <Server className="w-6 h-6" />;
  if (lowerCat.includes('cloud') || lowerCat.includes('host')) return <Cloud className="w-6 h-6" />;
  if (lowerCat.includes('ai') || lowerCat.includes('ml')) return <BrainIcon className="w-6 h-6" />; 
  if (lowerCat.includes('lang')) return <Terminal className="w-6 h-6" />;
  return <Code className="w-6 h-6" />;
};

const BrainIcon = (props: any) => <Cpu {...props} />;

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const difficultyColor = {
    [DifficultyLevel.Beginner]: 'bg-green-100 text-green-800 border-green-200',
    [DifficultyLevel.Intermediate]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [DifficultyLevel.Advanced]: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="group relative bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-teal-400 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-slate-50 rounded-xl text-slate-700 group-hover:text-teal-600 group-hover:bg-teal-50 transition-colors shadow-sm">
            {getIconForCategory(tool.category)}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-lg leading-tight">{tool.name}</h4>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{tool.category}</span>
          </div>
        </div>
        <span className={`text-[11px] px-2.5 py-1 rounded-full border font-bold ${difficultyColor[tool.difficulty as DifficultyLevel] || difficultyColor.Intermediate}`}>
          {tool.difficulty}
        </span>
      </div>

      {/* Body */}
      <div className="flex-grow mb-6">
        <p className="text-base text-slate-700 leading-relaxed font-normal">
          {tool.reason}
        </p>
      </div>

      {/* Footer / Dual-Track Learning */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
         <div className="flex items-center justify-between">
            {tool.isStudentFriendly && (
            <div className="flex items-center space-x-1.5 text-teal-700 bg-teal-50 px-2 py-1 rounded-md">
                <GraduationCap className="w-4 h-4" />
                <span className="text-xs font-bold">Student Friendly</span>
            </div>
            )}
            {!tool.isStudentFriendly && <div />} 
         </div>

         <div className="grid grid-cols-2 gap-3">
            <a 
              href={tool.docsUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-slate-200"
            >
               <BookOpen className="w-4 h-4" />
               <span>Read Docs</span>
            </a>
            <a 
              href={tool.tutorialUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-red-100"
            >
               <PlayCircle className="w-4 h-4" />
               <span>Watch Guide</span>
            </a>
         </div>
      </div>
    </div>
  );
};

export default ToolCard;