import React from 'react';
import { ResourceAnalysis, BudgetDetail, TeamRole, FileNode } from '../types';
import { HardDrive, Banknote, Users, CheckCircle, CloudLightning, GraduationCap, Layers, FileCode, ArrowRight } from 'lucide-react';
import FolderTree from './FolderTree';

interface ExecutionStrategyProps {
  resources: ResourceAnalysis;
  budget: BudgetDetail[];
  team: TeamRole[];
  folderStructure: FileNode[];
  strategyName: string;
  dataFlow?: string[]; // Added prop
}

const ExecutionStrategy: React.FC<ExecutionStrategyProps> = ({ resources, budget, team, folderStructure, strategyName, dataFlow }) => {
  
  const totalCost = "$0.00";

  const handleCopyStructure = () => {
    const text = JSON.stringify(folderStructure, null, 2);
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center">
            <Layers className="w-8 h-8 mr-3 text-teal-600" />
            Execution & Architecture
        </h2>
        <span className="text-sm font-mono bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-semibold">
            Strategy: {strategyName}
        </span>
      </div>

      {/* NEW: Data Flow Diagram */}
      {dataFlow && dataFlow.length > 0 && (
        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 shadow-lg text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
             <h3 className="text-xl font-bold mb-6 flex items-center relative z-10">
                <CloudLightning className="w-5 h-5 mr-2 text-teal-400" />
                System Data Flow
             </h3>
             <div className="flex flex-wrap items-center gap-4 relative z-10">
                {dataFlow.map((node, idx) => (
                    <React.Fragment key={idx}>
                        <div className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-xl font-mono text-sm md:text-base font-semibold text-teal-100 shadow-md">
                            {node}
                        </div>
                        {idx < dataFlow.length - 1 && (
                            <ArrowRight className="w-5 h-5 text-slate-500" />
                        )}
                    </React.Fragment>
                ))}
             </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Hardware & Budget (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
            {/* 1. Hardware */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-5">
                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700">
                <HardDrive className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Hardware Analysis</h3>
            </div>

            <div className="space-y-6">
                <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                    <span>Est. Load</span>
                    <span>{resources.resourceIntensity}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                        resources.resourceIntensity > 75 ? 'bg-amber-500' : 'bg-teal-500'
                    }`} 
                    style={{ width: `${resources.resourceIntensity}%` }}
                    ></div>
                </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-xs text-slate-500 font-bold mb-1">CPU</div>
                        <div className="font-bold text-slate-800">{resources.cpuLevel}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-xs text-slate-500 font-bold mb-1">RAM</div>
                        <div className="font-bold text-slate-800">{resources.ramEstimate}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-xs text-slate-500 font-bold mb-1">Disk</div>
                        <div className="font-bold text-slate-800">{resources.diskLevel}</div>
                    </div>
                </div>

                <p className="text-base text-slate-600 border-l-4 border-teal-200 pl-4 italic leading-relaxed">
                "{resources.summary}"
                </p>

                {resources.cloudTip && (
                <div className="bg-amber-50 text-amber-900 text-sm p-4 rounded-xl flex items-start space-x-3 border border-amber-100">
                    <CloudLightning className="w-5 h-5 mt-0.5 flex-shrink-0 text-amber-600" />
                    <span>
                    <strong className="block mb-1 text-amber-700">Cloud Tip</strong>
                    {resources.cloudTip}
                    </span>
                </div>
                )}
            </div>
            </div>

            {/* 2. Budget */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -mr-6 -mt-6 z-0"></div>
            <div className="flex items-center space-x-3 mb-5 relative z-10">
                <div className="p-2.5 bg-teal-50 rounded-lg text-teal-700">
                <Banknote className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Budget Breakdown</h3>
            </div>
            <div className="relative z-10">
                <div className="mb-6">
                <div className="text-sm font-medium text-slate-500 mb-1">Estimated MVP Cost</div>
                <div className="text-4xl font-extrabold text-slate-900">{totalCost}</div>
                </div>
                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {budget.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between text-sm group">
                    <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                        <div>
                        <span className="font-bold text-slate-800 block text-base">{item.toolName}</span>
                        <span className="text-xs text-slate-500 font-medium">{item.freeTierInfo}</span>
                        </div>
                    </div>
                    {item.inStudentPack && (
                        <div className="flex-shrink-0" title="Included in GitHub Student Developer Pack">
                        <GraduationCap className="w-5 h-5 text-indigo-500" />
                        </div>
                    )}
                    </div>
                ))}
                </div>
            </div>
            </div>
        </div>

        {/* MIDDLE COLUMN: Team Roles (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="flex items-center space-x-3 mb-5">
            <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
                <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Squad Roles ({team.length})</h3>
            </div>

            <div className="flex-grow space-y-4 overflow-y-auto custom-scrollbar max-h-[600px]">
            {team.map((member, idx) => (
                <div key={idx} className="group relative bg-slate-50 rounded-xl p-4 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-indigo-100 cursor-default">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 text-base">{member.title}</h4>
                    <span className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-500 font-bold uppercase group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    Role {idx + 1}
                    </span>
                </div>
                
                <p className="text-sm text-slate-600 mb-3 font-medium leading-relaxed">{member.focus}</p>
                
                <div className="space-y-3">
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Priorities</span>
                        <ul className="text-xs text-slate-600 mt-2 space-y-1.5 font-medium">
                            {member.keyTasks.slice(0, 3).map((task, tIdx) => (
                                <li key={tIdx} className="flex items-start">
                                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></span> 
                                <span className="leading-snug">{task}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                         <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Owns Files</span>
                         <div className="flex flex-wrap gap-1.5 mt-2">
                            {member.ownedFiles.map((file, fIdx) => (
                                <span key={fIdx} className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                                    {file}
                                </span>
                            ))}
                         </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* RIGHT COLUMN: Folder Structure (4 cols) */}
        <div className="lg:col-span-4 h-full">
            <FolderTree structure={folderStructure} onCopy={handleCopyStructure} />
        </div>

      </div>
    </div>
  );
};

export default ExecutionStrategy;