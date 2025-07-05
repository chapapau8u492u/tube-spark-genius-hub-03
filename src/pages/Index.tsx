
import React, { useState } from 'react';
import { Sparkles, Image, Search, BarChart3, TrendingUp, Users, Eye, Clock, Play, Plus, BarChart, Target, Hash, Video, MessageSquare, Youtube } from 'lucide-react';
import AIToolCard from '@/components/AIToolCard';
import ContentGenerator from '@/components/ContentGenerator';
import ThumbnailGenerator from '@/components/ThumbnailGenerator';
import ThumbnailSearch from '@/components/ThumbnailSearch';
import OutlierDetector from '@/components/OutlierDetector';
import KeywordAnalyzer from '@/components/KeywordAnalyzer';
import ProfileHub from '@/components/ProfileHub';
import AppSidebar from '@/components/AppSidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
      return renderDashboard();
    }
    const activeTool = aiTools.find(tool => tool.id === activeView);
    if (!activeTool) return renderDashboard();
    const Component = activeTool.component;
    return <Component />;
  };

  const renderDashboard = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              Welcome back, Creator! 👋
            </h1>
            <p className="text-gray-600">Here's what's happening with your channel today</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
              🟢 Live Data
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Content
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-8 border-b border-gray-200">
          <button className="pb-4 px-1 border-b-2 border-blue-600 text-blue-600 font-medium">
            📊 Overview
          </button>
          <button className="pb-4 px-1 text-gray-500 hover:text-gray-700">
            📈 Analytics  
          </button>
          <button className="pb-4 px-1 text-gray-500 hover:text-gray-700">
            🎯 Content
          </button>
          <button className="pb-4 px-1 text-gray-500 hover:text-gray-700">
            🤖 AI Tools
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-red-700">Subscribers</h3>
              <Users className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-900 mb-1">125,432</div>
            <div className="text-sm text-red-600">+1.2k this month</div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-blue-700">Total Views</h3>
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-900 mb-1">2,847,293</div>
            <div className="text-sm text-blue-600">+8.2% this week</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-purple-700">Engagement Rate</h3>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-900 mb-1">8.2%</div>
            <div className="text-sm text-purple-600">Above average</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-green-700">Watch Time</h3>
              <Clock className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-900 mb-1">4:32</div>
            <div className="text-sm text-green-600">+2.3% engagement</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Channel Performance */}
        <Card className="lg:col-span-2 bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  🎥 AI Creator Channel
                  <span className="ml-2 px-2 py-1 text-xs bg-red-200 text-red-800 rounded-full">Live</span>
                </h3>
                <p className="text-sm text-gray-600">Real-time YouTube channel performance</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">125,432</div>
                <div className="text-sm text-gray-600">Subscribers</div>
                <div className="text-xs text-green-600">+1.4k this month</div>
              </div>
              <div className="text-center">
                <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">2,847,293</div>
                <div className="text-sm text-gray-600">Total Views</div>
                <div className="text-xs text-green-600">+85.2k last 30 days</div>
              </div>
              <div className="text-center">
                <Video className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">156</div>
                <div className="text-sm text-gray-600">Videos</div>
                <div className="text-xs text-gray-500">Total uploads</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Monthly Growth Progress</span>
                <span className="text-sm text-green-600">+23.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Growing faster than 60% of similar channels</p>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Top Performing Video</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">10 AI Tools Every Creator Needs</p>
              <div className="text-xs text-gray-500">48,392 views • 2,847 likes</div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                Refresh Data
              </Button>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                View on YouTube
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Goals */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                ⚡ Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="h-16 flex-col">
                  <Video className="w-5 h-5 mb-1 text-blue-600" />
                  <span className="text-xs">Create Video</span>
                  <span className="text-xs text-gray-500">Start a new video project</span>
                </Button>
                <Button variant="outline" size="sm" className="h-16 flex-col" onClick={() => setActiveView('content-generator')}>
                  <Sparkles className="w-5 h-5 mb-1 text-purple-600" />
                  <span className="text-xs">AI Title Generator</span>
                  <span className="text-xs text-gray-500">Generate viral titles</span>
                </Button>
                <Button variant="outline" size="sm" className="h-16 flex-col" onClick={() => setActiveView('thumbnail-generator')}>
                  <Image className="w-5 h-5 mb-1 text-red-600" />
                  <span className="text-xs">Upload Content</span>
                  <span className="text-xs text-gray-500">Upload to YouTube</span>
                </Button>
                <Button variant="outline" size="sm" className="h-16 flex-col">
                  <BarChart className="w-5 h-5 mb-1 text-green-600" />
                  <span className="text-xs">View Analytics</span>
                  <span className="text-xs text-gray-500">Check performance</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Goals & Progress */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                🎯 Goals & Progress
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Monthly Subscriber Goal</span>
                    <span className="text-sm text-blue-600">83%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '83%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">125,432 / 150,000</div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Video Upload Goal</span>
                    <span className="text-sm text-green-600">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">12 / 16</div>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full mt-4 text-gray-600">
                Manage Goals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI-Powered Tools Section */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <span className="px-3 py-1 bg-purple-200 text-purple-800 text-sm font-medium rounded-full">
                  ✨ Featured
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">AI Content Suite</h2>
              <p className="text-gray-600 mb-6 max-w-lg">
                Complete AI-powered workflow for creating viral YouTube content from idea to upload.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-white text-purple-700 text-sm rounded-full border border-purple-200">Title Generation</span>
                <span className="px-3 py-1 bg-white text-purple-700 text-sm rounded-full border border-purple-200">Script Writing</span>
                <span className="px-3 py-1 bg-white text-purple-700 text-sm rounded-full border border-purple-200">Thumbnail Design</span>
                <span className="px-3 py-1 bg-white text-purple-700 text-sm rounded-full border border-purple-200">SEO Optimization</span>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setActiveView('content-generator')}>
                Try AI Suite →
              </Button>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-8 text-white text-center ml-8">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="font-bold text-lg">All-in-One</div>
              <div className="text-sm">Complete AI Toolbox</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI-Powered Tools Grid */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">AI-Powered Tools</h2>
          <span className="text-sm text-blue-600 font-medium">8 Tools Available</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* AI Title Generator */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setActiveView('content-generator')}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Popular</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">AI Title Generator</h3>
              <p className="text-sm text-gray-600 mb-4">Generate compelling, SEO-optimized titles that drive clicks and engagement.</p>
              <Button variant="outline" size="sm" className="w-full group-hover:bg-purple-50 group-hover:border-purple-200">
                Try Now →
              </Button>
            </CardContent>
          </Card>

          {/* Smart Description Writer */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">New</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Smart Description Writer</h3>
              <p className="text-sm text-gray-600 mb-4">Create detailed, keyword-rich descriptions that improve discoverability.</p>
              <Button variant="outline" size="sm" className="w-full group-hover:bg-blue-50 group-hover:border-blue-200">
                Try Now →
              </Button>
            </CardContent>
          </Card>

          {/* Thumbnail Designer */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setActiveView('thumbnail-generator')}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Image className="w-5 h-5 text-green-600" />
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Pro</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Thumbnail Designer</h3>
              <p className="text-sm text-gray-600 mb-4">Design eye-catching thumbnails with AI-powered layout and color suggestions.</p>
              <Button variant="outline" size="sm" className="w-full group-hover:bg-green-50 group-hover:border-green-200">
                Try Now →
              </Button>
            </CardContent>
          </Card>

          {/* Hashtag Optimizer */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setActiveView('keyword-analyzer')}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Hash className="w-5 h-5 text-orange-600" />
                </div>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">Hot</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Hashtag Optimizer</h3>
              <p className="text-sm text-gray-600 mb-4">Find the perfect hashtags to maximize your video's reach and engagement.</p>
              <Button variant="outline" size="sm" className="w-full group-hover:bg-orange-50 group-hover:border-orange-200">
                Try Now →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Stats */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            🤖 AI Tools Usage This Month
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">247</div>
              <div className="text-sm text-gray-600">Titles Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">89</div>
              <div className="text-sm text-gray-600">Scripts Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">156</div>
              <div className="text-sm text-gray-600">Thumbnails Designed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">2,847</div>
              <div className="text-sm text-gray-600">AI Suggestions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AppSidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="min-h-screen">
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
};

export default Index;
