
import React, { useState } from 'react';
import { MCPServer, MCPTool, MCPResource } from '../types';
import { Server, ShieldAlert, CheckCircle, Trash2, Globe, Laptop, Box, Database, MessageSquare, ChevronDown, ChevronUp, Terminal, Zap } from 'lucide-react';

const MCPConfigPanel: React.FC<{ servers: MCPServer[]; setServers: React.Dispatch<React.SetStateAction<MCPServer[]>> }> = ({ servers, setServers }) => {
  const [newServerName, setNewServerName] = useState('');
  const [newServerUrl, setNewServerUrl] = useState('');
  const [expandedServer, setExpandedServer] = useState<string | null>(null);

  const addServer = () => {
    if (!newServerName || !newServerUrl) return;
    
    // Simulate MCP Discovery Handshake
    const server: MCPServer = {
      id: Math.random().toString(36).substr(2, 9),
      name: newServerName,
      url: newServerUrl,
      type: newServerUrl.includes('localhost') ? 'LOCAL' : 'SSE',
      status: 'INITIALIZING',
      version: '1.0.0',
      tools: [
        { name: 'read_resource', description: 'Read data from specified URI', inputSchema: {} },
        { name: 'list_directory', description: 'List files in remote context', inputSchema: {} }
      ],
      resources: [
        { name: 'System Context', uri: 'mcp://system/context' }
      ],
      prompts: [
        { name: 'Analyze Data', description: 'Standard prompt for data synthesis' }
      ]
    };

    setServers(prev => [...prev, server]);
    setNewServerName('');
    setNewServerUrl('');

    // Simulate completion of handshake
    setTimeout(() => {
      setServers(prev => prev.map(s => s.id === server.id ? { ...s, status: 'CONNECTED' } : s));
    }, 1500);
  };

  const removeServer = (id: string) => {
    setServers(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 rounded-3xl glass border border-slate-800">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Server size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-100 tracking-tight">MCP Registry</h3>
            <p className="text-sm text-slate-500">Discover and manage Model Context Protocol compliant infrastructure.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Implementation Alias</label>
            <input 
              type="text" 
              value={newServerName}
              onChange={e => setNewServerName(e.target.value)}
              placeholder="e.g. Google-Cloud-Connector"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-all font-mono text-sm"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Standard URI (SSE/Local)</label>
            <input 
              type="text" 
              value={newServerUrl}
              onChange={e => setNewServerUrl(e.target.value)}
              placeholder="http://localhost:3000/sse"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-all font-mono text-sm"
            />
          </div>
        </div>
        <button 
          onClick={addServer}
          className="group w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3"
        >
          <Zap size={20} className="group-hover:animate-pulse" />
          Initialize MCP Handshake
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            Active Discovery Threads ({servers.length})
          </h4>
          <span className="text-[10px] text-slate-600 font-mono">STANDARDS_READY: 1.0.0</span>
        </div>
        
        {servers.length === 0 ? (
          <div className="p-16 text-center rounded-3xl border-2 border-dashed border-slate-900 bg-slate-900/20 text-slate-600">
            <ShieldAlert size={64} className="mx-auto mb-6 opacity-10" />
            <p className="text-lg font-bold">No MCP Assets Detected</p>
            <p className="text-sm mt-2 max-w-xs mx-auto">Connect servers that expose the MCP standard to extend swarm capabilities.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {servers.map(server => (
              <div key={server.id} className="rounded-3xl border border-slate-800 overflow-hidden bg-slate-900/30 transition-all hover:border-slate-700">
                <div 
                  className="p-5 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedServer(expandedServer === server.id ? null : server.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${server.status === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 animate-pulse'}`}>
                      {server.type === 'LOCAL' ? <Laptop size={20} /> : <Globe size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h5 className="font-black text-slate-100">{server.name}</h5>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-500 font-mono">v{server.version}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{server.url}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-4">
                       <CapabilityTag icon={<Box size={12}/>} count={server.tools.length} label="Tools" />
                       <CapabilityTag icon={<Database size={12}/>} count={server.resources.length} label="Res" />
                       <CapabilityTag icon={<MessageSquare size={12}/>} count={server.prompts.length} label="Prompts" />
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeServer(server.id); }}
                        className="p-2.5 rounded-xl bg-slate-950 hover:bg-red-500/10 text-slate-600 hover:text-red-400 border border-slate-800 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      {expandedServer === server.id ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                    </div>
                  </div>
                </div>

                {expandedServer === server.id && (
                  <div className="px-5 pb-6 pt-2 space-y-6 border-t border-slate-800/50 bg-slate-950/30 animate-in slide-in-from-top-2 duration-300">
                    <div>
                      <h6 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Terminal size={12}/> Discovered Tools
                      </h6>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {server.tools.map((tool, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/50 hover:border-emerald-500/20 transition-all">
                            <p className="text-sm font-black text-emerald-400 font-mono">{tool.name}</p>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{tool.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                       <CheckCircle size={16} className="text-emerald-400" />
                       <p className="text-xs text-emerald-300 font-bold">Protocol fully synchronized. Context available for all swarm agents.</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CapabilityTag: React.FC<{ icon: React.ReactNode; count: number; label: string }> = ({ icon, count, label }) => (
  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
    {icon}
    <span className="font-black text-slate-200">{count}</span>
    <span className="opacity-40">{label}</span>
  </div>
);

export default MCPConfigPanel;
