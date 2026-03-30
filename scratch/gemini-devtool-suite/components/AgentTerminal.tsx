import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Trash2, Loader2, ChevronRight } from 'lucide-react';

export const AgentTerminal: React.FC = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<{ type: 'cmd' | 'out' | 'err'; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const runCommand = async () => {
    if (!command.trim()) return;
    
    const newCmd = command;
    setCommand('');
    setOutput(prev => [...prev, { type: 'cmd', text: newCmd }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3005/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: newCmd }),
      });
      const data = await response.json();
      
      if (data.stdout) setOutput(prev => [...prev, { type: 'out', text: data.stdout }]);
      if (data.stderr) setOutput(prev => [...prev, { type: 'err', text: data.stderr }]);
      if (data.error) setOutput(prev => [...prev, { type: 'err', text: data.error }]);
    } catch (err) {
      setOutput(prev => [...prev, { type: 'err', text: 'Failed to connect to agent server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') runCommand();
  };

  return (
    <div className="h-full flex flex-col bg-[#0d1117] text-gray-300 font-mono transition-colors">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#161b22]">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-bold text-gray-200 uppercase tracking-widest">Agent Terminal</span>
        </div>
        <button onClick={() => setOutput([])} className="p-1.5 hover:bg-gray-700 rounded transition-colors text-gray-500">
           <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 selection:bg-emerald-500/30">
        <div className="text-xs text-gray-500 mb-4 opacity-50"># Terminal initialized at {new Date().toLocaleTimeString()}</div>
        
        {output.map((line, i) => (
          <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-200">
            {line.type === 'cmd' && (
              <div className="flex items-center gap-2 text-emerald-400">
                <ChevronRight className="w-3 h-3" />
                <span className="font-bold">{line.text}</span>
              </div>
            )}
            {line.type === 'out' && <pre className="whitespace-pre-wrap ml-5 py-1 text-gray-300">{line.text}</pre>}
            {line.type === 'err' && <pre className="whitespace-pre-wrap ml-5 py-1 text-rose-500 bg-rose-500/5 px-2 rounded font-semibold italic">{line.text}</pre>}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 ml-5 text-gray-500 italic animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" /> Executing...
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-[#161b22] border-t border-gray-800">
        <div className="flex items-center gap-3 max-w-5xl mx-auto w-full">
            <span className="text-emerald-500 font-bold">$</span>
            <input 
              type="text" 
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="npm run build, ls -la, git status..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-100 placeholder:text-gray-600 w-full"
              autoFocus
            />
            <button 
              onClick={runCommand}
              disabled={isLoading || !command.trim()}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-all disabled:opacity-30 shadow-lg shadow-emerald-900/20"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
        </div>
      </div>
    </div>
  );
};
