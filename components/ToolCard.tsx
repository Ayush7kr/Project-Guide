import React from 'react';
import { Tool, DifficultyLevel } from '../types';
import { 
  Database, 
  Code, 
  Layout, 
  Server, 
  Cloud, 
  Cpu, 
  Terminal,
  GraduationCap,
  BookOpen,
  PlayCircle,
  TrendingUp,
  BarChart
} from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

const getIconForCategory = (category?: string) => {
  if (!category) return <Code className="w-6 h-6" />;
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
    [DifficultyLevel.Beginner]: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    [DifficultyLevel.Intermediate]: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
    [DifficultyLevel.Advanced]: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
  };

  // Determine badge color based on market insight content
  const getDemandStyle = (insight: string) => {
    const lower = insight.toLowerCase();
    if (lower.includes('high') || lower.includes('critical') || lower.includes('top')) {
      return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300';
    }
    if (lower.includes('rising') || lower.includes('trend') || lower.includes('growing')) {
      return 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300';
    }
    return 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300';
  };

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-teal-400 dark:hover:border-teal-500 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors shadow-sm">
            {getIconForCategory(tool.category)}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{tool.name}</h4>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{tool.category || 'Tool'}</span>
          </div>
        </div>
        <span className={`text-[11px] px-2.5 py-1 rounded-full border font-bold ${difficultyColor[tool.difficulty as DifficultyLevel] || difficultyColor.Intermediate}`}>
          {tool.difficulty || 'Intermediate'}
        </span>
      </div>

      {/* Market Demand Badge */}
      {tool.marketInsight && (
        <div className={`mb-4 flex items-start p-2 rounded-lg border ${getDemandStyle(tool.marketInsight)}`}>
            <div className="mr-2 mt-0.5"><TrendingUp className="w-4 h-4" /></div>
            <div>
                <span className="text-[10px] font-bold uppercase opacity-70 block mb-0.5">Market Demand</span>
                <span className="text-xs font-bold block leading-snug">{tool.marketInsight}</span>
            </div>
        </div>
      )}

      {/* Body */}
      <div className="flex-grow mb-6 space-y-3">
        <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {tool.reason}
        </p>
      </div>

      {/* Footer / Dual-Track Learning */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
         <div className="flex items-center justify-between">
            {tool.isStudentFriendly && (
            <div className="flex items-center space-x-1.5 text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-md border border-teal-100 dark:border-teal-800">
                <GraduationCap className="w-4 h-4" />
                <span className="text-xs font-bold">Student Friendly</span>
            </div>
            )}
            {!tool.isStudentFriendly && <div />} 
         </div>
         
         <p className="text-[10px] text-slate-400 italic text-center">
            Links open curated searches for reliability.
         </p>

         <div className="grid grid-cols-2 gap-3">
            <a 
              href={tool.docsUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-2.5 rounded-lg text-sm font-semibold transition-colors border border-slate-200 dark:border-slate-600"
            >
               <BookOpen className="w-4 h-4" />
               <span>Read Docs</span>
            </a>
            <a 
              href={tool.tutorialUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center space-x-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-red-100 dark:border-red-900/50"
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