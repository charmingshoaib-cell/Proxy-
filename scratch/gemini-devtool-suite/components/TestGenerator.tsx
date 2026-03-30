import React, { useState } from 'react';
import { generateUnitTests } from '../services/geminiService';
import { Code2, Play, Loader2, Clipboard, Check, Trash2 } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ModelType } from '../types';

interface TestGeneratorProps {
  selectedModel: ModelType;
}

export const TestGenerator: React.FC<TestGeneratorProps> = ({ selectedModel }) => {
  const [code, setCode] = useState('');
  const [tests, setTests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setTests('');

    try {
      const result = await generateUnitTests(code, selectedModel);
      setTests(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tests);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setCode('');
    setTests('');
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white transition-colors duration-200">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold">Unit Test Generator</h2>
        <p className="text-sm text-gray-500 font-mono">Create Vitest/Jest tests for your snippets</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto flex flex-col space-y-8">
            
            <div className="bg-gray-50 dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-xl transition-colors">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Paste your code or function</label>
                        <button onClick={clear} className="text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors">
                            <Trash2 className="w-4 h-4" /> Clear
                        </button>
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="export function calculateTotal(items) { \n  return items.reduce((sum, item) => sum + item.price, 0); \n}"
                        className="w-full h-40 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !code.trim()}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                        Generate Tests
                    </button>
                </div>
            </div>

            {tests && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gray-50 dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg transition-colors">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Generated Unit Tests</h3>
                            </div>
                            <button onClick={handleCopy} className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                                {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                        <div className="p-6 md:p-8">
                            <MarkdownRenderer content={tests} />
                        </div>
                    </div>
                </div>
            )}
            
            {!tests && !isLoading && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Code2 className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium">No tests generated yet</h3>
                    <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">Provide your code snippet above to generate tests using AI.</p>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
