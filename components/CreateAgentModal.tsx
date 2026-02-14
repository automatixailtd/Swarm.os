
import React, { useState } from 'react';
import { X, Globe, Cpu, Shield, Plus, Info } from 'lucide-react';
import { Agent, AgentStatus } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (agent: Agent) => void;
}

const CreateAgentModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [capabilities, setCapabilities] = useState('');
  const [useOpenAI, setUseOpenAI] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState('https://api.openai.com/v1');
  const [model, setModel] = useState('gpt-4o');
  const [apiKey, setApiKey] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAgent: Agent = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      role,
      status: AgentStatus.IDLE,
      capabilities: capabilities.split(',').map(s => s.trim()).filter(Boolean),
      memory: ['Initial deployment handshake complete'],
      tasksAssigned: 0,
      lastActive: new Date().toISOString(),
      intelligenceScore: 85,
      learningRate: 1.0,
      protocols: useOpenAI ? ['OPENAI', 'A2A'] : ['ACP', 'A2A'],
      endpointConfig: useOpenAI ? { url: endpointUrl, model, apiKey } : undefined
    };
    onAdd(newAgent);
    onClose();
    // Reset form
    setName('');
    setRole('');
    setCapabilities('');
    setUseOpenAI(false);
    setApiKey('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-100">Spawn New Agent</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Agent Identity</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Logic-Guard-01"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Primary Role</label>
              <input 
                required
                type="text" 
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Compliance Auditor"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Core Capabilities (comma separated)</label>
            <input 
              type="text" 
              value={capabilities}
              onChange={e => setCapabilities(e.target.value)}
              placeholder="Analysis, Code Review, Latency Check"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="p-4 rounded-2xl bg-indigo-600/5 border border-indigo-500/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-indigo-400" />
                <span className="text-sm font-bold text-slate-200">OpenAI Compatible Endpoint</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={useOpenAI}
                  onChange={e => setUseOpenAI(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {useOpenAI && (
              <div className="space-y-4 pt-2 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Base URL</label>
                  <input 
                    type="url" 
                    value={endpointUrl}
                    onChange={e => setEndpointUrl(e.target.value)}
                    placeholder="https://api.openai.com/v1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Name</label>
                    <input 
                      type="text" 
                      value={model}
                      onChange={e => setModel(e.target.value)}
                      placeholder="gpt-4o"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">API Key (Optional)</label>
                    <input 
                      type="password" 
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                  <Info size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-indigo-300 leading-relaxed">
                    This agent will route its logic through an external OpenAI-compatible API using the specified endpoint and model.
                  </p>
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="p-6 border-t border-slate-800 flex gap-4 bg-slate-900/50">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            Deploy Agent
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAgentModal;
