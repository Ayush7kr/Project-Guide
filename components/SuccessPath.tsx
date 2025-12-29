import React, { useState } from 'react';
import { RoadmapPhase, RoadmapNode } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  PlayCircle, 
  ExternalLink, 
  Clock, 
  X,
  ChevronRight,
  Trophy,
  Code2,
  Rocket,
  Layout
} from 'lucide-react';

interface SuccessPathProps {
  phases: RoadmapPhase[];
}

const PhaseIcon = ({ name }: { name: string }) => {
  const lower = name.toLowerCase();
  if (lower.includes('knowledge')) return <BookOpen className="w-6 h-6" />;
  if (lower.includes('setup') || lower.includes('env')) return <Layout className="w-6 h-6" />;
  if (lower.includes('logic') || lower.includes('implement')) return <Code2 className="w-6 h-6" />;
  if (lower.includes('deploy')) return <Rocket className="w-6 h-6" />;
  return <Trophy className="w-6 h-6" />;
};

const SuccessPath: React.FC<SuccessPathProps> = ({ phases }) => {
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(completedNodes);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setCompletedNodes(newSet);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
           <h3 className="text-3xl font-bold text-slate-900 flex items-center">
            <span className="bg-indigo-100 text-indigo-700 w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                <Trophy className="w-7 h-7" />
            </span>
            The Success Path
           </h3>
           <p className="text-slate-500 text-base font-medium ml-16">Your interactive roadmap to shipping this project.</p>
        </div>
      </div>

      <div className="relative">
        {/* Vertical Line Container */}
        <div className="absolute left-8 md:left-1/2 top-4 bottom-0 w-0.5 bg-slate-200 transform -translate-x-1/2 md:translate-x-0 hidden md:block"></div>
        <div className="absolute left-6 top-4 bottom-0 w-0.5 bg-slate-200 block md:hidden"></div>

        <div className="space-y-16 relative z-10">
          {phases.map((phase, phaseIdx) => (
            <div key={phaseIdx} className="relative">
              
              {/* Phase Header */}
              <div className="flex items-center mb-8">
                 <div className="bg-slate-100 border border-slate-200 text-slate-700 px-6 py-2 rounded-full text-base font-bold shadow-sm z-20 flex items-center mx-auto">
                    <PhaseIcon name={phase.phaseName} />
                    <span className="ml-3">{phase.phaseName}</span>
                 </div>
              </div>

              {/* Nodes */}
              <div className="space-y-8">
                {phase.nodes.map((node, nodeIdx) => {
                  const isCompleted = completedNodes.has(node.id);
                  const isLeft = nodeIdx % 2 === 0;

                  return (
                    <motion.div 
                      key={node.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: nodeIdx * 0.1 }}
                      className={`flex md:justify-center relative`}
                    >
                      {/* Desktop Layout: Alternating */}
                      <div className={`hidden md:flex w-full items-center justify-between ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                        
                        {/* Content Card */}
                        <div 
                           onClick={() => setSelectedNode(node)}
                           className={`w-[45%] p-6 rounded-xl border-2 transition-all cursor-pointer hover:shadow-xl group ${
                             isCompleted 
                             ? 'bg-teal-50 border-teal-200' 
                             : 'bg-white border-slate-100 hover:border-indigo-200'
                           }`}
                        >
                           <div className="flex justify-between items-start mb-3">
                              <h4 className={`text-lg font-bold ${isCompleted ? 'text-teal-800' : 'text-slate-800'}`}>{node.title}</h4>
                              <button onClick={(e) => toggleComplete(node.id, e)}>
                                 {isCompleted 
                                   ? <CheckCircle2 className="w-6 h-6 text-teal-500" /> 
                                   : <Circle className="w-6 h-6 text-slate-300 hover:text-indigo-400" />
                                 }
                              </button>
                           </div>
                           <p className="text-base text-slate-600 line-clamp-2 leading-relaxed">{node.description}</p>
                           <div className="mt-4 flex items-center text-sm font-bold text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-wide">
                              <span>View Resources</span>
                              <ChevronRight className="w-4 h-4 ml-1" />
                           </div>
                        </div>

                        {/* Center Dot */}
                        <div className="w-5 h-5 rounded-full bg-white border-4 border-indigo-500 z-20 shadow-sm relative">
                           {isCompleted && <motion.div layoutId="glow" className="absolute inset-0 bg-teal-400 rounded-full animate-ping opacity-75" />}
                        </div>

                        {/* Spacer for the other side */}
                        <div className="w-[45%]"></div>
                      </div>

                      {/* Mobile Layout: Linear */}
                      <div className="flex md:hidden w-full pl-12 pr-2 relative">
                         {/* Dot */}
                         <div className="absolute left-[20px] top-6 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 z-20"></div>
                         
                         <div 
                           onClick={() => setSelectedNode(node)}
                           className={`w-full p-5 rounded-xl border transition-all cursor-pointer ${
                             isCompleted 
                             ? 'bg-teal-50 border-teal-200' 
                             : 'bg-white border-slate-200'
                           }`}
                         >
                            <div className="flex justify-between items-start mb-2">
                               <h4 className={`text-lg font-bold ${isCompleted ? 'text-teal-800' : 'text-slate-800'}`}>{node.title}</h4>
                               <button onClick={(e) => toggleComplete(node.id, e)} className="p-1">
                                 {isCompleted 
                                   ? <CheckCircle2 className="w-6 h-6 text-teal-500" /> 
                                   : <Circle className="w-6 h-6 text-slate-300" />
                                 }
                               </button>
                            </div>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">{node.description}</p>
                         </div>
                      </div>

                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Drawer / Modal */}
      <AnimatePresence>
        {selectedNode && (
          <div className="fixed inset-0 z-[70] flex justify-end">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedNode(null)}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white h-full shadow-2xl p-8 overflow-y-auto"
            >
               <button 
                 onClick={() => setSelectedNode(null)}
                 className="absolute top-5 right-5 p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
               >
                 <X className="w-6 h-6" />
               </button>

               <div className="mt-8 space-y-8">
                  <div>
                    <div className="flex items-center space-x-2 text-indigo-600 mb-3 font-bold text-sm uppercase tracking-wide">
                       <Clock className="w-4 h-4" />
                       <span>Est. Effort: {selectedNode.estimatedEffort}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">{selectedNode.title}</h2>
                    <p className="text-slate-600 leading-loose text-lg">{selectedNode.description}</p>
                  </div>

                  {/* Concepts */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                     <h4 className="font-bold text-slate-800 mb-4 flex items-center text-lg">
                        <BookOpen className="w-5 h-5 mr-3 text-teal-600" />
                        Concepts to Master
                     </h4>
                     <ul className="space-y-3">
                        {selectedNode.concepts.map((concept, idx) => (
                           <li key={idx} className="flex items-start text-base text-slate-700">
                              <span className="mr-3 mt-2 w-2 h-2 bg-teal-400 rounded-full flex-shrink-0"></span>
                              {concept}
                           </li>
                        ))}
                     </ul>
                  </div>

                  {/* Curated Hub */}
                  <div>
                     <h4 className="font-bold text-slate-800 mb-5 flex items-center text-lg">
                        <PlayCircle className="w-5 h-5 mr-3 text-red-500" />
                        Curated Learning Hub
                     </h4>
                     <div className="space-y-4">
                        {selectedNode.resources.map((res, idx) => (
                           <a 
                             key={idx} 
                             href={res.url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group shadow-sm"
                           >
                              <div className={`p-3 rounded-lg mr-4 ${
                                 res.type === 'video' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                              }`}>
                                 {res.type === 'video' ? <PlayCircle className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                              </div>
                              <div className="flex-grow">
                                 <h5 className="font-bold text-slate-900 text-base group-hover:text-indigo-700">{res.title}</h5>
                                 <span className="text-xs text-slate-500 uppercase tracking-wide font-bold">{res.type}</span>
                              </div>
                              <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-indigo-400" />
                           </a>
                        ))}
                     </div>
                  </div>

                  <button 
                    onClick={(e) => {
                       if (selectedNode) toggleComplete(selectedNode.id, e);
                       setSelectedNode(null);
                    }}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all text-lg shadow-lg ${
                       completedNodes.has(selectedNode.id)
                       ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                       : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                    }`}
                  >
                     {completedNodes.has(selectedNode.id) ? (
                        <>
                           <CheckCircle2 className="w-6 h-6" />
                           <span>Marked as Complete</span>
                        </>
                     ) : (
                        <>
                           <CheckCircle2 className="w-6 h-6" />
                           <span>Mark Phase Complete</span>
                        </>
                     )}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SuccessPath;