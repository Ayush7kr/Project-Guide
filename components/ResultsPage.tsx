
import React, { useState, useEffect } from 'react';
import { ProjectBlueprint, ProjectStrategy, DeepResearchReport } from '../types';
import ToolCard from './ToolCard';
import SuccessPath from './SuccessPath';
import ExecutionStrategy from './ExecutionStrategy';
import RiskRadar from './RiskRadar';
import ImplementationModal from './ImplementationModal';
import ArchitectChat from './ArchitectChat';
import DeepResearchModal from './DeepResearchModal';
import { regenerateProjectName, generateDeepResearch } from '../services/geminiService';
import { supabase } from '../lib/supabaseClient';
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
  Sparkles, 
  Save, 
  Loader2, 
  Check, 
  HelpCircle, 
  Scissors,
  Github,
  ExternalLink,
  CloudCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

interface ResultsPageProps {
  blueprint: ProjectBlueprint;
  onReset: () => void;
  session: any;
  onAuthRequest: () => void;
  projectId: string | null;
  onBlueprintUpdate: (blueprint: ProjectBlueprint) => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ 
    blueprint, 
    onReset, 
    session, 
    onAuthRequest, 
    projectId, 
    onBlueprintUpdate 
}) => {
  const [currentProjectName, setCurrentProjectName] = useState(blueprint.projectName);
  const [isRegeneratingName, setIsRegeneratingName] = useState(false);
  const [useAlternative, setUseAlternative] = useState(false);
  const [isImplementationOpen, setIsImplementationOpen] = useState(false);
  
  // Save State
  const [activeProjectId, setActiveProjectId] = useState<string | null>(projectId);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [savingNodeId, setSavingNodeId] = useState<string | null>(null);
  const [justSynced, setJustSynced] = useState(false);
  
  // Deep Research State
  const [isResearchOpen, setIsResearchOpen] = useState(false);
  const [researchLoading, setResearchLoading] = useState(false);
  const [researchData, setResearchData] = useState<DeepResearchReport | null>(blueprint.deepResearch || null);

  // Resume Tip Copy State
  const [resumeCopied, setResumeCopied] = useState(false);

  // Sync active ID if prop changes (e.g. from Dashboard)
  useEffect(() => {
    setActiveProjectId(projectId);
  }, [projectId]);

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

  const handleSaveProject = async (blueprintToSave: ProjectBlueprint = blueprint) => {
    if (!session) {
      onAuthRequest();
      return;
    }

    setIsSaving(true);
    try {
      // Include research data in save if available
      const dataToSave = { ...blueprintToSave, projectName: currentProjectName, deepResearch: researchData || undefined };

      if (activeProjectId) {
        // Update Existing
        const { error } = await supabase
          .from('projects')
          .update({ 
              name: currentProjectName, 
              blueprint_data: dataToSave 
          })
          .eq('id', activeProjectId);

        if (error) throw error;
      } else {
        // Insert New
        const { data, error } = await supabase
          .from('projects')
          .insert([
            {
              user_id: session.user.id,
              name: currentProjectName,
              description: blueprintToSave.projectDomain,
              blueprint_data: dataToSave
            }
          ])
          .select()
          .single();

        if (error) throw error;
        if (data) setActiveProjectId(data.id);
      }

      setSaveSuccess(true);
      setJustSynced(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setJustSynced(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Failed to save project. Please check the console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNodeToggle = async (nodeId: string) => {
    // 1. Calculate the New State completely fresh
    const newSuccessPath = blueprint.successPath.map(phase => ({
        ...phase,
        nodes: phase.nodes.map(node => {
            if (node.id === nodeId) {
                return { ...node, completed: !node.completed };
            }
            return node;
        })
    }));

    const newBlueprint = { ...blueprint, successPath: newSuccessPath };

    // 2. Update Local State via Parent immediately
    onBlueprintUpdate(newBlueprint);

    // 3. Persist to DB if project is already saved
    if (session && activeProjectId) {
        setAutoSaving(true);
        setSavingNodeId(nodeId);
        try {
            // CRITICAL: We must send the 'newBlueprint' object we just created.
            const { error } = await supabase
              .from('projects')
              .update({ blueprint_data: newBlueprint })
              .eq('id', activeProjectId);
            
            if (error) throw error;
            
            setJustSynced(true);
            setTimeout(() => setJustSynced(false), 2000);
            console.log("Auto-saved progress to Supabase");
        } catch (err) {
            console.error("Auto-save error:", err);
            // Optional: Revert local state if save fails, but for now we just alert
        } finally {
            setSavingNodeId(null);
            setTimeout(() => setAutoSaving(false), 500);
        }
    } else if (!activeProjectId && session) {
        // Prompt user to save first time they click a checkmark
        if (window.confirm("Save your project to track progress?")) {
           handleSaveProject(newBlueprint);
        }
    }
  };
  
  const handleDeepResearch = async () => {
    setIsResearchOpen(true);
    if (researchData) return; // Don't regenerate if we have it

    setResearchLoading(true);
    try {
       const report = await generateDeepResearch(currentProjectName, blueprint.projectDomain);
       setResearchData(report);
       // Auto-save the research to the project if connected
       if (activeProjectId) {
           const newBlueprint = { ...blueprint, deepResearch: report };
           onBlueprintUpdate(newBlueprint); // Update local
           // Update remote
           await supabase
            .from('projects')
            .update({ blueprint_data: newBlueprint })
            .eq('id', activeProjectId);
       }
    } catch (error) {
       console.error(error);
    } finally {
       setResearchLoading(false);
    }
  };

  const handleResumeCopy = () => {
    navigator.clipboard.writeText(blueprint.resumeTip);
    setResumeCopied(true);
    setTimeout(() => setResumeCopied(false), 2000);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;
    let y = margin;

    const checkPageBreak = (spaceNeeded: number) => {
        if (y + spaceNeeded > 280) {
            doc.addPage();
            y = margin;
        }
    };

    // --- TITLE PAGE ---
    doc.setFontSize(24);
    doc.setTextColor(15, 23, 42); 
    doc.text("ToolWise Project Dossier", margin, y);
    y += 15;
    
    doc.setFontSize(18);
    doc.setTextColor(13, 148, 136); // Teal
    doc.text(currentProjectName, margin, y);
    y += 10;

    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105); 
    const descLines = doc.splitTextToSize(`${blueprint.projectDomain} | Est. Time: ${blueprint.estimatedDuration}`, maxLineWidth);
    doc.text(descLines, margin, y);
    y += (descLines.length * 7) + 10;

    // --- TECH STACK ---
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`Tech Stack: ${activeStrategy.strategyName}`, margin, y);
    y += 8;

    activeStrategy.tools.forEach(tool => {
        checkPageBreak(25);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`• ${tool.name} (${tool.category})`, margin + 5, y);
        y += 6;
        
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        const reasonLines = doc.splitTextToSize(`  Why: ${tool.reason}`, maxLineWidth - 10);
        doc.text(reasonLines, margin + 5, y);
        y += (reasonLines.length * 5) + 4;
    });
    y += 10;

    // --- TEAM ROLES ---
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Team Roles & Responsibilities", margin, y);
    y += 8;

    activeStrategy.teamRoles.forEach(role => {
        checkPageBreak(30);
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`${role.title}`, margin + 5, y);
        y += 6;

        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        const focusLines = doc.splitTextToSize(`Focus: ${role.focus}`, maxLineWidth - 10);
        doc.text(focusLines, margin + 5, y);
        y += (focusLines.length * 5) + 4;
    });
    y += 10;

    // --- SUCCESS PATH ---
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Implementation Roadmap", margin, y);
    y += 8;

    blueprint.successPath.forEach(phase => {
        checkPageBreak(20);
        doc.setFontSize(12);
        doc.setTextColor(13, 148, 136);
        doc.text(phase.phaseName, margin + 5, y);
        y += 8;

        phase.nodes.forEach(node => {
            checkPageBreak(20);
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(`[ ] ${node.title}`, margin + 10, y);
            y += 6;
            
            doc.setTextColor(100, 116, 139);
            const nodeDesc = doc.splitTextToSize(node.description, maxLineWidth - 20);
            doc.text(nodeDesc, margin + 15, y);
            y += (nodeDesc.length * 5) + 4;
        });
        y += 4;
    });

    // Save
    doc.save(`${currentProjectName.replace(/\s+/g, '_')}_Dossier.pdf`);
  };

  // --- GitHub Inspiration Logic (Refined) ---
  const primaryTech = activeStrategy.tools[0]?.name || 'Web';
  // Simplified query: "React E-Commerce template" results in better matches than complex queries
  const safeCategory = blueprint.projectDomain.replace(/[^\w\s-]/gi, '').trim(); 
  const githubQuery = `${primaryTech} ${safeCategory} template`.replace(/\s+/g, '+');
  const githubInspirationUrl = `https://github.com/search?q=${githubQuery}&type=repositories&s=stars&o=desc`;

  return (
    <div className="min-h-screen pb-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
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
            <div className="flex items-center space-x-3">
              {justSynced && (
                  <div className="flex items-center text-green-400 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 mr-2">
                      <CloudCheck className="w-4 h-4 mr-1" />
                      Synced to Cloud
                  </div>
              )}
              {autoSaving && !justSynced && (
                  <div className="flex items-center text-teal-400 text-xs font-bold uppercase tracking-wider animate-pulse mr-2">
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Saving...
                  </div>
              )}
              <button 
                  onClick={() => handleSaveProject(blueprint)}
                  disabled={isSaving || saveSuccess}
                  className={`flex items-center space-x-2 border border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm ${
                    saveSuccess ? 'bg-green-500/20 text-green-300 border-green-500/50' : 'bg-white/10 hover:bg-white/20'
                  }`}
              >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : saveSuccess ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Project'}</span>
              </button>
              <button 
                  onClick={handleExportPDF}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
              >
                  <FileDown className="w-4 h-4" />
                  <span>Export Dossier</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full px-3 py-1 mb-4 relative group cursor-help">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span className="text-xs font-semibold tracking-wide uppercase text-teal-400">Blueprint Generated</span>
                <HelpCircle className="w-3 h-3 text-slate-400 ml-1" />
              </div>

              <div className="flex items-center space-x-4 mb-4 group">
                 <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">{currentProjectName}</h1>
                 <button 
                   onClick={handleRegenerateName}
                   disabled={isRegeneratingName}
                   className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-slate-300 hover:text-teal-300 transition-all relative group/tooltip"
                 >
                   <Sparkles className={`w-5 h-5 ${isRegeneratingName ? 'animate-spin text-teal-400' : ''}`} />
                 </button>
              </div>
              <p className="text-slate-400 text-xl max-w-2xl font-light">{blueprint.projectDomain}</p>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto">
                {/* Deep Research Button */}
                <button 
                    onClick={handleDeepResearch}
                    className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/30 group"
                >
                    <BrainCircuit className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Start Deep Research</span>
                </button>

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
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-16 relative z-20 space-y-16">
        
        {/* 2. Stack Switcher Control */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
            <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${useAlternative ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'}`}>
                    {useAlternative ? <BrainCircuit className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Current Strategy: {activeStrategy.strategyName}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{activeStrategy.description}</p>
                </div>
            </div>
            
            <button 
                onClick={() => setUseAlternative(!useAlternative)}
                className="flex items-center space-x-2 text-sm font-bold px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
            >
                {useAlternative ? <ToggleRight className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> : <ToggleLeft className="w-6 h-6 text-teal-600 dark:text-teal-400" />}
                <span>Compare: {useAlternative ? blueprint.strategies.recommended.strategyName : blueprint.strategies.alternative.strategyName}</span>
            </button>
        </div>

        {/* 3. Primary Stack Grid */}
        <section>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Recommended Tech Stack</h2>
            </div>
            <AnimatePresence mode='wait'>
                <motion.div 
                    key={activeStrategy.strategyName}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {activeStrategy.tools.map((tool, index) => (
                            <ToolCard key={`${activeStrategy.strategyName}-${index}`} tool={tool} />
                        ))}
                    </div>

                    {activeStrategy.tradeOffs && activeStrategy.tradeOffs.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 transition-colors">
                            <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                                <Scissors className="w-4 h-4 mr-2" />
                                The Cutting Room Floor (Trade-offs)
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                {activeStrategy.tradeOffs.map((tradeOff, idx) => (
                                    <div key={idx} className="flex items-start space-x-3 text-sm">
                                        <div className="min-w-[4px] h-full bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                                        <div>
                                            <span className="font-bold text-slate-700 dark:text-slate-300 line-through decoration-slate-400 dark:decoration-slate-500">{tradeOff.toolName}</span>
                                            <span className="text-slate-600 dark:text-slate-400 block mt-1">{tradeOff.reasonExcluded}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* NEW: Project Inspiration Card (Updated Logic) */}
            <div className="mt-8 bg-[#0d1117] rounded-xl p-6 border border-slate-700 relative overflow-hidden group">
                 <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
                     <div className="flex items-start space-x-4 mb-4 md:mb-0">
                         <div className="bg-white p-2 rounded-full shrink-0">
                            <Github className="w-8 h-8 text-[#0d1117]" />
                         </div>
                         <div>
                             <h3 className="text-white font-bold text-lg">Project Inspiration</h3>
                             <p className="text-slate-400 text-sm mt-1 max-w-lg">
                                Find 5-star boilerplate repositories on GitHub matching your exact stack and concept.
                             </p>
                         </div>
                     </div>
                     <a 
                       href={githubInspirationUrl}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center space-x-2 bg-white text-[#0d1117] px-6 py-3 rounded-lg font-bold hover:bg-slate-200 transition-colors shadow-lg hover:scale-105 transform duration-200"
                     >
                        <span>Find Similar Projects</span>
                        <ExternalLink className="w-4 h-4" />
                     </a>
                 </div>
            </div>
        </section>

        {/* 4. Execution & Architecture */}
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

        {/* 5. Success Path */}
        <section>
            <SuccessPath 
              phases={blueprint.successPath} 
              projectName={currentProjectName}
              onToggleNode={handleNodeToggle}
              savingNodeId={savingNodeId}
            />
        </section>

        {/* 6. Risk Radar */}
        <section>
            <RiskRadar risks={blueprint.risks} />
        </section>
        
        {/* 7. Resume Tip */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="p-4 bg-white/10 rounded-xl">
                   <Linkedin className="w-8 h-8 text-teal-400" />
                </div>
                <div className="flex-grow">
                   <h3 className="text-xl font-bold mb-3">Resume Power Liner</h3>
                   
                   <button 
                     onClick={handleResumeCopy}
                     className="w-full text-left group"
                   >
                     <div className="bg-black/30 border border-white/10 group-hover:border-teal-500/50 rounded-xl p-5 font-mono text-base text-teal-100 transition-all relative">
                        {blueprint.resumeTip}
                        <div className={`absolute top-2 right-2 flex items-center space-x-1 text-xs font-bold px-2 py-1 rounded bg-teal-500/20 text-teal-300 transition-opacity ${resumeCopied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                           {resumeCopied ? <Check className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                           <span>{resumeCopied ? 'Copied' : 'Click to Copy'}</span>
                        </div>
                     </div>
                   </button>
                </div>
             </div>
        </section>

      </main>

      {/* Floating Actions */}
      <div className="fixed bottom-6 right-6 md:right-10 flex flex-col space-y-3 z-50">
        <button 
          onClick={onReset}
          className="bg-teal-600 text-white p-4 rounded-full shadow-lg shadow-teal-600/30 hover:bg-teal-700 transition-all hover:scale-105 flex items-center justify-center"
          title="Start New Project"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>

      <ArchitectChat 
        blueprint={blueprint} 
        currentStrategyName={activeStrategy.strategyName} 
      />

      <ImplementationModal 
        isOpen={isImplementationOpen} 
        onClose={() => setIsImplementationOpen(false)} 
        blueprint={blueprint}
        strategy={activeStrategy}
      />
      
      <DeepResearchModal 
        isOpen={isResearchOpen}
        onClose={() => setIsResearchOpen(false)}
        loading={researchLoading}
        data={researchData}
      />

    </div>
  );
};

export default ResultsPage;
