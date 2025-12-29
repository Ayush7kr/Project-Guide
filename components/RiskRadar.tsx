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
          <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-amber-100/50 hover:border-amber-200 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldAlert className="w-12 h-12 text-amber-500" />
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
              
              <div className="pt-3 border-t border-slate-50">
                <p className="text-[10px] font-semibold text-amber-600 uppercase mb-1">Mitigation Strategy</p>
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