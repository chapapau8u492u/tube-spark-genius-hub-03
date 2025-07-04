import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Youtube, 
  TrendingUp, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Users, 
  Calendar,
  BarChart3,
  Clock,
  Target,
  Zap,
  Award,
  PlayCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface YouTubeStats {
  channelTitle: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  customUrl?: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  recentVideos?: Array<{
    title: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    publishedAt: string;
    thumbnail: string;
  }>;
}

const ProfileHub: React.FC = () => {
  const { user } = useUser();
  const [youtubeStats, setYoutubeStats] = useState<YouTubeStats | null>(null);
  const [channelId, setChannelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = 'AIzaSyBHa2NR6HA3TuIVX-9k8c1Xzo6PNRsa4ds';

  const fetchYouTubeStats = async () => {
    if (!channelId) {
      setError('Please provide your Channel ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Fetch channel statistics
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${API_KEY}`
      );

      if (!channelResponse.ok) {
        throw new Error(`YouTube API error: ${channelResponse.status}`);
      }

      const channelData = await channelResponse.json();
      
      if (!channelData.items || channelData.items.length === 0) {
        throw new Error('Channel not found');
      }

      const channel = channelData.items[0];
      
      // Fetch recent videos
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=5&order=date&type=video&key=${API_KEY}`
      );

      let recentVideos = [];
      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        const videoIds = videosData.items?.map((item: any) => item.id.videoId).join(',');
        
        if (videoIds) {
          const videoStatsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${API_KEY}`
          );
          
          if (videoStatsResponse.ok) {
            const videoStatsData = await videoStatsResponse.json();
            recentVideos = videosData.items.map((video: any, index: number) => ({
              title: video.snippet.title,
              viewCount: parseInt(videoStatsData.items[index]?.statistics?.viewCount || '0'),
              likeCount: parseInt(videoStatsData.items[index]?.statistics?.likeCount || '0'),
              commentCount: parseInt(videoStatsData.items[index]?.statistics?.commentCount || '0'),
              publishedAt: video.snippet.publishedAt,
              thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url
            }));
          }
        }
      }

      const stats: YouTubeStats = {
        channelTitle: channel.snippet.title,
        subscriberCount: parseInt(channel.statistics.subscriberCount),
        videoCount: parseInt(channel.statistics.videoCount),
        viewCount: parseInt(channel.statistics.viewCount),
        customUrl: channel.snippet.customUrl,
        description: channel.snippet.description,
        publishedAt: channel.snippet.publishedAt,
        thumbnails: channel.snippet.thumbnails,
        recentVideos
      };

      setYoutubeStats(stats);
      localStorage.setItem('youtube_stats', JSON.stringify(stats));
      localStorage.setItem('youtube_channel_id', channelId);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch YouTube data');
      console.error('YouTube API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedStats = localStorage.getItem('youtube_stats');
    const savedChannelId = localStorage.getItem('youtube_channel_id');
    
    if (savedStats) {
      setYoutubeStats(JSON.parse(savedStats));
    }
    if (savedChannelId) {
      setChannelId(savedChannelId);
    }
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!youtubeStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-4">Profile Hub</h1>
            <p className="text-gray-400 text-lg">Connect your YouTube channel to view analytics</p>
          </div>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Youtube className="w-6 h-6 text-red-500" />
                Connect YouTube Channel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="channelId" className="text-gray-300">Channel ID</Label>
                <Input
                  id="channelId"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  placeholder="Enter your YouTube Channel ID"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button 
                onClick={fetchYouTubeStats}
                disabled={loading || !channelId}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Connecting...' : 'Connect Channel'}
              </Button>

              <div className="text-sm text-gray-400 space-y-2">
                <p><strong>How to find your Channel ID:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Go to your YouTube channel</li>
                  <li>Click on "Settings" or "Customize channel"</li>
                  <li>Go to "Advanced settings"</li>
                  <li>Copy your Channel ID</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-2">Profile Hub</h1>
            <p className="text-gray-400">Your YouTube channel analytics dashboard</p>
          </div>
          <Button 
            onClick={fetchYouTubeStats}
            disabled={loading}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>

        {/* Channel Overview */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <img 
                src={youtubeStats.thumbnails.high?.url || youtubeStats.thumbnails.medium?.url} 
                alt="Channel Avatar"
                className="w-24 h-24 rounded-full border-4 border-red-500"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{youtubeStats.channelTitle}</h2>
                {youtubeStats.customUrl && (
                  <p className="text-red-400 mb-2">@{youtubeStats.customUrl}</p>
                )}
                <p className="text-gray-300 mb-4 line-clamp-2">{youtubeStats.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {formatDate(youtubeStats.publishedAt)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-200 text-sm font-medium">Subscribers</p>
                  <p className="text-3xl font-bold text-white">{formatNumber(youtubeStats.subscriberCount)}</p>
                </div>
                <Users className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">Total Views</p>
                  <p className="text-3xl font-bold text-white">{formatNumber(youtubeStats.viewCount)}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm font-medium">Videos</p>
                  <p className="text-3xl font-bold text-white">{formatNumber(youtubeStats.videoCount)}</p>
                </div>
                <PlayCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Avg Views/Video</p>
                  <p className="text-3xl font-bold text-white">
                    {formatNumber(Math.round(youtubeStats.viewCount / youtubeStats.videoCount))}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Videos */}
        {youtubeStats.recentVideos && youtubeStats.recentVideos.length > 0 && (
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {youtubeStats.recentVideos.map((video, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="text-white font-medium text-sm mb-2 line-clamp-2">{video.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatNumber(video.viewCount)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {formatNumber(video.likeCount)}
                        </span>
                      </div>
                      <span>{formatDate(video.publishedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Optimize Content</h3>
              <p className="text-gray-400 text-sm">Use AI tools to improve your video performance</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Generate Ideas</h3>
              <p className="text-gray-400 text-sm">Get AI-powered content suggestions</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Track Growth</h3>
              <p className="text-gray-400 text-sm">Monitor your channel's progress over time</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileHub;
