
import React, { useState } from 'react';
import { Skill } from '../types';
import { Book, Cpu, Code, Database, Search, ShieldCheck, Plus, Search as SearchIcon, Settings2 } from 'lucide-react';

const INITIAL_SKILLS: Skill[] = [
  { id: 's1', name: 'Python Sandbox', description: 'Safe execution of data analysis scripts in isolated kernels.', icon: 'code', complexity: 'MEDIUM', version: '2.1.0' },
  { id: 's2', name: 'Vector RAG', description: 'High-speed retrieval from pinecone and milvus clusters.', icon: 'database', complexity: 'HIGH', version: '1.4.5' },
  { id: 's3', name: 'Web Synthesis', description: 'Deep crawling and multi-source cross-referencing.', icon: 'search', complexity: 'LOW', version: '3.0.1' },
  { id: 's4', name: 'Logic Auditing', description: 'Zero-trust verification of agent reasoning paths.', icon: 'shield', complexity: 'HIGH', version: '0.9.9' }
];

const SkillLibrary: React.FC = () => {
  const [skills] = useState<Skill[]>(INITIAL_SKILLS);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Book className="text-indigo-400" size={24} />
            Neural Skill Library
          </h3>
          <p className="text-sm text-slate-500">Manage cognitive modular capabilities for the swarm.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Filter skills..." 
              className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20">
            <Plus size={18} /> New Module
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skills.map(skill => (
          <div key={skill.id} className="p-6 rounded-2xl glass border border-slate-800 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              {skill.icon === 'code' && <Code size={48} />}
              {skill.icon === 'database' && <Database size={48} />}
              {skill.icon === 'search' && <Search size={48} />}
              {skill.icon === 'shield' && <ShieldCheck size={48} />}
            </div>
            
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
              skill.complexity === 'HIGH' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
              skill.complexity === 'MEDIUM' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
              'bg-green-500/10 text-green-400 border border-green-500/20'
            }`}>
              {skill.icon === 'code' && <Code size={20} />}
              {skill.icon === 'database' && <Database size={20} />}
              {skill.icon === 'search' && <Search size={20} />}
              {skill.icon === 'shield' && <ShieldCheck size={20} />}
            </div>

            <h4 className="font-bold text-slate-100 mb-1">{skill.name}</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">{skill.description}</p>

            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-600">v{skill.version}</span>
              <span className={`px-2 py-0.5 rounded ${
                skill.complexity === 'HIGH' ? 'text-red-400' : 
                skill.complexity === 'MEDIUM' ? 'text-indigo-400' : 'text-green-400'
              }`}>
                {skill.complexity} COMP
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
              <button className="text-[10px] font-bold text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1">
                <Settings2 size={12} /> Configure
              </button>
              <div className="flex -space-x-2">
                 {[1,2].map(i => <div key={i} className="w-5 h-5 rounded-full border border-slate-900 bg-slate-800 text-[8px] flex items-center justify-center">A</div>)}
              </div>
            </div>
          </div>
        ))}

        <button className="border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-600 hover:text-indigo-400 hover:border-indigo-500/30 transition-all group">
          <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Install Core</span>
        </button>
      </div>
    </div>
  );
};

export default SkillLibrary;
