
import React, { useState } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Bot, Sparkles, Image, Search, BarChart3, TrendingUp, User, ChevronRight, Menu, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
interface AppSidebarProps {
  activeView: string | null;
  onViewChange: (view: string | null) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}
const AppSidebar: React.FC<AppSidebarProps> = ({
  activeView,
  onViewChange,
  isCollapsed,
  onToggleCollapse
}) => {
  const { user } = useUser();
  
  const aiTools = [{
    id: 'home',
    title: 'Home',
    description: 'Dashboard overview',
    icon: Home,
    section: 'main'
  }, {
    id: 'content-generator',
    title: 'Content Studio',
    description: 'Generate viral content with AI',
    icon: Bot,
    section: 'ai-tools'
  }, {
    id: 'thumbnail-generator',
    title: 'Thumbnail Creator',
    description: 'Design stunning thumbnails',
    icon: Image,
    section: 'ai-tools'
  }, {
    id: 'thumbnail-search',
    title: 'Trend Explorer',
    description: 'Discover viral patterns',
    icon: Search,
    section: 'ai-tools'
  }, {
    id: 'outlier-detector',
    title: 'Pattern Analyzer',
    description: 'Detect viral opportunities',
    icon: BarChart3,
    section: 'ai-tools'
  }, {
    id: 'keyword-analyzer',
    title: 'SEO Intelligence',
    description: 'Optimize with keywords',
    icon: TrendingUp,
    section: 'ai-tools'
  }, {
    id: 'profile',
    title: 'Profile Hub',
    description: 'YouTube channel analytics',
    icon: User,
    section: 'account'
  }];
  const mainTools = aiTools.filter(tool => tool.section === 'main');
  const aiToolsSection = aiTools.filter(tool => tool.section === 'ai-tools');
  const accountTools = aiTools.filter(tool => tool.section === 'account');
  const renderMenuItem = (tool: any) => {
    const isActive = activeView === tool.id;
    const Icon = tool.icon;
    return <button key={tool.id} onClick={() => onViewChange(tool.id)} className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
          ${isActive ? 'bg-red-600 text-white shadow-lg' : 'text-gray-300 hover:bg-white/10 hover:text-white'}
          ${isCollapsed ? 'justify-center px-2' : 'justify-start'}
        `}>
        <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0`} />
        {!isCollapsed && <div className="flex-1 text-left min-w-0">
            <div className="font-medium text-sm truncate">{tool.title}</div>
            {!isActive && <div className="text-xs text-gray-400 truncate">{tool.description}</div>}
          </div>}
        {isCollapsed && <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
            {tool.title}
          </div>}
      </button>;
  };
  return <div className={`
      fixed left-0 top-0 h-full bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 transition-all duration-300 z-40
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700/50">
        {!isCollapsed && <div className="flex items-center justify-center gap-2 flex-1 my-0 mx-0">
            <div className="w-7 h-7 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg mx-0 px-0">AI Studio</h1>
            </div>
          </div>}
        
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="text-gray-300 hover:text-white hover:bg-white/10">
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 h-[calc(100vh-120px)]">
        <div className="p-2 space-y-4">
          {/* Main Section */}
          <div className="space-y-1">
            {mainTools.map(renderMenuItem)}
          </div>

          {/* AI Tools Section */}
          <div className="space-y-1">
            {!isCollapsed && <div className="px-3 py-1">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Tools</h3>
              </div>}
            {aiToolsSection.map(renderMenuItem)}
          </div>

          {/* Account Section */}
          <div className="space-y-1">
            {!isCollapsed && <div className="px-3 py-1">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</h3>
              </div>}
            {accountTools.map(renderMenuItem)}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700/50">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
          <UserButton appearance={{
          elements: {
            avatarBox: "w-7 h-7",
            userButtonPopoverCard: "bg-gray-900 border border-gray-700",
            userButtonPopoverActions: "text-white"
          }
        }} />
          {!isCollapsed && <div className="text-white">
              <div className="text-sm font-medium">{user?.firstName || 'Creator'}</div>
              <div className="text-xs text-gray-400">Ready to create</div>
            </div>}
        </div>
      </div>
    </div>;
};
export default AppSidebar;
