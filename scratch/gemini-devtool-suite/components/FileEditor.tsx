import React, { useState, useEffect } from 'react';
import { Save, ChevronLeft, Loader2, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';

interface FileEditorProps {
  filePath: string | null;
  rootId: string;
  onBack: () => void;
}

export const FileEditor: React.FC<FileEditorProps> = ({ filePath, rootId, onBack }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (filePath) {
      loadFile();
    }
  }, [filePath]);

  const loadFile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3005/api/files/read?path=${encodeURIComponent(filePath!)}&rootId=${rootId}`);
      if (!response.ok) throw new Error('Failed to read file');
      const data = await response.json();
      setContent(data.content);
    } catch (err) {
      setError('Error loading file. Check if the server is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFile = async () => {
    if (!filePath) return;
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch('http://localhost:3005/api/files/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath, content, rootId }),
      });
      if (!response.ok) throw new Error('Failed to save file');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Error saving file.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!filePath) return null;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0d1117] transition-colors duration-200">
      {/* Editor Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur z-20 sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            aria-label="Go back to workspace"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-500" />
                <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-md">{filePath.split('/').pop()}</h2>
            </div>
            <p className="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">{filePath}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {success && (
            <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium animate-in fade-in slide-in-from-right-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-1.5 text-rose-500 text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Error</span>
            </div>
          )}
          <button 
            onClick={saveFile}
            disabled={isSaving || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all disabled:opacity-50 text-sm font-semibold shadow-lg shadow-blue-500/20"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-[#161b22]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="font-mono text-sm">Reading file content...</p>
          </div>
        ) : error && !content ? (
            <div className="p-8 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto opacity-50" />
                <p className="text-gray-400 font-mono text-sm">{error}</p>
                <button onClick={loadFile} className="text-blue-500 underline text-sm">Retry</button>
            </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
            className="w-full h-full p-6 bg-transparent text-gray-300 font-mono text-sm resize-none focus:outline-none leading-relaxed selection:bg-blue-500/30"
            placeholder="File is empty..."
          />
        )}
      </div>

      {/* Editor Footer */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0d1117] flex justify-between items-center px-4">
        <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
            {content.length} characters | {content.split('\n').length} lines
        </div>
        <div className="flex items-center gap-4">
            <button className="text-[10px] text-blue-500 hover:underline font-bold uppercase tracking-widest">Ask AI to Refactor</button>
            <button className="text-[10px] text-gray-500 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest">Format JSON</button>
        </div>
      </div>
    </div>
  );
};
