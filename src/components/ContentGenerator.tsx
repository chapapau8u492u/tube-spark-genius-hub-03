
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Copy, Star, FileText, Hash, Image } from 'lucide-react';
import { toast } from 'sonner';

interface ContentResult {
  titles: Array<{
    title: string;
    seo_score: number;
  }>;
  description: string;
  tags: string[];
  image_prompts: Array<{
    heading: string;
    prompt: string;
  }>;
}

const ContentGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentResult | null>(null);

  const generateContent = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic or keywords');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBdmJafDA7pVwj7cshLLi1PMfzsuxxkoy8`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert YouTube SEO strategist and AI creative assistant. Based on the user input "${topic}", generate a JSON response only (no explanation, no markdown, no commentary), containing:
1. Three YouTube video titles optimized for SEO.
2. SEO Score for each title (1 to 100).
3. A compelling YouTube video description based on the topic.
4. 10 relevant YouTube video tags.
5. Two YouTube thumbnail image prompts, each including:
   • Professional illustration style based on the video title
   • A short 3-5 word heading that will appear on the thumbnail image
   • Visually compelling layout concept to grab attention

Return format (JSON only):
{
  "titles": [
    {"title": "Title 1", "seo_score": 87},
    {"title": "Title 2", "seo_score": 82},
    {"title": "Title 3", "seo_score": 78}
  ],
  "description": "Professional and engaging YouTube video description here based on the input.",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"],
  "image_prompts": [
    {
      "heading": "Heading Text 1",
      "prompt": "Professional illustration for thumbnail image based on Title 1. Include elements such as..."
    },
    {
      "heading": "Heading Text 2", 
      "prompt": "Professional illustration for thumbnail image based on Title 2. Include elements such as..."
    }
  ]
}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
        const content = data.candidates[0].content.parts[0].text;
        console.log('Gemini Response:', content);
        
        // Try to parse JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedResult = JSON.parse(jsonMatch[0]);
          setResult(parsedResult);
          toast.success('Content generated successfully!');
        } else {
          throw new Error('Invalid JSON response from Gemini');
        }
      } else {
        throw new Error('Invalid response from Gemini API');
      }
    } catch (error) {
      console.error('Content Generation Error:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="glass-effect">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gradient">AI Content Generator</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Enter your video topic, keywords, or idea
              </label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How to learn React in 2024, AI tutorial, cooking tips..."
                className="bg-background/50 border-muted"
                disabled={loading}
              />
            </div>
            
            <Button 
              onClick={generateContent} 
              disabled={loading || !topic.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Content...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Content</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-6">
          <Card className="glass-effect">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-yellow-500" />
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-background/30 rounded-lg border border-muted">
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="glass-effect">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-blue-500" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          </Card>

          <Card className="glass-effect">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Hash className="w-5 h-5 text-green-500" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <Skeleton key={i} className="h-6 w-16" />
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Results Section */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Titles Section */}
          <Card className="glass-effect">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-yellow-500" />
                <h3 className="text-xl font-bold">SEO Optimized Titles</h3>
              </div>
              <div className="space-y-3">
                {result.titles?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-muted hover:bg-background/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-2">{item.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">SEO Score:</span>
                        <Badge className={`${getScoreColor(item.seo_score)} text-white`}>
                          {item.seo_score}/100
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(item.title)}
                      className="ml-4"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Description Section */}
          <Card className="glass-effect">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <h3 className="text-xl font-bold">Video Description</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(result.description)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                value={result.description}
                readOnly
                className="min-h-32 bg-background/30 border-muted resize-none"
              />
            </div>
          </Card>

          {/* Tags Section */}
          <Card className="glass-effect">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Hash className="w-5 h-5 text-green-500" />
                <h3 className="text-xl font-bold">Video Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.tags?.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => copyToClipboard(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Thumbnail Prompts Section */}
          <Card className="glass-effect">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Image className="w-5 h-5 text-purple-500" />
                <h3 className="text-xl font-bold">Thumbnail Ideas</h3>
              </div>
              <div className="space-y-4">
                {result.image_prompts?.map((prompt, index) => (
                  <div key={index} className="p-4 bg-background/30 rounded-lg border border-muted">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-primary">{prompt.heading}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(prompt.prompt)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {prompt.prompt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;
