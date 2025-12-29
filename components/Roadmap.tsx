import React from 'react';
import { RoadmapStep } from '../types';

interface RoadmapProps {
  steps: RoadmapStep[];
}

const Roadmap: React.FC<RoadmapProps> = ({ steps }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <span className="bg-teal-100 text-teal-700 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">🚀</span>
        How to Start
      </h3>
      
      <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="ml-8 relative">
            {/* Dot */}
            <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-white bg-teal-500 shadow-sm"></div>
            
            <h4 className="text-lg font-semibold text-slate-800 mb-1">
              Step {step.stepNumber}: {step.title}
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
