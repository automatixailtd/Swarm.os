
import React from 'react';
import { Workflow, WorkflowStep } from '../types';
import { GitBranch, Play, MoreHorizontal, ArrowRight, Zap, Clock, Shield } from 'lucide-react';

const WORKFLOWS: Workflow[] = [
  {
    id: 'w1',
    name: 'Research Pipeline',
    description: 'Autonomous data gathering and verification loop.',
    status: 'ACTIVE',
    steps: [
      { id: '1', agentRole: 'Data Scout', action: 'Market Scan', order: 1 },
      { id: '2', agentRole: 'Logic Guard', action: 'Verify Integrity', order: 2 },
      { id: '3', agentRole: 'Master Orchestrator', action: 'Summarize Report', order: 3 }
    ]
  },
  {
    id: 'w2',
    name: 'Security Lockdown',
    description: 'Emergency isolation and firewall update sequence.',
    status: 'PAUSED',
    steps: [
      { id: '4', agentRole: 'Logic Guard', action: 'Audit Endpoints', order: 1 },
      { id: '5', agentRole: 'Master Orchestrator', action: 'Regenerate Keys', order: 2 }
    ]
  }
];

const WorkflowManager: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <GitBranch className="text-purple-400" size={24} />
            Chain Workflow Orchestrator
          </h3>
          <p className="text-sm text-slate-500">Define multi-agent collaborative execution paths.</p>
        </div>
        <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20">
          Create Sequence
        </button>
      </div>

      <div className="space-y-6">
        {WORKFLOWS.map(wf => (
          <div key={wf.id} className="p-8 rounded-2xl glass border border-slate-800">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${wf.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-100">{wf.name}</h4>
                  <p className="text-xs text-slate-500">{wf.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">
                   <Clock size={12} /> {wf.steps.length * 5}m Est.
                 </div>
                 <button className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all">
                   <Play size={18} fill="currentColor" />
                 </button>
                 <button className="p-2 text-slate-500 hover:text-slate-300">
                   <MoreHorizontal size={20} />
                 </button>
              </div>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {wf.steps.sort((a,b) => a.order - b.order).map((step, idx) => (
                <React.Fragment key={step.id}>
                  <div className="min-w-[200px] p-4 rounded-xl bg-slate-900/50 border border-slate-800 relative group">
                    <div className="absolute -top-2 -left-2 w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold border border-slate-900">
                      {step.order}
                    </div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">{step.agentRole}</p>
                    <p className="text-sm font-bold text-slate-200">{step.action}</p>
                    <div className="mt-3 flex items-center gap-2 text-[9px] text-slate-600 font-mono">
                      <Shield size={10} /> HANDSHAKE_OK
                    </div>
                  </div>
                  {idx < wf.steps.length - 1 && (
                    <ArrowRight className="text-slate-700 shrink-0" size={20} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowManager;
