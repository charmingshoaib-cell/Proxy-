import React, { useState } from 'react';
import { ModelType } from '../types';
import { sendMessageToChat, createChatSession } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Coins, Zap, Send, Loader2, Save, FileCode, Check, AlertCircle } from 'lucide-react';

interface GamblerLabProps {
  selectedModel: ModelType;
}

export const GamblerLab: React.FC<GamblerLabProps> = ({ selectedModel }) => {
  const [prompt, setPrompt] = useState('');
  const [strategy, setStrategy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'lua' | 'javascript' | 'python' | 'csharp'>('lua');
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');

  const generateStrategy = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setStrategy('');
    
    const session = createChatSession(selectedModel);
    const systemPrompt = `You are a professional Gambler.Bot strategy developer. 
    Generate a high-performance, safe betting strategy in ${language} for the user's specific intent.
    Focus on risk management and transparency.
    Wrap the code in a markdown code block.
    User Intent: ${prompt}`;

    try {
      const response = await sendMessageToChat(session, systemPrompt);
      setStrategy(response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deployToBot = async () => {
    if (!strategy) return;
    
    // Extract code from markdown
    const codeMatch = strategy.match(/```(?:\w*)\n?([\s\S]*?)```/);
    const codeContent = codeMatch ? codeMatch[1] : strategy;

    setDeployStatus('deploying');
    try {
      const response = await fetch('http://localhost:3005/api/gambler/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, content: codeContent }),
      });
      
      if (response.ok) {
        setDeployStatus('success');
        setTimeout(() => setDeployStatus('idle'), 3000);
      } else {
        setDeployStatus('error');
      }
    } catch (err) {
      setDeployStatus('error');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0d1117] transition-colors duration-200">
      <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                <Coins className="w-6 h-6 text-white" />
              </div>
              Gambler Bot Lab
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Generate and Auto-Deploy High-Performance Strategies</p>
          </div>
          <div className="flex items-center gap-3">
             <select 
               value={language}
               onChange={(e) => setLanguage(e.target.value as any)}
               className="bg-gray-100 dark:bg-[#161b22] border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/50 outline-none transition-all cursor-pointer"
             >
               <option value="lua">Lua (Recommended)</option>
               <option value="javascript">JavaScript</option>
               <option value="python">Python</option>
               <option value="csharp">C# (Advanced)</option>
             </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row p-6 gap-6">
        {/* Input Panel */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="bg-gray-50 dark:bg-[#161b22]/50 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-blue-600">
              <Zap className="w-4 h-4 fill-current" />
              Strategy Intent
            </h3>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a Martingale strategy for Limbo that doubles on loss and resets after 5 consecutive wins..."
              className="w-full h-48 bg-white dark:bg-[#0d1117] border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none resize-none transition-all placeholder:text-gray-400"
            />
            <button 
              onClick={generateStrategy}
              disabled={isLoading || !prompt.trim()}
              className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
              GENERATE STRATEGY
            </button>
          </div>

          <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-bold text-lg mb-2">Agentic Sync Active</h4>
              <p className="text-xs text-blue-100 leading-relaxed opacity-90">Strategies are automatically synced with your local Gambler.Bot instance for instant execution.</p>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase bg-white/10 w-fit px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Live Connection Stable
              </div>
            </div>
            <Coins className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#161b22]/30 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm relative">
          <div className="p-4 border-bottom border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white/50 dark:bg-black/20 backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
               <FileCode className="w-4 h-4" />
               PREVIEW: default.{language === 'javascript' ? 'js' : language === 'csharp' ? 'cs' : language === 'python' ? 'py' : 'lua'}
            </div>
            {strategy && (
              <button 
                onClick={deployToBot}
                disabled={deployStatus === 'deploying'}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-md ${
                  deployStatus === 'success' ? 'bg-emerald-500 text-white' :
                  deployStatus === 'error' ? 'bg-rose-500 text-white' :
                  'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
                }`}
              >
                {deployStatus === 'deploying' ? <Loader2 className="w-3 h-3 animate-spin" /> : 
                 deployStatus === 'success' ? <Check className="w-3 h-3" /> :
                 deployStatus === 'error' ? <AlertCircle className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                {deployStatus === 'success' ? 'DEPLOYED!' : deployStatus === 'error' ? 'RETRY' : 'DEPLOY TO BOT'}
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-[#0d1117]">
            {strategy ? (
              <MarkdownRenderer content={strategy} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600/30 font-black text-4xl select-none">
                 IDLE COMPILER
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
