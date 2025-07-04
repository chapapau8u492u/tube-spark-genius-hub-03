
import React from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Play, Zap, Sparkles, Bot, Rocket, Star, ArrowRight, Globe, Palette, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
            TubeSpark
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
          <div className="text-center py-20 lg:py-32">
            <div className="mb-8 inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">AI-Powered YouTube Optimization</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Unleash Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Creative Power
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your YouTube journey with cutting-edge AI tools that generate viral content, 
              optimize thumbnails, and unlock hidden growth patterns.
            </p>
            
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
              
              <Button variant="ghost" size="lg" className="text-white hover:bg-white/10 text-lg px-8 py-4 rounded-full border border-white/20">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-20">
            {[
              {
                icon: Bot,
                title: "AI Content Studio",
                description: "Generate viral titles, descriptions, and tags with advanced AI algorithms",
                gradient: "from-cyan-500 to-blue-500"
              },
              {
                icon: Palette,
                title: "Smart Thumbnails",
                description: "Create eye-catching thumbnails that boost click-through rates",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: BarChart,
                title: "Performance Insights",
                description: "Detect viral patterns and optimize your content strategy",
                gradient: "from-green-500 to-teal-500"
              },
              {
                icon: Globe,
                title: "Trend Discovery",
                description: "Stay ahead with real-time trending topics and keywords",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: Zap,
                title: "Instant Analysis",
                description: "Get immediate feedback on your content performance",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: Rocket,
                title: "Growth Acceleration",
                description: "Scale your channel with data-driven optimization",
                gradient: "from-indigo-500 to-purple-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl blur-xl" 
                     style={{background: `linear-gradient(to right, var(--tw-gradient-stops))`}} />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
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
