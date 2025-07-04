
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, ThumbsUp, MessageCircle, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { youtubeService, YouTubeVideo } from '@/services/youtubeService';
import { aiServices } from '@/services/aiService';
import ApiKeyManager from './ApiKeyManager';

const ThumbnailSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<YouTubeVideo[]>([]);
  const [similarSearchLoading, setSimilarSearchLoading] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      console.log('Searching for:', query);
      const videos = await youtubeService.searchVideos(query, apiKey);
      console.log('Search results:', videos);
      
      setResults(videos);
      if (apiKey) {
        toast.success(`Found ${videos.length} real YouTube videos!`);
      } else {
        toast.info(`Found ${videos.length} videos using mock data. Add your API key to get real results!`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search thumbnails. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimilarSearch = async (video: YouTubeVideo) => {
    setSimilarSearchLoading(video.id);
    try {
      toast.info('Analyzing thumbnail with Gemini AI...');
      const tags = await aiServices.analyzeThumbnail(video);
      console.log('Generated tags:', tags);
      
      toast.info(`Searching for similar content using: ${tags.join(', ')}`);
      const similarQuery = tags.join(' ');
      const similarVideos = await youtubeService.searchVideos(similarQuery, apiKey);
      
      setResults(similarVideos);
      setQuery(similarQuery);
      if (apiKey) {
        toast.success(`Found ${similarVideos.length} similar real videos!`);
      } else {
        toast.success(`Found ${similarVideos.length} similar mock videos!`);
      }
    } catch (error) {
      console.error('Similar search error:', error);
      toast.error('Failed to find similar thumbnails');
    } finally {
      setSimilarSearchLoading(null);
    }
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
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gradient">
              {apiKey ? 'Real YouTube Search' : 'Mock YouTube Search'}
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
          
          <div className="flex space-x-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for thumbnails (e.g., 'mr beast', 'react tutorial', 'gaming')..."
              className="bg-background/50 border-muted"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              onClick={handleSearch} 
              disabled={loading}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Searching...' : (apiKey ? 'Real Search' : 'Mock Search')}
            </Button>
          </div>
          
          {query && !loading && (
            <div className="mt-4 p-3 bg-background/30 rounded-lg border border-muted">
              <p className="text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 inline mr-1" />
                {apiKey 
                  ? 'Fetching real YouTube data using your API key...'
                  : 'Using mock data. Add your YouTube API key above to get real results...'
                }
              </p>
            </div>
          )}
        </div>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">Search Results</h3>
            <Badge variant="outline">{results.length} videos found</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((video) => (
              <Card key={video.id} className="glass-effect overflow-hidden hover:scale-105 transition-transform group">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSimilarSearch(video)}
                      disabled={similarSearchLoading === video.id}
                      className="bg-black/50 text-white border-none hover:bg-black/70"
                    >
                      {similarSearchLoading === video.id ? (
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Zap className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-sm line-clamp-2 mb-2">{video.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{video.channelTitle}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
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
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {video.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 text-xs"
                    onClick={() => handleSimilarSearch(video)}
                    disabled={similarSearchLoading === video.id}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Find Similar with Gemini AI
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThumbnailSearch;
