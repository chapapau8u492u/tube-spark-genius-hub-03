
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Search, Eye, ThumbsUp, MessageCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { youtubeService, YouTubeVideo } from '@/services/youtubeService';
import { aiServices } from '@/services/aiService';

interface EnhancedVideo extends YouTubeVideo {
  isOutlier?: boolean;
  outlierScore?: number;
  smartScore?: number;
  viewsPerDay?: number;
  engagementRate?: number;
}

const OutlierDetector: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<EnhancedVideo[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      console.log('Searching for outliers:', query);
      const videos = await youtubeService.searchVideos(query);
      
      // Calculate additional metrics
      const enhancedVideos = videos.map(video => ({
        ...video,
        viewsPerDay: calculateViewsPerDay(video.publishedAt, video.viewCount),
        engagementRate: calculateEngagementRate(video.viewCount, video.likeCount, video.commentCount)
      }));
      
      // Detect outliers using AI service
      const videosWithOutliers = aiServices.detectOutliers(enhancedVideos);
      
      setResults(videosWithOutliers);
      
      const outlierCount = videosWithOutliers.filter(v => v.isOutlier).length;
      toast.success(`Found ${videosWithOutliers.length} videos with ${outlierCount} outliers detected!`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to detect outliers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateViewsPerDay = (publishedAt: string, viewCount: number): number => {
    const publishedDate = new Date(publishedAt);
    const currentDate = new Date();
    const daysDiff = Math.max(1, Math.floor((currentDate.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)));
    return Math.round(viewCount / daysDiff);
  };

  const calculateEngagementRate = (views: number, likes: number, comments: number): number => {
    if (views === 0) return 0;
    return Number(((likes + comments) / views * 100).toFixed(2));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getOutlierBadge = (video: EnhancedVideo) => {
    if (!video.isOutlier) return null;
    
    const isPositiveOutlier = video.smartScore && video.smartScore > 1;
    return (
      <Badge 
        variant={isPositiveOutlier ? "default" : "destructive"} 
        className="text-xs"
      >
        <AlertTriangle className="w-3 h-3 mr-1" />
        {isPositiveOutlier ? 'High Performer' : 'Low Performer'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gradient">Outlier Detection</h2>
            <Badge variant="secondary" className="bg-gradient-to-r from-orange-500/20 to-red-500/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              Smart Analysis
            </Badge>
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for videos to detect outliers (e.g., 'programming tutorial', 'cooking')..."
              className="bg-background/50 border-muted"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              onClick={handleSearch} 
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Analyzing...' : 'Detect Outliers'}
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-background/30 rounded-lg border border-muted">
            <p className="text-sm text-muted-foreground">
              <Zap className="w-4 h-4 inline mr-1" />
              AI-powered outlier detection identifies videos with unusual performance patterns compared to similar content.
            </p>
          </div>
        </div>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">Analysis Results</h3>
            <Badge variant="outline">{results.length} videos analyzed</Badge>
            <Badge variant="outline">
              {results.filter(v => v.isOutlier).length} outliers found
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((video) => (
              <Card key={video.id} className={`glass-effect overflow-hidden transition-all ${
                video.isOutlier ? 'ring-2 ring-orange-500/50' : ''
              }`}>
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                    <Badge variant="secondary" className="text-xs">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </Badge>
                    {getOutlierBadge(video)}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-sm line-clamp-2 mb-2">{video.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{video.channelTitle}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {formatNumber(video.viewCount)}
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {formatNumber(video.likeCount)}
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {formatNumber(video.commentCount)}
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {video.engagementRate}%
                    </div>
                  </div>
                  
                  {video.isOutlier && (
                    <div className="mt-3 p-2 bg-orange-500/10 rounded border border-orange-500/20">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Smart Score:</span>
                        <span className="font-medium">{video.smartScore?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Views/Day:</span>
                        <span className="font-medium">{formatNumber(video.viewsPerDay || 0)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutlierDetector;
