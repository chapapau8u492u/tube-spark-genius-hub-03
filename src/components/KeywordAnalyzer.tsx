
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Search, Star } from 'lucide-react';
import { aiServices } from '@/services/aiService';
import { toast } from 'sonner';

const KeywordAnalyzer: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const keywords = await aiServices.analyzeKeywords(topic);
      setResult(keywords);
      toast.success('Keywords analyzed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze keywords. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gradient">Keyword Analyzer</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Topic or Niche</label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., AI technology, cooking recipes, fitness tips"
                className="bg-background/50 border-muted"
              />
            </div>
            
            <Button 
              onClick={handleAnalyze} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              {loading ? 'Analyzing...' : 'Analyze Keywords'}
            </Button>
          </div>
        </div>
      </Card>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Keywords */}
          <Card className="glass-effect">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2 text-blue-500" />
                SEO Keywords
              </h3>
              <div className="space-y-4">
                {result.keywords?.map((item: any, index: number) => (
                  <div key={index} className="p-4 bg-background/30 rounded-lg border border-muted">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{item.keyword}</h4>
                      <Badge variant={getScoreBadgeVariant(item.score)}>
                        <Star className="w-3 h-3 mr-1" />
                        {item.score}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.related_queries?.map((query: string, qIndex: number) => (
                        <Badge key={qIndex} variant="outline" className="text-xs">
                          {query}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Main Keyword Info */}
          <Card className="glass-effect">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Main Topic Analysis</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                  <h4 className="font-medium text-purple-400 mb-2">Primary Keyword</h4>
                  <p className="text-lg font-bold">{result.main_keyword}</p>
                </div>
                
                <div className="p-4 bg-background/30 rounded-lg border border-muted">
                  <h4 className="font-medium mb-2">Analysis Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    Found {result.keywords?.length || 0} high-potential keywords for your topic. 
                    Focus on keywords with scores above 70 for best SEO results.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default KeywordAnalyzer;
