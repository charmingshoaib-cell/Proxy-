import React, { useState, useEffect } from 'react';
import { FolderOpen, File, RefreshCw, ExternalLink, Search, ChevronRight, FileCode, Folder } from 'lucide-react';

interface WorkspaceExplorerProps {
  onOpenFile: (path: string, rootId?: string) => void;
  selectedRootId: string;
  onRootChange: (rootId: string) => void;
}

export const WorkspaceExplorer: React.FC<WorkspaceExplorerProps> = ({ onOpenFile, selectedRootId, onRootChange }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3005/api/files/list?rootId=${selectedRootId}`);
      if (!response.ok) throw new Error('Failed to fetch files');
      const data = await response.json();
      setFiles(data.map((f: any) => f.path));
    } catch (err) {
      setError('Could not connect to workspace server.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedRootId]);

  const filteredFiles = files.filter(f => 
    f.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simple tree-like grouping (can be improved for nested hierarchies)
  const groupedFiles = filteredFiles.reduce((acc, file) => {
    const parts = file.split('/');
    const dir = parts.length > 1 ? parts.slice(0, -1).join('/') : 'root';
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(parts[parts.length - 1]);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0d1117] transition-colors duration-200">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur z-10 sticky top-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Workspace</h2>
          <p className="text-xs text-blue-500 font-mono flex items-center gap-1 mt-1">
            <FolderOpen className="w-3 h-3" /> Browsing {selectedRootId.toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
            <select 
                value={selectedRootId}
                onChange={(e) => onRootChange(e.target.value)}
                title="Select Active Drive/Root"
                className="bg-gray-100 dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
            >
                <option value="project">📁 DEVTOOL PROJECT</option>
                <option value="hp">🏠 USER PROFILE (HP)</option>
                <option value="onedrive">☁️ ONEDRIVE (PERSONAL)</option>
                <option value="c">💿 LOCAL DISK (C:)</option>
                <option value="g">💿 GOOGLE DRIVE (G:)</option>
                <option value="h">💿 GOOGLE DRIVE (H:)</option>
            </select>
            <button 
              onClick={fetchFiles}
              disabled={isLoading}
              className="p-2 hover:bg-blue-50 text-gray-500 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-lg transition-all"
              title="Refresh Workspace"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#161b22]/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {isLoading && files.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3 opacity-50">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <p className="font-mono text-sm">Scanning workspace...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        ) : (
          Object.entries(groupedFiles).map(([dir, dirFiles]) => (
            <div key={dir} className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2">
                <Folder className="w-3 h-3" />
                <span>{dir === 'root' ? 'PROJECT ROOT' : dir}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dirFiles.map((fileName) => (
                  <div 
                    key={fileName}
                    onClick={() => onOpenFile(`${dir === 'root' ? '' : dir + '/'}${fileName}`, selectedRootId)}
                    className="group bg-white dark:bg-[#161b22] border border-gray-100 dark:border-gray-800 p-3 rounded-xl hover:border-blue-500 dark:hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-500/5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 dark:bg-[#0d1117] rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
                          {fileName.endsWith('.tsx') || fileName.endsWith('.ts') ? (
                            <FileCode className="w-4 h-4 text-blue-500" />
                          ) : (
                            <File className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">{fileName}</div>
                          <div className="text-[10px] text-gray-400 font-mono lowercase">.{fileName.split('.').pop()}</div>
                        </div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
