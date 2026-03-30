import React, { useState } from 'react';
import { FileJson, Clipboard, Trash2, Check, AlertCircle } from 'lucide-react';

export const JsonTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white transition-colors duration-200">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold">JSON Prettifier</h2>
        <p className="text-sm text-gray-500 font-mono">Format and validate JSON objects</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[500px]">
          
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center text-sm text-gray-500 font-medium">
              <label>Input RAW JSON</label>
              <button onClick={clear} className="text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors">
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"key": "value", "list": [1, 2, 3]}'
              className="flex-1 bg-gray-50 dark:bg-[#161b22] border border-gray-300 dark:border-gray-700 rounded-xl p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none transition-colors"
            />
            <button
              onClick={formatJson}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FileJson className="w-5 h-5" />
              Prettify JSON
            </button>
          </div>

          <div className="flex flex-col space-y-2 relative">
            <div className="flex justify-between items-center text-sm text-gray-500 font-medium">
              <label>Formatted Output</label>
              {output && (
                <button onClick={handleCopy} className="text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                  {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <div className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 font-mono text-sm overflow-auto transition-colors">
              {error ? (
                <div className="flex items-start gap-2 text-red-500 bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>Invalid JSON: {error}</p>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap">{output || 'Output will appear here...'}</pre>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
