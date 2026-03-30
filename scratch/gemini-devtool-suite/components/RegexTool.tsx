import React, { useState } from 'react';
import { explainRegexPattern } from '../services/geminiService';
import { RegexExplanation } from '../types';
import { Search, ChevronRight, Loader2, Play } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export const RegexTool: React.FC = () => {
  const [pattern, setPattern] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<RegexExplanation | null>(null);

  const handleExplain = async () => {
    if (!pattern.trim()) return;

    setIsLoading(true);
    setExplanation(null);

    try {
      const result = await explainRegexPattern(pattern);
      setExplanation({
        pattern,
        explanation: result
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white transition-colors duration-200">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold">Regex Lab</h2>
        <p className="text-sm text-gray-500 font-mono">Powered by Gemini Flash Lite</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
            
            <div className="bg-gray-50 dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-xl transition-colors">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Enter Regular Expression</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-mono text-lg">/</span>
                        <input
                            type="text"
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                            placeholder="^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$"
                            className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg py-4 pl-8 pr-4 text-lg font-mono text-gray-900 dark:text-yellow-400 placeholder-gray-400 dark:placeholder-gray-700 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                            onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-mono text-lg">/gm</span>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleExplain}
                        disabled={isLoading || !pattern.trim()}
                        className="bg-yellow-600 hover:bg-yellow-500 text-white dark:text-black font-semibold px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                        Explain Pattern
                    </button>
                </div>
            </div>

            {explanation && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gray-50 dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg transition-colors">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 flex items-center gap-2">
                            <Search className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Analysis Result</h3>
                        </div>
                        <div className="p-6 md:p-8">
                            <MarkdownRenderer content={explanation.explanation} />
                        </div>
                    </div>
                </div>
            )}
            
            {!explanation && !isLoading && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ChevronRight className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                    </div>
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium">Ready to analyze</h3>
                    <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">Enter a regex pattern above to get a plain English breakdown.</p>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
