import React from 'react';
import { View, ModelType } from '../types';
import { Terminal, Image, Search, Code2, Sun, Moon, Braces, FileCode, FolderOpen, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isDark: boolean;
  toggleTheme: () => void;
  selectedModel: ModelType;
  onOpenFile?: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isDark, toggleTheme, selectedModel, onOpenFile }) => {
  const navItems = [
    { id: View.ASSISTANT, label: 'Assistant', icon: Terminal, description: 'Code & Strategy' },
    { id: View.ASSETS, label: 'Assets', icon: Image, description: 'Icons & Placeholders' },
    { id: View.REGEX, label: 'Regex Lab', icon: Search, description: 'Explain & Debug' },
    { id: View.JSON, label: 'JSON Tools', icon: Braces, description: 'Prettify & Validate' },
    { id: View.TEST, label: 'Test Gen', icon: FileCode, description: 'Unit Test Suite' },
    { id: View.TERMINAL, label: 'Terminal', icon: Terminal, description: 'Agentic Shell' },
    { id: View.WORKSPACE, label: 'Workspace', icon: FolderOpen, description: 'File Explorer' },
    { id: View.GAMBLER, label: 'Gambler Lab', icon: FileCode, description: 'Strategy Hub' },
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, description: 'Data Analytics' },
  ];

  return (
    <div className="w-full md:w-64 bg-gray-50 dark:bg-[#0d1117] border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 flex flex-col h-auto md:h-full shrink-0 transition-colors duration-200">
      <div className="p-6 flex items-center space-x-3 border-b border-gray-200 dark:border-gray-800">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Code2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-gray-900 dark:text-white tracking-tight">DevTool</h1>
          <p className="text-xs text-gray-500 font-mono">Suite v1.0</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
              currentView === item.id
                ? 'bg-blue-100 dark:bg-blue-600/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-600/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white'}`} />
            <div>
              <div className="font-medium text-sm">{item.label}</div>
              <div className="text-[10px] opacity-70 font-mono uppercase tracking-wider">{item.description}</div>
            </div>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
        
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
            <span className="flex items-center gap-2">
                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
            <div className={`w-8 h-4 bg-gray-300 dark:bg-gray-700 rounded-full relative transition-colors`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isDark ? 'right-0.5' : 'left-0.5'}`}></div>
            </div>
        </button>

        <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3 text-xs text-gray-500 font-mono">
            <div className="flex items-center justify-between mb-1">
                <span>STATUS</span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
            {selectedModel.replace(/-/g, ' ').toUpperCase()}
        </div>
      </div>
    </div>
  );
};
