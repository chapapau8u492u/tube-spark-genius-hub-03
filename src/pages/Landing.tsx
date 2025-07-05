
import React from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Play, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AI Creator Studio</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Dashboard</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">AI Tools</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Analytics</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Profile</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-gray-600">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6">
        <div className="text-center py-16">
          <div className="mb-6 inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-700 font-medium">Powered by Advanced AI Technology</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            <span className="text-blue-600">AI-Powered</span><br />
            <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              YouTube Studio
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
            Transform your YouTube channel with intelligent analytics, AI-generated content, and data-driven insights that accelerate your creator journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg">
                  Start Creating →
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg">
                Start Creating →
              </Button>
            </SignedIn>
            
            <Button variant="ghost" size="lg" className="text-gray-700 hover:text-gray-900 px-8 py-3">
              Watch Demo
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            <Card className="bg-white border border-gray-200 p-6">
              <CardContent className="text-center p-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">10K+</div>
                <div className="text-sm text-gray-600">Creators</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-200 p-6">
              <CardContent className="text-center p-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Play className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">2M+</div>
                <div className="text-sm text-gray-600">Videos Optimized</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-200 p-6">
              <CardContent className="text-center p-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">300%</div>
                <div className="text-sm text-gray-600">Avg Growth</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-200 p-6">
              <CardContent className="text-center p-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Everything You Need Section */}
        <div className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Everything You Need to <span className="text-blue-600">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Our comprehensive suite of AI tools and analytics helps you create better content, understand your audience, and grow your channel faster than ever before.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="bg-white border border-gray-200 p-8 text-center">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Youtube className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">YouTube Analytics</h3>
                <p className="text-gray-600 text-sm">
                  Real-time channel insights and performance metrics to optimize your content strategy.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 p-8 text-center">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">AI Content Tools</h3>
                <p className="text-gray-600 text-sm">
                  Generate titles, descriptions, and thumbnails with advanced AI technology.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 p-8 text-center">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Performance Tracking</h3>
                <p className="text-gray-600 text-sm">
                  Monitor your growth with detailed analytics and trend predictions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 p-8 text-center">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <div className="w-6 h-6 bg-yellow-600 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Smart Optimization</h3>
                <p className="text-gray-600 text-sm">
                  AI-powered recommendations to boost your channel's visibility and engagement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-16 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Channel?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of creators who are already using AI to accelerate their YouTube success.
            </p>
            
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4 rounded-lg">
                  Get Started Free →
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4 rounded-lg">
                Continue Creating →
              </Button>
            </SignedIn>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
