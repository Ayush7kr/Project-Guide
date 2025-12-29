import React, { useState } from 'react';
import { ProjectBlueprint, ProjectStrategy } from '../types';
import ToolCard from './ToolCard';
import SuccessPath from './SuccessPath';
import ExecutionStrategy from './ExecutionStrategy';
import RiskRadar from './RiskRadar';
import ImplementationModal from './ImplementationModal';
import ArchitectChat from './ArchitectChat';
import { regenerateProjectName } from '../services/geminiService';
import { 
  ArrowLeft, 
  RefreshCw, 
  Clock, 
  BarChart3, 
  ToggleLeft,
  ToggleRight,
  Zap,
  BrainCircuit,
  FileDown,
  Code2,
  Linkedin,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

interface ResultsPageProps {
  blueprint: ProjectBlueprint;
  onReset: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ blueprint, onReset }) => {
  const [currentProjectName, setCurrentProjectName] = useState(blueprint.projectName);
  const [isRegeneratingName, setIsRegeneratingName] = useState(false);
  const [useAlternative, setUseAlternative] = useState(false);
  const [isImplementationOpen, setIsImplementationOpen] = useState(false);

  // Determine which strategy to display based on toggle
  const activeStrategy: ProjectStrategy = useAlternative 
    ? blueprint.strategies.alternative 
    : blueprint.strategies.recommended;

  const handleRegenerateName = async () => {
    setIsRegeneratingName(true);
    const newName = await regenerateProjectName(blueprint.projectDomain, currentProjectName);
    setCurrentProjectName(newName);
    setIsRegeneratingName(false);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;
    const lineHeight = 7;

    // Helper for page breaks
    const checkPageBreak = (spaceNeeded: number) => {
        if (y + spaceNeeded > 280) {
            doc.addPage();
            y = margin;
        }
    };

    // --- Header ---
    doc.setFontSize(24);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text("ToolWise Project Dossier", margin, y);
    y += 12;
    
    doc.setFontSize(16);
    doc.setTextColor(13, 148, 136); // Teal 600
    doc.text(currentProjectName, margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(`${blueprint.projectDomain} | Est. Time: ${blueprint.estimatedDuration}`, margin, y);
    y += 15;

    // --- Strategy Overview ---
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`Selected Strategy: ${activeStrategy.strategyName}`, margin, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85); // Slate 700
    const descLines = doc.splitTextToSize(activeStrategy.description, 170);
    doc.text(descLines, margin, y);
    y += descLines.length * 5 + 10;

    // --- Tech Stack ---
    checkPageBreak(60);
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Technical Stack", margin, y);
    y += 8;
    
    activeStrategy.tools.forEach(tool => {
        checkPageBreak(15);
        doc.setFontSize(11);
        doc.setTextColor(13, 148, 136); // Teal
        doc.text(`• ${tool.name} (${tool.category})`, margin + 2, y);
        y += 5;
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const reasonLines = doc.splitTextToSize(`Why: ${tool.reason}`, 160);
        doc.text(reasonLines, margin + 5, y);
        y += reasonLines.length * 4 + 4;
    });
    y += 5;

    // --- Hardware & Budget ---
    checkPageBreak(50);
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Resource Analysis", margin, y);
    y += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(`CPU Load: ${activeStrategy.resourceAnalysis.cpuLevel} | RAM: ${activeStrategy.resourceAnalysis.ramEstimate}`, margin + 2, y);
    y += 5;
    doc.text(`Resource Intensity: ${activeStrategy.resourceAnalysis.resourceIntensity}%`, margin + 2, y);
    y += 5;
    
    const summaryLines = doc.splitTextToSize(`Summary: ${activeStrategy.resourceAnalysis.summary}`, 170);
    doc.text(summaryLines, margin + 2, y);
    y += summaryLines.length * 5 + 10;

    // --- Risks ---
    checkPageBreak(60);
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Risk Radar", margin, y);
    y += 8;

    blueprint.risks.forEach(risk => {
        checkPageBreak(20);
        doc.setFontSize(11);
        doc.setTextColor(180, 83, 9); // Amber 700
        doc.text(`! ${risk.title} (${risk.severity})`, margin + 2, y);
        y += 5;
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const mitigation = doc.splitTextToSize(`Mitigation: ${risk.mitigation}`, 160);
        doc.text(mitigation, margin + 5, y);
        y += mitigation.length * 4 + 4;
    });
    y += 5;

    // --- Data Flow ---
    if (blueprint.dataFlow && blueprint.dataFlow.length > 0) {
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text("System Data Flow", margin, y);
        y += 8;
        
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        const flowText = blueprint.dataFlow.join(" -> ");
        const flowLines = doc.splitTextToSize(flowText, 170);
        doc.text(flowLines, margin + 2, y);
        y += flowLines.length * 5 + 10;
    }

    // --- Roles ---
    checkPageBreak(50);
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Team Roles", margin, y);
    y += 8;
    
    activeStrategy.teamRoles.forEach(role => {
        checkPageBreak(15);
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        doc.text(`${role.title}`, margin + 2, y);
        y += 5;
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(`Focus: ${role.focus}`, margin + 5, y);
        y += 7;
    });

    // --- Roadmap / Success Path Summary ---
    checkPageBreak(60);
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Success Path Roadmap", margin, y);
    y += 8;

    blueprint.successPath.forEach((phase) => {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setTextColor(13, 148, 136); // Teal
      doc.text(phase.phaseName, margin + 2, y);
      y += 6;
      
      phase.nodes.forEach((node, idx) => {
         checkPageBreak(15);
         doc.setFontSize(10);
         doc.setTextColor(51, 65, 85);
         doc.text(`${idx + 1}. ${node.title}`, margin + 5, y);
         y += 5;
      });
      y += 5;
    });

    // --- Footer ---
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Generated by ToolWise AI Architect", margin, 280);

    doc.save(`${currentProjectName.replace(/\s+/g, '_')}_Dossier.pdf`);
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      
      {/* 1. Page Header & Summary */}
      <header className="relative bg-slate-900 text-white pt-12 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex justify-between items-start mb-8">
            <button 
                onClick={onReset}
                className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
            </button>
            <button 
                onClick={handleExportPDF}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
            >
                <FileDown className="w-4 h-4" />
                <span>Export Dossier</span>
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full px-3 py-1 mb-4">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span className="text-xs font-semibold tracking-wide uppercase text-teal-400">Blueprint Generated</span>
              </div>
              <div className="flex items-center space-x-4 mb-4 group">
                 <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">{currentProjectName}</h1>
                 <button 
                   onClick={handleRegenerateName}
                   disabled={isRegeneratingName}
                   className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-slate-300 hover:text-teal-300 transition-all relative group/tooltip"
                 >
                   <Sparkles className={`w-5 h-5 ${isRegeneratingName ? 'animate-spin text-teal-400' : ''}`} />
                   <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Click to try a new name
                   </span>
                 </button>
              </div>
              <p className="text-slate-400 text-xl max-w-2xl font-light">{blueprint.projectDomain}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl max-w-sm w-full">
              <div className="flex items-start space-x-4">
                <BarChart3 className="w-6 h-6 text-teal-300 mt-1" />
                <div>
                  <h4 className="font-bold text-white text-base">AI Complexity Analysis</h4>
                  <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                    {blueprint.complexitySummary}
                  </p>
                  <div className="flex items-center mt-3 text-sm text-teal-300 font-mono">
                    <Clock className="w-4 h-4 mr-2" />
                    Est. Time: {blueprint.estimatedDuration}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-16 relative z-20 space-y-16">
        
        {/* 2. Stack Switcher Control */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${useAlternative ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'}`}>
                    {useAlternative ? <BrainCircuit className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Current Strategy: {activeStrategy.strategyName}</h3>
                    <p className="text-sm text-slate-500 font-medium">{activeStrategy.description}</p>
                </div>
            </div>
            
            <button 
                onClick={() => setUseAlternative(!useAlternative)}
                className="flex items-center space-x-2 text-sm font-bold px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
                {useAlternative ? <ToggleRight className="w-6 h-6 text-indigo-600" /> : <ToggleLeft className="w-6 h-6 text-teal-600" />}
                <span>Compare: {useAlternative ? blueprint.strategies.recommended.strategyName : blueprint.strategies.alternative.strategyName}</span>
            </button>
        </div>

        {/* 3. Primary Stack Grid (Animated) */}
        <section>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Recommended Tech Stack</h2>
            </div>
            <AnimatePresence mode='wait'>
                <motion.div 
                    key={activeStrategy.strategyName}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {activeStrategy.tools.map((tool, index) => (
                        <ToolCard key={`${activeStrategy.strategyName}-${index}`} tool={tool} />
                    ))}
                </motion.div>
            </AnimatePresence>
        </section>

        {/* 4. Execution & Architecture Strategy (Updates with toggle) */}
        <section className="relative">
          <div className="flex items-center justify-end mb-6">
             <button 
                onClick={() => setIsImplementationOpen(true)}
                className="flex items-center space-x-2 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30"
             >
                <Code2 className="w-5 h-5" />
                <span>Open Step-by-Step Code Guide</span>
             </button>
          </div>
          <ExecutionStrategy 
            resources={activeStrategy.resourceAnalysis}
            budget={activeStrategy.budgetBreakdown}
            team={activeStrategy.teamRoles}
            folderStructure={activeStrategy.folderStructure}
            strategyName={activeStrategy.strategyName}
            dataFlow={blueprint.dataFlow}
          />
        </section>

        {/* 5. Success Path (Interactive Roadmap) */}
        <section>
            <SuccessPath phases={blueprint.successPath} />
        </section>

        {/* 6. Risk Radar (Global) */}
        <section>
            <RiskRadar risks={blueprint.risks} />
        </section>
        
        {/* 7. Resume Tip */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="p-4 bg-white/10 rounded-xl">
                   <Linkedin className="w-8 h-8 text-teal-400" />
                </div>
                <div>
                   <h3 className="text-xl font-bold mb-3">Resume Power Liner</h3>
                   <div className="bg-black/30 border border-white/10 rounded-xl p-5 font-mono text-base text-teal-100 select-all">
                      {blueprint.resumeTip}
                   </div>
                   <p className="text-sm text-slate-400 mt-2 font-medium">Copy this directly to your LinkedIn 'Projects' section or CV.</p>
                </div>
             </div>
        </section>

      </main>

      {/* Floating Actions (Removed Copy, only Refresh) */}
      <div className="fixed bottom-6 right-6 md:right-10 flex flex-col space-y-3 z-50">
        <button 
          onClick={onReset}
          className="bg-teal-600 text-white p-4 rounded-full shadow-lg shadow-teal-600/30 hover:bg-teal-700 transition-all hover:scale-105 flex items-center justify-center"
          title="Start New Project"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      {/* Architect Chat Widget */}
      <ArchitectChat 
        blueprint={blueprint} 
        currentStrategyName={activeStrategy.strategyName} 
      />

      {/* Implementation Modal */}
      <ImplementationModal 
        isOpen={isImplementationOpen} 
        onClose={() => setIsImplementationOpen(false)} 
        blueprint={blueprint}
        strategy={activeStrategy}
      />

    </div>
  );
};

export default ResultsPage;