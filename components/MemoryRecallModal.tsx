
import React from 'react';
import { X, History, RotateCcw, Brain, Shield, Clock } from 'lucide-react';
import { Agent, AgentStatus } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
  onRestore: (agentId: string, memoryEntry: string) => void;
}

const MemoryRecallModal: React.FC<Props> = ({ isOpen, onClose, agent, onRestore }) => {
  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.1)] overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
              <Brain size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">Neural Memory Recall</h3>
              <p className="text-xs text-slate-500 font-mono uppercase tracking-tighter">Accessing {agent.name} experience cache...</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="relative border-l-2 border-slate-800 ml-4 pl-8 space-y-8">
            {agent.memory.length === 0 ? (
              <div className="py-12 text-center text-slate-600 italic">
                No archived memory segments found for this unit.
              </div>
            ) : (
              [...agent.memory].reverse().map((entry, index) => (
                <div key={index} className="relative group">
                  {/* Timeline Node */}
                  <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-indigo-500 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all z-10" />
                  
                  <div className="p-5 rounded-2xl glass border border-slate-800/50 hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                        <Clock size={12} />
                        T-Minus {index * 4}h 12m
                      </div>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-bold border border-indigo-500/20">
                        HASH_881_{index}
                      </span>
                    </div>
                    
                    <p className="text-slate-200 text-sm leading-relaxed italic mb-4">
                      "{entry}"
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase">
                          <Shield size={10} /> Integrity: 99.8%
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          onRestore(agent.id, entry);
                          onClose();
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white text-[10px] font-bold transition-all border border-indigo-500/20"
                      >
                        <RotateCcw size={12} /> Restore Workflow State
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500" /> Archival Sync
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-slate-700" /> Cold Storage
            </div>
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold transition-all"
          >
            Close Cache
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryRecallModal;
