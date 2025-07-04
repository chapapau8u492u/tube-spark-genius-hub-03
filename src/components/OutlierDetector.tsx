import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, AlertTriangle, Sparkles, Eye, ThumbsUp, MessageCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { youtubeService, YouTubeVideo } from '@/services/youtubeService';
import ApiKeyManager from './ApiKeyManager';

interface OutlierVideo extends YouTubeVideo {
  viewsPerDay: number;
  engagementRate: number;
  smartScore: number;
  isOutlier: boolean;
  outlierScore: number;
  daysSincePublished: number;
}

const OutlierDetector: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OutlierVideo[]>([]);
  const [apiKey, setApiKey] = useState('');

  const calculateIQR = (values: number[]) => {
    const sorted = values.slice().sort((a, b) => a - b);
    const q1Index = Math.floor(sorted.length * 0.25);
    const q3Index = Math.floor(sorted.length * 0.75);
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    return { q1, q3, iqr, lowerBound, upperBound };
  };

  const processVideosForOutliers = (videos: YouTubeVideo[]): OutlierVideo[] => {
    console.log('Processing videos for outlier detection:', videos.length);
    
    // Convert and calculate metrics for each video
    const processedVideos: OutlierVideo[] = videos.map(video => {
      const viewCount = parseInt(video.viewCount?.toString() || '0');
      const likeCount = parseInt(video.likeCount?.toString() || '0');
      const commentCount = parseInt(video.commentCount?.toString() || '0');
      
      const today = new Date();
      const publishDate = new Date(video.publishedAt);
      const daysSincePublished = Math.max(1, Math.floor((today.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24)));
      const viewsPerDay = Math.floor(viewCount / daysSincePublished);
      const engagementRate = viewCount > 0 ? ((likeCount + commentCount) / viewCount * 100) : 0;
      
      return {
        ...video,
        viewCount,
        likeCount,
        commentCount,
        daysSincePublished,
        viewsPerDay,
        engagementRate: parseFloat(engagementRate.toFixed(2)),
        smartScore: 0,
        isOutlier: false,
        outlierScore: 0
      };
    });

    // Calculate IQR for views
    const viewCounts = processedVideos.map(v => v.viewCount);
    const viewsIQR = calculateIQR(viewCounts);
    
    // Calculate statistics for smart score normalization
    const avgViews = viewCounts.reduce((a, b) => a + b, 0) / viewCounts.length;
    const maxViewsPerDay = Math.max(...processedVideos.map(v => v.viewsPerDay));
    const maxEngagementRate = Math.max(...processedVideos.map(v => v.engagementRate));
    
    console.log('Outlier analysis stats:', {
      avgViews,
      maxViewsPerDay,
      maxEngagementRate,
      viewsIQR
    });

    // Calculate final metrics for each video
    return processedVideos.map(video => {
      // Check if outlier using IQR method
      const isOutlierByViews = video.viewCount > viewsIQR.upperBound;
      
      // Calculate outlier score (distance from upper bound)
      const outlierScore = isOutlierByViews && viewsIQR.iqr > 0 
        ? parseFloat(((video.viewCount - viewsIQR.upperBound) / viewsIQR.iqr).toFixed(2))
        : 0;
      
      // Calculate smart score (weighted combination)
      const viewScore = avgViews > 0 ? (video.viewCount / avgViews) : 1;
      const velocityScore = maxViewsPerDay > 0 ? (video.viewsPerDay / maxViewsPerDay) : 0;
      const engagementScore = maxEngagementRate > 0 ? (video.engagementRate / maxEngagementRate) : 0;
      
      const smartScore = parseFloat((
        viewScore * 0.5 +
        velocityScore * 0.3 +
        engagementScore * 0.2
      ).toFixed(2));

      return {
        ...video,
        smartScore,
        isOutlier: isOutlierByViews,
        outlierScore: Math.max(0, outlierScore)
      };
    }).sort((a, b) => b.smartScore - a.smartScore); // Sort by smart score descending
  };

  const handleDetect = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching YouTube data for outlier detection:', query);
      const videos = await youtubeService.searchVideos(query, apiKey);
      
      if (videos.length === 0) {
        toast.error('No videos found for the given query');
        setResult([]);
        return;
      }

      console.log('Fetched videos:', videos.length);
      const analyzedVideos = processVideosForOutliers(videos);
      setResult(analyzedVideos);
      
      const outlierCount = analyzedVideos.filter(v => v.isOutlier).length;
      
      if (apiKey) {
        toast.success(`Analyzed ${videos.length} real YouTube videos! Found ${outlierCount} outliers.`);
      } else {
        toast.success(`Analyzed ${videos.length} mock videos! Found ${outlierCount} outliers.`);
      }
    } catch (error) {
      console.error('Outlier detection error:', error);
      toast.error('Failed to analyze outliers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getOutlierBadgeColor = (isOutlier: boolean, score: number) => {
    if (!isOutlier) return 'bg-gray-500/90';
    if (score > 2) return 'bg-red-500/90';
    if (score > 1) return 'bg-orange-500/90';
    return 'bg-yellow-500/90';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-6">
      <ApiKeyManager onApiKeyChange={setApiKey} />
      
      <Card className="glass-effect">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gradient">
              High-Performance Video Finder
            </h2>
            <Badge variant="secondary" className={`${
              apiKey 
                ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20' 
                : 'bg-gradient-to-r from-orange-500/20 to-red-500/20'
            }`}>
              <Sparkles className="w-3 h-3 mr-1" />
              {apiKey ? 'Real Data' : 'Mock Data'}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Find viral videos in your niche
              </label>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Enter your niche (e.g., "programming tutorial", "fitness tips", "cooking recipes")'
                className="bg-background/50 border-muted"
                onKeyPress={(e) => e.key === 'Enter' && handleDetect()}
              />
            </div>
            
            <Button 
              onClick={handleDetect} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {loading ? 'Analyzing Performance...' : 'Find High-Performing Videos'}
            </Button>
          </div>
        </div>
      </Card>

      {result.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
              Performance Analysis Results
            </h3>
            <div className="flex space-x-2">
              <Badge variant="outline">
                {result.length} videos
              </Badge>
              <Badge variant="destructive">
                {result.filter(v => v.isOutlier).length} high performers
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {result.map((video, index) => (
              <Card key={video.id} className="glass-effect overflow-hidden hover:scale-105 transition-all duration-300 group relative">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  
                  {/* Outlier Score Badge - Top Right */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-white text-xs font-bold ${getOutlierBadgeColor(video.isOutlier, video.outlierScore)}`}>
                    {video.smartScore}x
                  </div>
                  
                  {/* High Performer Badge - Top Left */}
                  {video.isOutlier && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-green-500/90 text-white text-xs">
                        🔥 Viral
                      </Badge>
                    </div>
                  )}
                  
                  {/* Rank Badge - Bottom Left */}
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="text-xs bg-black/50 text-white border-none">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <h4 className="font-medium text-sm line-clamp-2 leading-tight">{video.title}</h4>
                  <p className="text-xs text-muted-foreground">{video.channelTitle}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center text-muted-foreground">
                      <Eye className="w-3 h-3 mr-1" />
                      {formatNumber(video.viewCount)}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {formatNumber(video.likeCount)}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {formatNumber(video.viewsPerDay)}/day
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      {video.daysSincePublished}d ago
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Engagement Rate</span>
                      <span className="text-xs font-medium">{video.engagementRate}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Performance Score</span>
                      <span className={`text-xs font-bold ${
                        video.smartScore > 1.5 ? 'text-green-500' : 
                        video.smartScore > 1.0 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {video.smartScore}x
                      </span>
                    </div>
                  </div>
                  
                  {video.isOutlier && (
                    <div className="mt-3 p-2 bg-green-500/10 rounded border border-green-500/20">
                      <div className="flex items-center justify-center text-center">
                        <div>
                          <p className="text-xs text-green-400 font-medium">
                            🚀 High Performer!
                          </p>
                          <p className="text-xs text-green-300 mt-1">
                            Outlier Score: {video.outlierScore}
                          </p>
                        </div>
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
