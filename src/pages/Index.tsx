import React, { useState } from 'react';
import { Sparkles, Image, Search, BarChart3, TrendingUp } from 'lucide-react';
import AIToolCard from '@/components/AIToolCard';
import ContentGenerator from '@/components/ContentGenerator';
import ThumbnailGenerator from '@/components/ThumbnailGenerator';
import ThumbnailSearch from '@/components/ThumbnailSearch';
import OutlierDetector from '@/components/OutlierDetector';
import KeywordAnalyzer from '@/components/KeywordAnalyzer';
import ProfileHub from '@/components/ProfileHub';
import AppSidebar from '@/components/AppSidebar';

const Index = () => {
  const [activeView, setActiveView] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const aiTools = [{
    id: 'content-generator',
    title: 'AI Content Generator',
    description: 'Generate optimized YouTube titles, descriptions, tags, and thumbnail prompts using advanced AI.',
    icon: Sparkles,
    gradient: 'from-purple-500 to-pink-500',
    component: ContentGenerator
  }, {
    id: 'thumbnail-generator',
    title: 'Thumbnail Generator',
    description: 'Create stunning, professional YouTube thumbnails with AI-powered design assistance.',
    icon: Image,
    gradient: 'from-green-500 to-teal-500',
    component: ThumbnailGenerator
  }, {
    id: 'thumbnail-search',
    title: 'Thumbnail Search',
    description: 'Discover trending thumbnails and analyze competitor strategies with AI insights.',
    icon: Search,
    gradient: 'from-indigo-500 to-purple-500',
    component: ThumbnailSearch
  }, {
    id: 'outlier-detector',
    title: 'Outlier Detection',
    description: 'Identify viral videos and content anomalies using statistical analysis and smart scoring.',
    icon: BarChart3,
    gradient: 'from-orange-500 to-red-500',
    component: OutlierDetector
  }, {
    id: 'keyword-analyzer',
    title: 'Keyword Analyzer',
    description: 'Extract trending keywords with SEO scores and related search phrases for optimization.',
    icon: TrendingUp,
    gradient: 'from-blue-500 to-cyan-500',
    component: KeywordAnalyzer
  }];

  const renderActiveView = () => {
    if (activeView === 'profile') {
      return <ProfileHub />;
    }
    if (activeView === 'home' || !activeView) {
      return renderHomePage();
    }
    const activeTool = aiTools.find(tool => tool.id === activeView);
    if (!activeTool) return renderHomePage();
    const Component = activeTool.component;
    return <Component />;
  };

  const renderHomePage = () => <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Hero Section */}
      <div className="text-center mb-20 py-16 px-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-gradient-to-r from-red-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
          </div>
          <div className="relative">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-red-200 to-blue-200 bg-clip-text text-transparent">
              YouTube AI Studio
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-5xl mx-auto leading-relaxed">
              Transform your YouTube channel with intelligent AI tools that understand, analyze, and optimize your content for maximum impact.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
              <div className="flex items-center space-x-4 text-base text-red-400">
                <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50" />
                <span className="font-semibold">Content Generation</span>
              </div>
              <div className="flex items-center space-x-4 text-base text-blue-400">
                <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse delay-300 shadow-lg shadow-blue-400/50" />
                <span className="font-semibold">Analytics & Insights</span>
              </div>
              <div className="flex items-center space-x-4 text-base text-green-400">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse delay-700 shadow-lg shadow-green-400/50" />
                <span className="font-semibold">Viral Optimization</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tools Grid */}
      <div className="px-8 mb-24">
        <div className="max-w-8xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              AI-Powered Creation Suite
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Unleash the power of artificial intelligence to elevate your YouTube content strategy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
            {aiTools.map(tool => (
              <AIToolCard 
                key={tool.id} 
                title={tool.title} 
                description={tool.description} 
                icon={tool.icon} 
                gradient={tool.gradient} 
                onClick={() => setActiveView(tool.id)} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features Showcase */}
      <div className="px-6 hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/20">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Smart Creation</h3>
              <p className="text-gray-300 leading-relaxed">
                Generate viral content with AI that understands YouTube trends and audience preferences.
              </p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Deep Analytics</h3>
              <p className="text-gray-300 leading-relaxed">
                Uncover viral patterns and optimize your content strategy with machine learning insights.
              </p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Growth Focused</h3>
              <p className="text-gray-300 leading-relaxed">
                Stay ahead of trends with predictive analytics and audience-targeted optimization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;

  return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      <AppSidebar activeView={activeView} onViewChange={setActiveView} isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="min-h-screen">
          {renderActiveView()}
        </div>
      </div>
    </div>;
};

export default Index;
