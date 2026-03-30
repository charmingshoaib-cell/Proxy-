import React, { useState } from 'react';
import { Play, Check, AlertCircle, Loader2, List, FileCode, Terminal } from 'lucide-react';

interface AgentAction {
  type: 'run' | 'write' | 'read';
  path?: string;
  command?: string;
  content?: string;
  description?: string;
}

interface TaskOrchestratorProps {
  planId: string;
  actions: AgentAction[];
}

export const TaskOrchestrator: React.FC<TaskOrchestratorProps> = ({ planId, actions }) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [stepStatuses, setStepStatuses] = useState<('pending' | 'running' | 'done' | 'error')[]>(
    new Array(actions.length).fill('pending')
  );
  const [logs, setLogs] = useState<string[]>([]);

  const executeStep = async (index: number) => {
    const action = actions[index];
    const newStatuses = [...stepStatuses];
    newStatuses[index] = 'running';
    setStepStatuses(newStatuses);

    try {
      let url = '';
      let body = {};
      
      if (action.type === 'run') {
        url = 'http://localhost:3005/api/terminal';
        body = { command: action.command };
      } else if (action.type === 'write') {
        url = 'http://localhost:3005/api/files/write';
        body = { path: action.path, content: action.content };
      } else if (action.type === 'read') {
        url = `http://localhost:3005/api/files/read?path=${encodeURIComponent(action.path || '')}`;
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          newStatuses[index] = 'done';
          setLogs(prev => [...prev, `[READ] ${action.path}: ${data.content.substring(0, 50)}...`]);
          return true;
        } else {
          throw new Error(data.error);
        }
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (response.ok) {
        newStatuses[index] = 'done';
        setLogs(prev => [...prev, `[DONE] ${action.description || action.command || action.path}`]);
      } else {
        newStatuses[index] = 'error';
        setLogs(prev => [...prev, `[ERROR] ${data.error || 'Failed to execute step'}`]);
        return false;
      }
    } catch (err) {
      newStatuses[index] = 'error';
      setLogs(prev => [...prev, `[CRITICAL] Connection failed.`]);
      return false;
    }

    setStepStatuses([...newStatuses]);
    return true;
  };

  const executeAll = async () => {
    setStatus('running');
    setLogs(['Initializing Task Orchestrator...']);
    
    for (let i = 0; i < actions.length; i++) {
      const success = await executeStep(i);
      if (!success) {
        setStatus('error');
        return;
      }
    }
    
    setStatus('completed');
  };

  return (
    <div className="my-6 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/10 overflow-hidden shadow-xl shadow-indigo-500/5 animate-in fade-in zoom-in duration-300">
      <div className="bg-indigo-600 dark:bg-indigo-600 px-5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <List className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Suggested Task Plan</h3>
            <p className="text-indigo-100 text-[10px] font-mono tracking-wider">Plan ID: {planId}</p>
          </div>
        </div>
        {status === 'idle' && (
          <button 
            onClick={executeAll}
            className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <Play className="w-4 h-4 fill-current" />
            EXECUTE PLAN
          </button>
        )}
        {status === 'running' && (
          <div className="flex items-center gap-2 text-white text-xs font-bold animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            ORCHESTRATING...
          </div>
        )}
        {status === 'completed' && (
          <div className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg">
            <Check className="w-4 h-4" />
            TASK FINISHED
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg">
            <AlertCircle className="w-4 h-4" />
            FAILED
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        {actions.map((action, i) => (
          <div key={i} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
            stepStatuses[i] === 'done' ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20 opacity-70' :
            stepStatuses[i] === 'running' ? 'bg-white dark:bg-white/5 border-indigo-400 dark:border-indigo-500 shadow-md ring-1 ring-indigo-500/20' :
            stepStatuses[i] === 'error' ? 'bg-rose-50 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/20' :
            'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
              stepStatuses[i] === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' :
              stepStatuses[i] === 'running' ? 'bg-indigo-600 border-indigo-600 text-white animate-pulse' :
              stepStatuses[i] === 'error' ? 'bg-rose-500 border-rose-500 text-white' :
              'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
            }`}>
              {stepStatuses[i] === 'done' ? <Check className="w-4 h-4" /> :
               stepStatuses[i] === 'running' ? <Loader2 className="w-4 h-4 animate-spin" /> :
               stepStatuses[i] === 'error' ? <AlertCircle className="w-4 h-4" /> :
               <span className="text-[10px] font-bold">{i + 1}</span>}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                {action.type === 'run' ? <Terminal className="w-3 h-3 text-indigo-500" /> : <FileCode className="w-3 h-3 text-emerald-500" />}
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{action.type}</span>
              </div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate">
                {action.description || action.command || action.path}
              </div>
            </div>

            {stepStatuses[i] === 'running' && (
              <div className="text-[10px] font-bold text-indigo-500 animate-pulse tracking-tight">EXECUTING</div>
            )}
          </div>
        ))}
      </div>

      {logs.length > 0 && (
        <div className="px-5 pb-5 font-mono text-[10px] text-gray-500 space-y-1 max-h-32 overflow-y-auto border-t border-gray-100 dark:border-gray-800 pt-4">
          {logs.map((log, i) => (
            <div key={i} className={log.includes('ERROR') ? 'text-rose-500' : log.includes('DONE') ? 'text-emerald-500' : ''}>
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
