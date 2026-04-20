import React from 'react';
import { ProjectRisk } from '../types';
import { AlertTriangle, ShieldAlert, Activity } from 'lucide-react';

interface RiskRadarProps {
  risks: ProjectRisk[];
}

const RiskRadar: React.FC<RiskRadarProps> = ({ risks }) => {
  return (
    <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-6">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-amber-600" />
        Project Blockers & Risk Radar
      </h3>
      
      <div className="grid gap-4 md:grid-cols-3">
        {risks.map((risk, idx) => (
          <div 
            key={idx} 
            className={`rounded-xl p-4 shadow-sm border transition-colors relative overflow-hidden group ${
               risk.severity === 'High' 
               ? 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-100 hover:border-red-200' 
               : 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-100 hover:border-amber-200'
            }`}
          >
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldAlert className={`w-12 h-12 ${risk.severity === 'High' ? 'text-red-500' : 'text-amber-500'}`} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                  risk.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'
                }`}>
                  {risk.severity} Risk
                </span>
              </div>
              
              <h4 className="font-bold text-slate-800 mb-1 leading-tight">{risk.title}</h4>
              <p className="text-xs text-slate-500 mb-3">{risk.description}</p>
              
              <div className="pt-3 border-t border-slate-200/50">
                <p className={`text-[10px] font-semibold uppercase mb-1 ${risk.severity === 'High' ? 'text-red-600' : 'text-amber-600'}`}>Mitigation Strategy</p>
                <p className="text-xs text-slate-700 leading-snug">{risk.mitigation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskRadar;