
import React, { useState, useEffect } from 'react';
import { ProjectBlueprint, ProjectStrategy, StarterKit, CodeFile } from '../types';
import { generateStarterKit } from '../services/geminiService';
import { X, Copy, Check, FileCode, Loader2, Code, Terminal, Play, Hammer, FilePlus, Lock, AlertTriangle, Bug } from 'lucide-react';

interface ImplementationModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: ProjectBlueprint;
  strategy: ProjectStrategy;
}

const ImplementationModal: React.FC<ImplementationModalProps> = ({ isOpen, onClose, blueprint, strategy }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StarterKit | null>(null);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'code' | 'setup' | 'env' | 'debug'>('code');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && !data) {
      setLoading(true);
      generateStarterKit(blueprint, strategy)
        .then(res => {
          setData(res);
          setLoading(false);
          setActiveFileIndex(0);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isOpen, blueprint, strategy, data]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeFile = data?.files[activeFileIndex];

  // Logic to clean up install command (remove newlines, use correct package manager)
  const cleanInstallCommand = (cmd?: string) => {
    if (!cmd) return "Loading...";
    // Remove newlines and multiple spaces
    let clean = cmd.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ").trim();
    return clean;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center space-x-4">
             <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600">
                <Code className="w-6 h-6" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-slate-900">Step-by-Step Code Guide</h3>
                <p className="text-sm text-slate-500 font-medium">Auto-generated implementation mentor for {strategy.strategyName}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex overflow-hidden">
           
           {/* Sidebar: File List & Navigation */}
           <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col hidden md:flex shrink-0">
              <div className="p-4 border-b border-slate-200">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Guide Sections</div>
                  <div className="flex flex-col space-y-2">
                      <button 
                        onClick={() => setViewMode('code')}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'code' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                      >
                          <FileCode className="w-4 h-4 mr-2" />
                          Core Files
                      </button>
                      <button 
                        onClick={() => setViewMode('env')}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'env' ? 'bg-white text-amber-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                      >
                          <Lock className="w-4 h-4 mr-2" />
                          .env Setup
                      </button>
                      <button 
                        onClick={() => setViewMode('setup')}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'setup' ? 'bg-white text-teal-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                      >
                          <Play className="w-4 h-4 mr-2" />
                          Initial Setup Script
                      </button>
                      <button 
                        onClick={() => setViewMode('debug')}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'debug' ? 'bg-white text-red-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                      >
                          <Bug className="w-4 h-4 mr-2" />
                          First-Run Debugger
                      </button>
                  </div>
              </div>
              
              {viewMode === 'code' && (
                  <>
                    <div className="p-4 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Project Files</div>
                    <div className="flex-grow overflow-y-auto px-3 space-y-1.5 pb-4">
                        {loading ? (
                            <div className="p-6 flex flex-col items-center justify-center text-slate-400">
                            <Loader2 className="w-6 h-6 animate-spin mb-2" />
                            <span className="text-xs">Loading files...</span>
                            </div>
                        ) : data?.files.map((file, idx) => (
                            <button
                            key={idx}
                            onClick={() => setActiveFileIndex(idx)}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-3 transition-colors ${
                                activeFileIndex === idx 
                                ? 'bg-white shadow-sm text-indigo-700 ring-1 ring-indigo-100' 
                                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                            }`}
                            >
                            <FileCode className={`w-4 h-4 ${activeFileIndex === idx ? 'text-indigo-500' : 'text-slate-400'}`} />
                            <span className="truncate">{file.fileName}</span>
                            </button>
                        ))}
                    </div>
                  </>
              )}
           </div>

           {/* Main Editor Area */}
           <div className="flex-grow bg-[#1e1e1e] flex flex-col relative overflow-hidden text-slate-300">
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-white z-20">
                  <Loader2 className="w-12 h-12 animate-spin mb-6 text-indigo-600" />
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Forging Architecture...</h4>
                  <p className="font-medium text-slate-500">Writing boilerplate and setup scripts</p>
                </div>
              ) : viewMode === 'code' && activeFile ? (
                <>
                   {/* Terminal Header */}
                   <div className="bg-black/40 border-b border-slate-700 p-4 shrink-0">
                       <div className="flex items-center space-x-2 text-xs font-mono text-green-400 mb-2">
                           <Terminal className="w-4 h-4" />
                           <span className="opacity-70">Install Dependencies</span>
                       </div>
                       <div className="bg-black/50 rounded-lg p-3 flex justify-between items-center group">
                           <code className="text-sm font-mono text-slate-200 select-all overflow-x-auto whitespace-nowrap">
                               $ {cleanInstallCommand(data?.installCommand)}
                           </code>
                           <button 
                             onClick={() => handleCopy(cleanInstallCommand(data?.installCommand))}
                             className="text-slate-500 hover:text-white transition-colors ml-4 shrink-0"
                             title="Copy Command"
                           >
                               <Copy className="w-4 h-4" />
                           </button>
                       </div>
                   </div>

                   {/* File Info */}
                   <div className="bg-[#252526] px-6 py-2 flex items-center border-b border-[#333] text-sm shrink-0">
                      <span className="mr-3 text-indigo-400 font-bold">{activeFile.language}</span>
                      <span className="font-mono text-slate-200">{activeFile.fileName}</span>
                      <div className="flex-grow"></div>
                      <span className="text-xs text-slate-500 italic hidden sm:block">{activeFile.description}</span>
                   </div>

                   {/* Code Content + Build Steps Wrapper */}
                   <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col">
                      {/* Code Block */}
                      <div className="p-6 shrink-0">
                        <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-300">
                            <code>{activeFile.content}</code>
                        </pre>
                      </div>

                      {/* How to Build Section - INCREASED SPACING & Flex Grow logic for proper stacking */}
                      <div className="px-6 pb-20 mt-8">
                           <div className="bg-slate-800/80 rounded-xl border border-slate-700 p-6 backdrop-blur-sm">
                                <h4 className="flex items-center text-teal-400 font-bold text-sm uppercase tracking-wider mb-6">
                                    <Hammer className="w-4 h-4 mr-2" />
                                    How to Build This
                                </h4>
                                <div className="flex flex-col space-y-4">
                                    {activeFile.buildSteps.map((step, i) => (
                                        <div key={i} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-teal-500/30 transition-colors flex items-start">
                                            <div className="text-xs text-slate-900 bg-teal-400 px-2 py-0.5 rounded font-bold uppercase tracking-wide mr-3 mt-0.5">Step {i+1}</div>
                                            <div className="text-sm text-slate-200 font-medium leading-relaxed">{step}</div>
                                        </div>
                                    ))}
                                </div>
                           </div>
                       </div>
                   </div>
                </>
              ) : viewMode === 'setup' && data ? (
                 <div className="flex flex-col h-full bg-[#1e1e1e]">
                    <div className="bg-teal-900/20 border-b border-teal-900/50 p-4 flex items-center shrink-0 justify-between">
                        <div className="flex items-center">
                            <FilePlus className="w-5 h-5 text-teal-400 mr-2" />
                            <h4 className="text-teal-100 font-bold">Automated Setup Script</h4>
                        </div>
                        <span className="text-xs font-mono bg-teal-900/50 text-teal-300 px-2 py-1 rounded">setup.sh</span>
                    </div>
                    <div className="flex-grow p-6 overflow-auto font-mono text-sm text-green-300 whitespace-pre-wrap custom-scrollbar">
                        {data.setupScript}
                    </div>
                    <div className="p-6 bg-slate-800 border-t border-slate-700 flex justify-between items-center shrink-0">
                        <div className="text-sm text-slate-400">
                             Run in your terminal: <code className="bg-slate-900 px-2 py-1 rounded text-slate-200 ml-1">bash setup.sh</code>
                        </div>
                        <button 
                            onClick={() => handleCopy(data.setupScript)}
                            className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            <span>{copied ? 'Copied!' : 'Copy Instant Start Script'}</span>
                        </button>
                    </div>
                 </div>
              ) : viewMode === 'env' && data ? (
                  <div className="flex flex-col h-full bg-[#1e1e1e]">
                     <div className="bg-amber-900/20 border-b border-amber-900/50 p-4 flex items-center shrink-0 justify-between">
                         <div className="flex items-center">
                             <Lock className="w-5 h-5 text-amber-500 mr-2" />
                             <h4 className="text-amber-100 font-bold">Environment Variables (.env.local)</h4>
                         </div>
                         <div className="flex items-center bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded text-xs font-bold">
                             <AlertTriangle className="w-3 h-3 mr-1" />
                             Never commit to GitHub
                         </div>
                     </div>
                     <div className="flex-grow p-6 overflow-auto font-mono text-sm text-slate-300 whitespace-pre-wrap custom-scrollbar">
                         {data.envFile || "# No environment variables detected for this simple stack."}
                     </div>
                     <div className="p-6 bg-slate-800 border-t border-slate-700 flex justify-end shrink-0">
                         <button 
                             onClick={() => handleCopy(data.envFile || "")}
                             className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                         >
                             {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                             <span>Copy .env Template</span>
                         </button>
                     </div>
                  </div>
              ) : viewMode === 'debug' && data ? (
                  <div className="flex flex-col h-full bg-slate-900 p-8 overflow-y-auto custom-scrollbar">
                      <div className="flex items-center mb-8">
                          <Bug className="w-8 h-8 text-red-500 mr-3" />
                          <div>
                              <h3 className="text-2xl font-bold text-white">First-Run Debugger</h3>
                              <p className="text-slate-400">Common pitfalls you might encounter when starting this stack.</p>
                          </div>
                      </div>
                      
                      <div className="space-y-6">
                          {data.commonErrors?.map((err, idx) => (
                              <div key={idx} className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                                  <div className="flex items-start space-x-4">
                                      <div className="bg-red-500/20 p-2 rounded-lg text-red-400 shrink-0">
                                          <AlertTriangle className="w-6 h-6" />
                                      </div>
                                      <div>
                                          <h4 className="text-lg font-bold text-red-300 mb-2 font-mono">Error: {err.error}</h4>
                                          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                                              <p className="text-green-400 font-medium flex items-start">
                                                  <Check className="w-5 h-5 mr-2 mt-0.5 shrink-0" />
                                                  {err.fix}
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                          {(!data.commonErrors || data.commonErrors.length === 0) && (
                              <div className="text-center text-slate-500 italic">No specific common errors found for this stack. You're good to go!</div>
                          )}
                      </div>
                  </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">Select a section from the sidebar.</div>
              )}
           </div>
        </div>

        {/* Footer for Code Mode */}
        {viewMode === 'code' && (
        <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center shrink-0">
           <div className="text-sm text-slate-500 hidden md:block">
              <span className="font-bold text-slate-700">Pro Tip:</span> Run the install command before editing files.
           </div>
           <button 
            onClick={() => activeFile && handleCopy(activeFile.content)}
            disabled={loading || !data}
            className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ml-auto ${
                copied ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            <span>{copied ? 'Code Copied!' : 'Copy Code'}</span>
          </button>
        </div>
        )}

      </div>
    </div>
  );
};

export default ImplementationModal;
