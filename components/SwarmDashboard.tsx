
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Agent, LogEntry } from '../types';
import { Activity, Zap, Cpu, ShieldCheck } from 'lucide-react';

const data = [
  { name: '00:00', activity: 400 },
  { name: '04:00', activity: 300 },
  { name: '08:00', activity: 800 },
  { name: '12:00', activity: 1200 },
  { name: '16:00', activity: 1000 },
  { name: '20:00', activity: 1500 },
  { name: '23:59', activity: 1100 },
];

const SwarmDashboard: React.FC<{ agents: Agent[]; logs: LogEntry[] }> = ({ agents, logs }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Swarm Activity" value="94%" icon={<Activity className="text-indigo-400" />} trend="+4.2%" />
        <MetricCard title="Total Agents" value={agents.length.toString()} icon={<Zap className="text-yellow-400" />} trend="Active" />
        <MetricCard title="Compute Load" value="2.4 TFLOPS" icon={<Cpu className="text-blue-400" />} trend="-12%" />
        <MetricCard title="Task Success" value="99.9%" icon={<ShieldCheck className="text-green-400" />} trend="Stable" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <div className="p-6 rounded-2xl glass h-80">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-300">Swarm Intelligence Throughput</h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase">Real-time</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#cbd5e1' }}
              />
              <Area type="monotone" dataKey="activity" stroke="#818cf8" fillOpacity={1} fill="url(#colorActivity)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Distribution */}
        <div className="p-6 rounded-2xl glass h-80">
          <h3 className="font-semibold text-slate-300 mb-6">Agent Resource Allocation</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agents}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#cbd5e1' }}
              />
              <Bar dataKey="tasksAssigned" radius={[4, 4, 0, 0]}>
                {agents.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#4f46e5'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent High-Level Swarm Logs */}
      <div className="p-6 rounded-2xl glass">
        <h3 className="font-semibold text-slate-300 mb-4">Master Agent Stream</h3>
        <div className="space-y-3">
          {logs.slice(0, 5).map((log, i) => (
            <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-slate-900/30 border border-slate-800/50 hover:border-slate-700 transition-colors">
              <span className="text-[10px] font-mono text-slate-500 mt-1 whitespace-nowrap">{log.timestamp}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                log.type === 'ACP' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                log.type === 'A2A' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>{log.type}</span>
              <div className="flex-1">
                <p className="text-sm text-slate-300 font-medium">{log.source}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{log.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode; trend: string }> = ({ title, value, icon, trend }) => (
  <div className="p-6 rounded-2xl glass hover:border-indigo-500/30 transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 group-hover:bg-slate-800 transition-colors">
        {icon}
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'}`}>
        {trend}
      </span>
    </div>
    <p className="text-slate-400 text-sm font-medium">{title}</p>
    <h4 className="text-2xl font-bold text-slate-100 mt-1">{value}</h4>
  </div>
);

export default SwarmDashboard;
