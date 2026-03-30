import React, { useState } from 'react';
import { Copy, Check, Save, HardDrive, AlertCircle, Play } from 'lucide-react';
import { TaskOrchestrator } from './TaskOrchestrator';

interface CodeBlockProps {
  language: string;
  code: string;
  rootId?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code, rootId }) => {
  const [copied, setCopied] = useState(false);
  const [filePath, setFilePath] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const isShellCommand = ['bash', 'sh', 'shell', 'cmd', 'powershell'].includes(language.toLowerCase());

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSave = async () => {
    if (!filePath) return;
    setSaveStatus('saving');
    try {
      const response = await fetch('http://localhost:3005/api/files/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath, content: code, rootId: rootId || 'project' }),
      });
      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      setSaveStatus('error');
      console.error(err);
    }
  };

  const handleRunCommand = async () => {
    setSaveStatus('saving');
    try {
      const response = await fetch('http://localhost:3005/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: code }),
      });
      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 5000);
        alert(`Command Finished.\nCheck the Terminal tab in sidebar for full output.`);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      setSaveStatus('error');
      console.error(err);
    }
  };

  return (
    <div className="relative group rounded-lg overflow-hidden my-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#161b22] transition-colors shadow-sm">
      <div className="bg-gray-100 dark:bg-gray-800/80 px-4 py-3 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 dark:border-gray-700/50 gap-3">
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-hidden">
          <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded shrink-0">
            {language || 'text'}
          </span>
          
          {isShellCommand ? (
              <button 
                onClick={handleRunCommand}
                disabled={saveStatus === 'saving'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                  saveStatus === 'success' ? 'bg-indigo-500 text-white' :
                  saveStatus === 'error' ? 'bg-red-500 text-white' :
                  'bg-orange-600 hover:bg-orange-500 text-white disabled:opacity-50'
                }`}
              >
                {saveStatus === 'saving' ? <span className="animate-spin text-white">...</span> : 
                 saveStatus === 'success' ? <Check className="w-3 h-3" /> : 
                 saveStatus === 'error' ? <AlertCircle className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                {saveStatus === 'success' ? 'Executed!' : saveStatus === 'error' ? 'Error' : 'Run Command'}
              </button>
          ) : (
            <>
              <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 w-full max-w-[200px] transition-all focus-within:ring-2 focus-within:ring-blue-500/30">
                <HardDrive className="w-3 h-3 text-gray-400 mr-2 shrink-0" />
                <input 
                  type="text" 
                  placeholder="e.g. index.css" 
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  className="bg-transparent border-none text-[11px] outline-none text-gray-700 dark:text-gray-200 w-full"
                />
              </div>
              <button 
                onClick={handleSave}
                disabled={!filePath || saveStatus === 'saving'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                  saveStatus === 'success' ? 'bg-emerald-500 text-white' :
                  saveStatus === 'error' ? 'bg-red-500 text-white' :
                  'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50'
                }`}
              >
                {saveStatus === 'saving' ? <span className="animate-spin text-white">...</span> : 
                 saveStatus === 'success' ? <Check className="w-3 h-3" /> : 
                 saveStatus === 'error' ? <AlertCircle className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                {saveStatus === 'success' ? 'Applied!' : saveStatus === 'error' ? 'Error' : 'Apply'}
              </button>
            </>
          )}
        </div>

        <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors focus:outline-none font-medium ml-auto md:ml-0"
            title="Copy to clipboard"
        >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className={copied ? "text-emerald-500 dark:text-emerald-400" : ""}>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 md:p-6 overflow-x-auto font-mono text-sm text-gray-800 dark:text-emerald-200 bg-white dark:bg-[#0d1117] selection:bg-blue-500/20">
        <code>{code}</code>
      </pre>
    </div>
  );
};

interface MarkdownRendererProps {
  content: string;
  rootId?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, rootId }) => {
  // Simple parser to handle code blocks and paragraphs
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // Extract language and code content
          const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
          
          if (match) {
            const language = match[1] || '';
            const code = match[2];

            // Special handling for Action Plans
            if (code.includes('"actions"') && code.trim().startsWith('{')) {
              try {
                const plan = JSON.parse(code);
                if (plan.actions && Array.isArray(plan.actions)) {
                  return <TaskOrchestrator key={index} planId={Math.random().toString(36).substr(2, 9)} actions={plan.actions} />;
                }
              } catch (e) {
                // Not a valid plan, fallback to regular code block
              }
            }
            
            return <CodeBlock key={index} language={language} code={code} rootId={rootId} />;
          }
        }

        // Render standard text with simple bolding
        const paragraphs = part.split('\n\n').filter(p => p.trim());
        return (
          <div key={index}>
            {paragraphs.map((p, pIndex) => (
              <p key={pIndex} className="mb-2 whitespace-pre-wrap">
                {p.split(/(\*\*.*?\*\*)/g).map((segment, sIndex) => {
                    if (segment.startsWith('**') && segment.endsWith('**')) {
                        return <strong key={sIndex} className="text-gray-900 dark:text-white font-semibold">{segment.slice(2, -2)}</strong>;
                    }
                    return segment;
                })}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
};
