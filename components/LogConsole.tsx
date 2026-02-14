
import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';

const LogConsole: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <div className="flex gap-2">
           <div className="w-3 h-3 rounded-full bg-red-500/50" />
           <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
           <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">System Kernel v4.2 // swarm_logs.sh</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono text-sm space-y-2 p-6 rounded-2xl glass scroll-smooth"
      >
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-20 space-y-4">
             <div className="w-16 h-1 bg-slate-700 rounded-full animate-pulse" />
             <p className="text-slate-400">Kernel buffer empty. System silent.</p>
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="group flex gap-4 border-b border-slate-800/20 pb-2 hover:bg-slate-900/20 transition-colors">
              <span className="text-slate-600 shrink-0 select-none">[{log.timestamp}]</span>
              <span className={`font-bold shrink-0 ${
                log.type === 'ERROR' ? 'text-red-400' : 
                log.type === 'SUCCESS' ? 'text-green-400' :
                log.type === 'WARNING' ? 'text-yellow-400' :
                log.type === 'ACP' ? 'text-purple-400' : 'text-blue-400'
              }`}>
                {log.source.padEnd(15)} &gt;
              </span>
              <span className="text-slate-300 break-all leading-relaxed">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogConsole;
