
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layout, Users, Activity, Settings, Terminal, Plus, MessageSquare, Play, Square, Mic, MicOff, Server, BrainCircuit, Book, GitBranch } from 'lucide-react';
import { Agent, AgentStatus, Task, MCPServer, LogEntry } from './types';
import SwarmDashboard from './components/SwarmDashboard';
import AgentList from './components/AgentList';
import TaskManager from './components/TaskManager';
import MCPConfigPanel from './components/MCPConfigPanel';
import LiveVoiceInterface from './components/LiveVoiceInterface';
import LogConsole from './components/LogConsole';
import SkillLibrary from './components/SkillLibrary';
import WorkflowManager from './components/WorkflowManager';

const INITIAL_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Master Orchestrator',
    role: 'Central Intelligence',
    status: AgentStatus.IDLE,
    capabilities: ['Orchestration', 'Delegation', 'Conflict Resolution', 'ACP Relay'],
    memory: ['Optimized swarm workflow v4.2', 'Handshake stable across all nodes', 'Global audit parameters set'],
    tasksAssigned: 124,
    lastActive: new Date().toISOString(),
    intelligenceScore: 98,
    learningRate: 0.5,
    protocols: ['ACP', 'A2A', 'A2UI', 'ADK']
  },
  {
    id: '2',
    name: 'Data Scout 01',
    role: 'Information Harvester',
    status: AgentStatus.WORKING,
    capabilities: ['Web Mining', 'Context Synthesis', 'MCP Tooling'],
    memory: ['Real-time market trends cached', 'Search heuristics improved', 'Cross-referenced v3 logic'],
    tasksAssigned: 452,
    lastActive: new Date().toISOString(),
    intelligenceScore: 92,
    learningRate: 2.1,
    protocols: ['MCP', 'A2A']
  },
  {
    id: '3',
    name: 'Logic Guard',
    role: 'Security Auditor',
    status: AgentStatus.LEARNING,
    capabilities: ['Threat Analysis', 'A2A Audit', 'Policy Enforcement'],
    memory: ['Detected and blocked anomalous handshake in Sub-Node 4', 'Firewall v9.2 active'],
    tasksAssigned: 89,
    lastActive: new Date().toISOString(),
    intelligenceScore: 95,
    learningRate: 1.8,
    protocols: ['ADK', 'ACP', 'A2A']
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agents' | 'skills' | 'workflows' | 'tasks' | 'mcp' | 'logs'>('dashboard');
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', title: 'Global Market Synthesis', description: 'Analyze 2024 fiscal data for tech sector', priority: 'HIGH', progress: 65, status: 'IN_PROGRESS', assignedTo: 'Data Scout 01', protocol: 'A2A' },
  ]);
  const [mcpServers, setMcpServers] = useState<MCPServer[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLiveActive, setIsLiveActive] = useState(false);

  const addLog = useCallback((source: string, message: string, type: LogEntry['type'] = 'INFO') => {
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      source,
      message,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  }, []);

  // PROACTIVE ENGINE: Autonomous Progression and Learning
  useEffect(() => {
    const tick = setInterval(() => {
      // 1. Progress active tasks
      // Explicitly typed the return value to Task[] to prevent 'string' to literal type widening errors.
      setTasks(prevTasks => {
        let changed = false;
        const newTasks = prevTasks.map(task => {
          if (task.status === 'IN_PROGRESS' && task.progress < 100) {
            changed = true;
            const newProgress = Math.min(100, task.progress + Math.floor(Math.random() * 5) + 1);
            
            // Randomly simulate MCP Tool usage for working agents
            if (task.assignedTo && Math.random() > 0.7) {
              addLog(task.assignedTo, `Invoking MCP Tool: filesystem://read_resource(${task.id})`, 'ACP');
            }

            if (newProgress === 100) {
              addLog('TASK-ENGINE', `Task "${task.title}" autonomously completed by ${task.assignedTo}.`, 'SUCCESS');
              // Cast status to Task['status'] to avoid literal widening to string
              return { ...task, progress: 100, status: 'COMPLETED' as Task['status'] };
            }
            return { ...task, progress: newProgress };
          }
          return task;
        });
        return changed ? (newTasks as Task[]) : prevTasks;
      });

      // 2. Proactive Agent Learning and State Management
      setAgents(prevAgents => {
        return prevAgents.map(agent => {
          const isAssignedToActiveTask = tasks.some(t => t.assignedTo === agent.name && t.status === 'IN_PROGRESS');
          
          if (agent.status === AgentStatus.WORKING && !isAssignedToActiveTask) {
             return { ...agent, status: AgentStatus.IDLE, memory: [...agent.memory.slice(-5), `Autonomous completion of sub-routine ${Math.random().toString(36).substr(2,4)}`] };
          }

          if (agent.status === AgentStatus.IDLE && Math.random() > 0.95) {
            addLog(agent.name, `Initiating autonomous neural self-learning cycle.`, 'ACP');
            return { ...agent, status: AgentStatus.LEARNING, intelligenceScore: Math.min(100, agent.intelligenceScore + 0.05) };
          }

          if (agent.status === AgentStatus.LEARNING && Math.random() > 0.8) {
             return { ...agent, status: AgentStatus.IDLE, memory: [...agent.memory.slice(-5), `Self-learned module: ${Math.random().toString(36).substr(2,6)}_OPTIM`] };
          }

          return agent;
        });
      });
    }, 5000);

    return () => clearInterval(tick);
  }, [tasks, addLog]);

  const handleAddAgent = (newAgent: Agent) => {
    setAgents(prev => [...prev, newAgent]);
    addLog('SYSTEM', `New agent ${newAgent.name} deployed via ${newAgent.protocols.join('/')} protocol.`, 'SUCCESS');
    if (newAgent.endpointConfig) {
      addLog(newAgent.name, `External endpoint verified: ${newAgent.endpointConfig.url}`, 'OPENAI');
    }
  };

  const handleAgentAction = useCallback((agentId: string, action: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    if (action.startsWith('RESTORE_MEMORY:')) {
      const memoryEntry = action.replace('RESTORE_MEMORY:', '');
      addLog(agent.name, `Initiating Neural Recall for state: "${memoryEntry.substring(0, 30)}..."`, 'A2A');
      
      setAgents(prev => prev.map(a => 
        a.id === agentId ? { ...a, status: AgentStatus.DELEGATING, lastActive: new Date().toISOString() } : a
      ));

      setTimeout(() => {
        setAgents(prev => prev.map(a => 
          a.id === agentId ? { 
            ...a, 
            status: AgentStatus.IDLE, 
            intelligenceScore: Math.min(100, a.intelligenceScore + 0.5),
            memory: [...a.memory, `Restored state successfully: ${memoryEntry.substring(0, 20)}...`]
          } : a
        ));
        addLog(agent.name, `State successfully restored. Cognitive parameters updated.`, 'SUCCESS');
      }, 2000);
      return;
    }

    addLog(agent.name, `Executing ${action} via ${agent.protocols[0]} protocol.`, agent.protocols.includes('OPENAI') ? 'OPENAI' : 'ACP');
    
    setAgents(prev => prev.map(a => 
      a.id === agentId ? { ...a, status: AgentStatus.WORKING, lastActive: new Date().toISOString() } : a
    ));
  }, [agents, addLog]);

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans text-slate-200">
      <nav className="w-16 md:w-64 border-r border-slate-800/50 flex flex-col items-center py-6 glass shrink-0 z-20">
        <div className="mb-10 px-4 flex items-center gap-3 w-full justify-center md:justify-start">
          <div className="relative group">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Activity className="text-white w-6 h-6" />
            </div>
            <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
          </div>
          <div className="hidden md:block">
            <h1 className="font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-200 to-slate-500">
              SWARM.OS
            </h1>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] -mt-1">Proactive Kernel</p>
          </div>
        </div>

        <div className="flex-1 space-y-1.5 w-full px-2 overflow-y-auto custom-scrollbar pb-4">
          <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<Layout size={20} />} label="Command Dashboard" />
          <NavButton active={activeTab === 'agents'} onClick={() => setActiveTab('agents')} icon={<Users size={20} />} label="Neural Agents" />
          <NavButton active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} icon={<Book size={20} />} label="Skill Library" />
          <NavButton active={activeTab === 'workflows'} onClick={() => setActiveTab('workflows')} icon={<GitBranch size={20} />} label="Workflows" />
          <NavButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon={<BrainCircuit size={20} />} label="Task Orchestrator" />
          <NavButton active={activeTab === 'mcp'} onClick={() => setActiveTab('mcp')} icon={<Server size={20} />} label="MCP Registry" />
          <NavButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<Terminal size={20} />} label="System Kernel" />
        </div>

        <div className="mt-auto px-2 w-full space-y-4 pt-4 border-t border-slate-800/50">
           <button 
             onClick={() => setIsLiveActive(!isLiveActive)}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isLiveActive ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/30 hover:bg-indigo-600/20 shadow-lg shadow-indigo-500/5'} group`}
           >
             <div className="relative">
                {isLiveActive ? <Square size={18} /> : <Mic size={18} />}
                {isLiveActive && <div className="absolute inset-0 bg-red-400 blur-md opacity-50 animate-pulse" />}
             </div>
             <span className="hidden md:block font-bold text-sm tracking-tight">{isLiveActive ? 'End Live Session' : 'Begin Live Comms'}</span>
           </button>
        </div>
      </nav>

      <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-slate-950">
        <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 glass sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-slate-100 font-bold capitalize text-lg tracking-tight">{activeTab.replace('_', ' ')}</h2>
            <div className="h-4 w-px bg-slate-800 mx-2" />
            <span className="text-[10px] font-mono text-slate-500 animate-pulse">MCP_READY: V1.0.0</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                Registry Stable
              </div>
            </div>
            
            <div className="flex -space-x-2">
              {agents.map(a => (
                <div key={a.id} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold hover:z-10 transition-all cursor-pointer ring-1 ring-slate-700/50" title={a.name}>
                  {a.name.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
          {activeTab === 'dashboard' && <SwarmDashboard agents={agents} logs={logs} />}
          {activeTab === 'agents' && <AgentList agents={agents} onAction={handleAgentAction} onAddAgent={handleAddAgent} />}
          {activeTab === 'skills' && <SkillLibrary />}
          {activeTab === 'workflows' && <WorkflowManager />}
          {activeTab === 'tasks' && <TaskManager tasks={tasks} />}
          {activeTab === 'mcp' && <MCPConfigPanel servers={mcpServers} setServers={setMcpServers} />}
          {activeTab === 'logs' && <LogConsole logs={logs} />}
        </div>

        <LiveVoiceInterface active={isLiveActive} onLog={addLog} onCommand={(cmd) => addLog('MASTER-AI', cmd, 'ACP')} />
      </main>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${active ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50 border border-transparent'}`}
  >
    <span className={`${active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors`}>{icon}</span>
    <span className="hidden md:block font-bold text-xs uppercase tracking-wider">{label}</span>
    {active && <div className="hidden md:block ml-auto w-1 h-4 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />}
  </button>
);

export default App;
