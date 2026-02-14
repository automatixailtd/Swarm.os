
import React from 'react';
import { Task } from '../types';
import { Calendar, Clock, CheckCircle2, Circle, AlertTriangle, Layers, Send } from 'lucide-react';

const TaskManager: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  // Mock tasks if none exist to show UI
  const displayTasks = tasks.length > 0 ? tasks : [
    { id: 't1', title: 'Global Market Synthesis', description: 'Analyze 2024 fiscal data for tech sector', priority: 'HIGH', progress: 65, status: 'IN_PROGRESS', assignedTo: 'Data Scout', protocol: 'A2A' },
    { id: 't2', title: 'Security Audit v4', description: 'Deep scan of swarm-mcp endpoints', priority: 'MEDIUM', progress: 100, status: 'COMPLETED', assignedTo: 'Master Orchestrator', protocol: 'MCP' },
    { id: 't3', title: 'Neural Reinforcement', description: 'Optimizing self-learning loops for Scout agents', priority: 'HIGH', progress: 20, status: 'IN_PROGRESS', assignedTo: 'Master Orchestrator', protocol: 'ACP' }
  ] as Task[];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Layers className="text-indigo-400" size={20} />
          Active Orchestrations
        </h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20">
          <Send size={16} /> Delegate New Task
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {displayTasks.map(task => (
          <div key={task.id} className="p-6 rounded-2xl glass hover:border-slate-700 transition-all group border border-slate-800/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4">
                <div className={`mt-1 p-2 rounded-lg ${
                  task.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400' : 
                  task.status === 'IN_PROGRESS' ? 'bg-indigo-500/10 text-indigo-400' : 
                  'bg-slate-800 text-slate-500'
                }`}>
                  {task.status === 'COMPLETED' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{task.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  task.priority === 'HIGH' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                  'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {task.priority} PRIORITY
                </span>
                <span className="text-[10px] text-slate-600 font-mono">ID: {task.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-800/30 mb-4">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">Assigned To</p>
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold">
                    {task.assignedTo?.charAt(0) || '?'}
                  </div>
                  {task.assignedTo || 'Unassigned'}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">Protocol Interface</p>
                <p className="text-xs text-indigo-400 font-mono">{task.protocol}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">Delegated By</p>
                <p className="text-xs text-slate-300 font-medium">Master-AI (Live)</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">Est. Completion</p>
                <p className="text-xs text-slate-300">T + 4:20h</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                <span>PROGRESS: {task.progress}%</span>
                <span className="uppercase">{task.status.replace('_', ' ')}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    task.status === 'COMPLETED' ? 'bg-green-500' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                  }`}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
