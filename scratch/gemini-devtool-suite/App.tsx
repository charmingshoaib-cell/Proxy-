import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { AssetGenerator } from './components/AssetGenerator';
import { RegexTool } from './components/RegexTool';
import { JsonTool } from './components/JsonTool';
import { TestGenerator } from './components/TestGenerator';
import { AgentTerminal } from './components/AgentTerminal';
import { WorkspaceExplorer } from './components/WorkspaceExplorer';
import { GamblerLab } from './components/GamblerLab';
import { Dashboard } from './components/Dashboard';
import { FileEditor } from './components/FileEditor';
import { View, ModelType } from './types';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.ASSISTANT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.FLASH_2_0);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [selectedRootId, setSelectedRootId] = useState<string>('project');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const renderView = () => {
    switch (currentView) {
      case View.ASSISTANT:
        return <ChatInterface selectedModel={selectedModel} onModelChange={setSelectedModel} />;
      case View.ASSETS:
        return <AssetGenerator />;
      case View.REGEX:
        return <RegexTool />;
      case View.JSON:
        return <JsonTool />;
      case View.TEST:
        return <TestGenerator selectedModel={selectedModel} />;
      case View.TERMINAL:
        return <AgentTerminal />;
      case View.WORKSPACE:
        return <WorkspaceExplorer onOpenFile={openFile} selectedRootId={selectedRootId} onRootChange={setSelectedRootId} />;
      case View.GAMBLER:
        return <GamblerLab selectedModel={selectedModel} />;
      case View.DASHBOARD:
        return <Dashboard />;
      case View.FILE_EDITOR:
        return <FileEditor filePath={selectedFilePath} rootId={selectedRootId} onBack={() => setCurrentView(View.WORKSPACE)} />;
      default:
        return <ChatInterface selectedModel={selectedModel} onModelChange={setSelectedModel} selectedRootId={selectedRootId} />;
    }
  };

  const openFile = (path: string, rootId: string = selectedRootId) => {
    setSelectedFilePath(path);
    setSelectedRootId(rootId);
    setCurrentView(View.FILE_EDITOR);
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    setIsSidebarOpen(false); // Close sidebar on mobile on selection
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white font-sans transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-50 dark:bg-[#0d1117] transform transition-transform duration-300 ease-in-out md:relative md:transform-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          currentView={currentView} 
          onViewChange={handleViewChange} 
          isDark={isDark} 
          toggleTheme={toggleTheme} 
          selectedModel={selectedModel}
          onOpenFile={openFile}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative bg-white dark:bg-[#0d1117]">
        {/* Mobile Header Toggle */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d1117]">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <span className="ml-3 font-semibold text-gray-900 dark:text-gray-200">Gemini DevTool</span>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* View Content */}
        <main className="flex-1 relative overflow-hidden">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
