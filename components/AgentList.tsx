
import React, { useState } from 'react';
import { Agent, AgentStatus } from '../types';
import { MoreVertical, Terminal, Zap, RefreshCcw, Shield, BrainCircuit, Activity, Plus, Globe, History } from 'lucide-react';
import CreateAgentModal from './CreateAgentModal';
import MemoryRecallModal from './MemoryRecallModal';

interface Props {
  agents: Agent[];
  onAction: (id: string, action: string) => void;
  onAddAgent: (agent: Agent) => void;
}

const AgentList: React.FC<Props> = ({ agents, onAction, onAddAgent }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAgentForMemory, setSelectedAgentForMemory] = useState<Agent | null>(null);

  const handleRestoreMemory = (agentId: string, entry: string) => {
    onAction(agentId, `RESTORE_MEMORY:${entry}`);
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {agents.map(agent => (
          <div key={agent.id} className="p-6 rounded-2xl glass group flex flex-col relative overflow-hidden border border-slate-800/50 hover:border-indigo-500/30 transition-all">
            {/* Background Highlight */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-all" />
            
            <div className="flex items-center justify-between mb-6">
              <div 
                className="flex items-center gap-3 cursor-pointer group/header"
                onClick={() => setSelectedAgentForMemory(agent)}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border transition-all group-hover/header:scale-105 group-hover/header:border-indigo-500 ${
                  agent.status === AgentStatus.WORKING ? 'bg-green-500/10 text-green-400 border-green-500/20 animate-pulse' : 
                  agent.status === AgentStatus.IDLE ? 'bg-slate-800 text-slate-400 border-slate-700' : 
                  'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
                }`}>
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{agent.name}</h3>
                    {agent.protocols.includes('OPENAI') && <Globe size={12} className="text-indigo-400" title="External Endpoint" />}
                  </div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter flex items-center gap-1">
                    {agent.role} <History size={8} className="opacity-0 group-hover/header:opacity-100 transition-opacity" />
                  </p>
                </div>
              </div>
              <button className="text-slate-600 hover:text-slate-400">
                <MoreVertical size={18} />
              </button>
            </div>

            {/* Learning & Intelligence Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-1.5 mb-1">
                  <BrainCircuit size={12} className="text-purple-400" />
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Self-Learning</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-sm font-bold text-slate-200">{agent.learningRate || 1.2}%</span>
                  <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-1.5 mb-1">
                  <Activity size={12} className="text-indigo-400" />
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">IQ Score</span>
                </div>
                <span className="text-sm font-bold text-slate-200">{agent.intelligenceScore || 92}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              <div>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-2">Protocol Stack</p>
                <div className="flex flex-wrap gap-2">
                  {(agent.protocols || ['ACP', 'A2A', 'MCP']).map((p, i) => (
                    <span key={i} className={`px-2 py-0.5 rounded text-[9px] font-mono border ${
                      p === 'OPENAI' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {agent.endpointConfig && (
                <div className="px-3 py-2 rounded-xl bg-slate-950/50 border border-slate-800/50">
                  <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">External Endpoint</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{agent.endpointConfig.model} @ {new URL(agent.endpointConfig.url).hostname}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs py-2 border-y border-slate-800/50">
                 <span className="text-slate-500">Autonomous Actions</span>
                 <span className="text-slate-200 font-mono">{agent.tasksAssigned}</span>
              </div>

              <div 
                className="cursor-pointer group/memory"
                onClick={() => setSelectedAgentForMemory(agent)}
              >
                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1"><Shield size={10} /> Experience Caches</span>
                  <History size={10} className="text-indigo-500 opacity-0 group-hover/memory:opacity-100 transition-opacity" />
                </p>
                <div className="space-y-1">
                  {(agent.memory || ['Initial boot successful']).slice(-2).map((m, i) => (
                    <p key={i} className="text-[10px] text-slate-400 italic bg-slate-900/30 p-1.5 rounded border border-slate-800/30 line-clamp-1">
                      &gt; {m}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onAction(agent.id, 'DIAGNOSTIC')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                <Terminal size={14} /> Diagnostic
              </button>
              <button 
                onClick={() => onAction(agent.id, 'SWARM_WAKE')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
              >
                <Zap size={14} /> Delegate
              </button>
            </div>
          </div>
        ))}

        {/* Add New Agent Placeholder */}
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-500 hover:border-indigo-500/30 hover:text-indigo-400 transition-all group min-h-[400px]"
        >
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <p className="font-semibold text-sm">Spawn Autonomous Agent</p>
          <p className="text-[10px] opacity-60 mt-1">Initializes A2A & ACP Handshake</p>
        </button>
      </div>

      <CreateAgentModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onAdd={onAddAgent} 
      />

      <MemoryRecallModal 
        isOpen={!!selectedAgentForMemory}
        onClose={() => setSelectedAgentForMemory(null)}
        agent={selectedAgentForMemory}
        onRestore={handleRestoreMemory}
      />
    </div>
  );
};

export default AgentList;
