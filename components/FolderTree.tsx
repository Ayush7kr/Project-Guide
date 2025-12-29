import React, { useState } from 'react';
import { FileNode } from '../types';
import { Folder, FolderOpen, FileCode, FileJson, FileText, File, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FolderTreeProps {
  structure: FileNode[];
  onCopy: () => void;
}

const FileIcon = ({ name }: { name: string }) => {
  if (name.endsWith('.json')) return <FileJson className="w-4 h-4 text-yellow-500" />;
  if (name.endsWith('.tsx') || name.endsWith('.jsx') || name.endsWith('.js')) return <FileCode className="w-4 h-4 text-blue-500" />;
  if (name.endsWith('.py')) return <FileCode className="w-4 h-4 text-green-500" />; // Python
  if (name.endsWith('.md')) return <FileText className="w-4 h-4 text-slate-400" />;
  if (name.endsWith('.css') || name.endsWith('.scss')) return <FileCode className="w-4 h-4 text-pink-500" />;
  return <File className="w-4 h-4 text-slate-500" />;
};

// Fix: Use React.FC to allow 'key' prop in recursive calls and parent usage
interface TreeNodeProps {
  node: FileNode;
  depth?: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = node.type === 'folder';

  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-1 hover:bg-slate-700/50 cursor-pointer rounded px-2 transition-colors`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        <span className="mr-2 opacity-70">
          {isFolder ? (
            isOpen ? <FolderOpen className="w-4 h-4 text-teal-400" /> : <Folder className="w-4 h-4 text-teal-600" />
          ) : (
            <FileIcon name={node.name} />
          )}
        </span>
        <span className={`text-sm font-mono ${isFolder ? 'font-semibold text-slate-200' : 'text-slate-400'}`}>
          {node.name}
        </span>
      </div>
      
      <AnimatePresence>
        {isFolder && isOpen && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {node.children.map((child, idx) => (
              <TreeNode key={idx} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FolderTree: React.FC<FolderTreeProps> = ({ structure, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl flex flex-col h-full">
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Architecture</span>
        <button 
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors"
          title="Copy Structure"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-2 overflow-y-auto max-h-[400px] custom-scrollbar">
        {structure.map((node, idx) => (
          <TreeNode key={idx} node={node} />
        ))}
      </div>
    </div>
  );
};

export default FolderTree;