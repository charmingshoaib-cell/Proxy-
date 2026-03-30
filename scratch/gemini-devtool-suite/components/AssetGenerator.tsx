import React, { useState } from 'react';
import { generateAsset } from '../services/geminiService';
import { GeneratedImage } from '../types';
import { Wand2, Download, AlertCircle, Loader2 } from 'lucide-react';

export const AssetGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const imageUrl = await generateAsset(prompt);
      
      if (imageUrl) {
        const newImage: GeneratedImage = {
          url: imageUrl,
          prompt: prompt,
          timestamp: Date.now()
        };
        setGeneratedImages(prev => [newImage, ...prev]);
      } else {
        setError("The model generated a response but no image was found. Try a more descriptive prompt.");
      }
    } catch (err) {
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `gemini-asset-${index}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white overflow-hidden transition-colors duration-200">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold">Asset Generator</h2>
        <p className="text-sm text-gray-500 font-mono">Powered by Gemini 2.5 Flash Image</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
            
          {/* Input Section */}
          <div className="bg-gray-50 dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xl transition-colors">
             <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Describe the asset you need
             </label>
             <div className="flex gap-4 flex-col md:flex-row">
                 <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A minimalist vector icon of a cloud server, blue gradient, dark background..."
                    className="flex-1 bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                 />
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                    <span>Generate</span>
                 </button>
             </div>
             {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
             )}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generatedImages.map((img, idx) => (
                <div key={img.timestamp} className="group relative bg-gray-50 dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
                    <div className="aspect-square w-full bg-gray-200 dark:bg-[#0d1117] relative">
                         <img src={img.url} alt={img.prompt} className="w-full h-full object-contain" />
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={() => handleDownload(img.url, idx)}
                                className="bg-white text-black px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-gray-200 transform translate-y-2 group-hover:translate-y-0 transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Save Asset
                            </button>
                         </div>
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{img.prompt}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-600 mt-2 font-mono">{new Date(img.timestamp).toLocaleTimeString()}</p>
                    </div>
                </div>
            ))}
            {generatedImages.length === 0 && !isLoading && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 dark:text-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-xl">
                    <Wand2 className="w-12 h-12 mb-4 opacity-50" />
                    <p>No assets generated yet.</p>
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
