
import React from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Play, Zap, Sparkles, Bot, Rocket, Star, ArrowRight, Globe, Palette, BarChart, TrendingUp, Eye, Target, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl animate-bounce" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 lg:p-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            YouTube AI Studio
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                Get Started
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </SignedIn>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16 lg:py-24">
            <div className="mb-8 inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">AI-Powered YouTube Optimization</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                YouTube AI Studio
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your YouTube channel with intelligent AI tools that understand, analyze, and optimize your 
              content for maximum impact.
            </p>

            {/* Feature Tags */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-full border border-red-500/30">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                Content Generation
              </div>
              <div className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Analytics & Insights
              </div>
              <div className="flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Viral Optimization
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-lg px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
                    Start Creating <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-lg px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Open Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </SignedIn>
              
              <Button variant="ghost" size="lg" className="text-white hover:bg-white/10 text-lg px-8 py-4 rounded-full border border-white/20 " onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")}>
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* AI Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-16">
            {[
              {
                icon: Bot,
                title: "AI Content Generator",
                description: "Generate optimized YouTube titles, descriptions, tags, and thumbnail prompts using advanced AI.",
                gradient: "from-pink-500 via-purple-500 to-pink-600",
                iconBg: "bg-gradient-to-r from-pink-500 to-purple-500"
              },
              {
                icon: Palette,
                title: "Thumbnail Generator",
                description: "Create stunning, professional YouTube thumbnails with AI-powered design assistance.",
                gradient: "from-green-500 via-teal-500 to-green-600",
                iconBg: "bg-gradient-to-r from-green-500 to-teal-500"
              },
              {
                icon: Search,
                title: "Thumbnail Search",
                description: "Discover trending thumbnails and analyze competitor strategies with AI insights.",
                gradient: "from-purple-500 via-blue-500 to-purple-600",
                iconBg: "bg-gradient-to-r from-purple-500 to-blue-500"
              },
              {
                icon: BarChart,
                title: "Outlier Detection",
                description: "Identify viral videos and content anomalies using statistical analysis and machine learning insights.",
                gradient: "from-orange-500 via-red-500 to-orange-600",
                iconBg: "bg-gradient-to-r from-orange-500 to-red-500"
              },
              {
                icon: TrendingUp,
                title: "Keyword Analyzer",
                description: "Extract trending keywords with SEO scores and related search phrases for maximum reach.",
                gradient: "from-blue-500 via-cyan-500 to-blue-600",
                iconBg: "bg-gradient-to-r from-blue-500 to-cyan-500"
              }
            ].map((tool, index) => (
              <Card key={index} className="group relative bg-gray-900/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                <div className={`absolute inset-0 bg-gradient-to-r ${tool.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg`} />
                <CardContent className="relative p-8">
                  <div className={`w-16 h-16 ${tool.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <tool.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{tool.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center py-20">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 lg:p-16">
              <div className="flex justify-center mb-8">
                <div className="flex -space-x-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to Go Viral?
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of creators who've transformed their YouTube channels with our AI-powered tools.
              </p>
              
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-lg px-12 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
                    Start Your Journey <Rocket className="ml-2 w-5 h-5" />
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-lg px-12 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Continue Creating <Rocket className="ml-2 w-5 h-5" />
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
