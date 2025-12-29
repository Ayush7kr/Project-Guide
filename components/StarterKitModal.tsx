import React, { useState, useEffect } from 'react';
import { ProjectBlueprint, ProjectStrategy, StarterKit } from '../types';
import { generateStarterKit } from '../services/geminiService';
import { X, Copy, Check, FileText, FileCode, Loader2 } from 'lucide-react';

interface StarterKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: ProjectBlueprint;
  strategy: ProjectStrategy;
}

const StarterKitModal: React.FC<StarterKitModalProps> = ({ isOpen, onClose, blueprint, strategy }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StarterKit | null>(null);
  const [activeTab, setActiveTab] = useState<'readme' | 'deps'>('readme');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && !data) {
      setLoading(true);
      generateStarterKit(blueprint, strategy)
        .then(res => {
          setData(res);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isOpen, blueprint, strategy, data]);

  const handleCopy = () => {
    if (!data) return;
    const text = activeTab === 'readme' ? data.readme : data.dependencies;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">🚀 Project Starter Kit</h3>
            <p className="text-sm text-slate-500">Auto-generated boilerplate for {strategy.strategyName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-hidden flex flex-col relative min-h-[300px]">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin mb-3" />
              <p className="text-sm text-slate-500 font-medium">Forging your starter files...</p>
            </div>
          ) : data ? (
            <>
              {/* Tabs */}
              <div className="flex border-b border-slate-100 bg-slate-50/50">
                <button 
                  onClick={() => setActiveTab('readme')}
                  className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'readme' ? 'border-teal-500 text-teal-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>README.md</span>
                </button>
                <button 
                  onClick={() => setActiveTab('deps')}
                  className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === 'deps' ? 'border-teal-500 text-teal-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                  <span>{data.dependencyFileName}</span>
                </button>
              </div>

              {/* Code Area */}
              <div className="flex-grow overflow-y-auto p-0 bg-slate-900 text-slate-300 font-mono text-sm">
                <div className="p-6 whitespace-pre-wrap">
                  {activeTab === 'readme' ? data.readme : data.dependencies}
                </div>
              </div>
            </>
          ) : (
             <div className="flex items-center justify-center h-full text-red-500">Failed to generate content.</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white rounded-b-2xl flex justify-end">
          <button 
            onClick={handleCopy}
            disabled={loading || !data}
            className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default StarterKitModal;