import { aiServices } from './aiService';

export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  description: string;
  tags: string[];
}

const GEMINI_API_KEY = 'AIzaSyBdmJafDA7pVwj7cshLLi1PMfzsuxxkoy8';

const generateGeminiTags = async (video: YouTubeVideo): Promise<string[]> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze this YouTube video and generate relevant search tags:
Title: "${video.title}"
Channel: "${video.channelTitle}"
Existing tags: ${video.tags.join(', ')}

Generate 5-8 relevant search tags that would help find similar videos or thumbnails. Focus on the main topic, style, and content type.

Return only a JSON array of strings:
["tag1", "tag2", "tag3", "tag4", "tag5"]`
          }]
        }],
        generationConfig: {
          temperature: 0.5,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      const content = data.candidates[0].content.parts[0].text;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
    
    // Fallback tags if parsing fails
    return [video.title.split(' ').slice(0, 3).join(' '), 'tutorial', 'guide', 'tips'];
  } catch (error) {
    console.error('Gemini thumbnail analysis error:', error);
    // Return fallback tags
    return [video.title.split(' ').slice(0, 3).join(' '), 'tutorial', 'guide', 'tips'];
  }
};

export const youtubeService = {
  // Search videos using YouTube Data API
  searchVideos: async (query: string, apiKey?: string): Promise<YouTubeVideo[]> => {
    try {
      console.log('Starting YouTube search for:', query);
      
      // If API key is provided, use real YouTube API
      if (apiKey && apiKey.trim()) {
        console.log('Using YouTube Data API');
        const realResults = await fetchRealYouTubeData(query, apiKey);
        if (realResults && realResults.length > 0) {
          console.log('Real YouTube API successful, returning results');
          return realResults;
        }
      }
      
      console.log('Using fallback mock data');
      return generateFallbackVideos(query);
    } catch (error) {
      console.error('YouTube Search Error:', error);
      return generateFallbackVideos(query);
    }
  },

  // Analyze thumbnail for similar content search
  analyzeThumbnail: async (video: YouTubeVideo): Promise<string[]> => {
    console.log('Analyzing thumbnail with Gemini AI for video:', video.title);
    return await generateGeminiTags(video);
  }
};

// Fetch real YouTube data using YouTube Data API
async function fetchRealYouTubeData(query: string, apiKey: string): Promise<YouTubeVideo[]> {
  try {
    // Search for videos
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=12&type=video&key=${apiKey}`
    );

    if (!searchResponse.ok) {
      console.error('YouTube API search failed:', searchResponse.status);
      return [];
    }

    const searchData = await searchResponse.json();
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    // Get detailed video statistics
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`
    );

    if (!statsResponse.ok) {
      console.error('YouTube API stats failed:', statsResponse.status);
      return [];
    }

    const statsData = await statsResponse.json();

    // Combine search results with statistics
    const videos: YouTubeVideo[] = statsData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      viewCount: parseInt(item.statistics.viewCount || '0'),
      likeCount: parseInt(item.statistics.likeCount || '0'),
      commentCount: parseInt(item.statistics.commentCount || '0'),
      publishedAt: item.snippet.publishedAt.split('T')[0],
      description: item.snippet.description || '',
      tags: item.snippet.tags || [query.toLowerCase()]
    }));

    console.log('Fetched real YouTube data:', videos.length, 'videos');
    return videos;
  } catch (error) {
    console.error('Error fetching real YouTube data:', error);
    return [];
  }
}

// Generate similar search tags
function generateSimilarTags(video: YouTubeVideo): string[] {
  const baseTags = video.tags;
  const similarTags = [];
  
  // Add variations and related terms
  baseTags.forEach(tag => {
    similarTags.push(tag);
    if (tag === 'mrbeast') similarTags.push('challenge', 'giveaway', 'viral');
    if (tag === 'tutorial') similarTags.push('guide', 'how-to', 'learn');
    if (tag === 'gaming') similarTags.push('gameplay', 'review', 'tips');
  });
  
  return similarTags.slice(0, 5);
}

// Enhanced fallback function with more videos and better thumbnails
function generateFallbackVideos(query: string): YouTubeVideo[] {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('mr beast') || queryLower.includes('mrbeast')) {
    return [
      {
        id: 'mb1',
        title: 'I Gave $1,000,000 To Random People',
        channelTitle: 'MrBeast',
        thumbnail: 'https://via.placeholder.com/320x180/ff6b6b/ffffff?text=1M+GIVEAWAY',
        viewCount: 45000000,
        likeCount: 2200000,
        commentCount: 89000,
        publishedAt: '2024-01-15',
        description: 'Giving away $1,000,000 to random people!',
        tags: ['mrbeast', 'giveaway', 'money', 'challenge', 'viral']
      },
      {
        id: 'mb2',
        title: 'Last To Leave Circle Wins $500,000',
        channelTitle: 'MrBeast',
        thumbnail: 'https://via.placeholder.com/320x180/4ecdc4/ffffff?text=LAST+TO+LEAVE',
        viewCount: 67000000,
        likeCount: 3100000,
        commentCount: 124000,
        publishedAt: '2024-01-10',
        description: 'Epic endurance challenge with huge prize!',
        tags: ['mrbeast', 'challenge', 'endurance', 'prize', 'competition']
      },
      {
        id: 'mb3',
        title: 'I Built 100 Houses And Gave Them Away',
        channelTitle: 'MrBeast',
        thumbnail: 'https://via.placeholder.com/320x180/45b7d1/ffffff?text=100+HOUSES',
        viewCount: 89000000,
        likeCount: 4200000,
        commentCount: 156000,
        publishedAt: '2024-01-05',
        description: 'Building and giving away 100 houses to families in need!',
        tags: ['mrbeast', 'philanthropy', 'houses', 'charity', 'helping']
      },
      {
        id: 'mb4',
        title: 'Spending 24 Hours In A City With No Laws',
        channelTitle: 'MrBeast',
        thumbnail: 'https://via.placeholder.com/320x180/e74c3c/ffffff?text=NO+LAWS',
        viewCount: 78000000,
        likeCount: 3800000,
        commentCount: 142000,
        publishedAt: '2024-01-20',
        description: 'What happens when there are no rules for 24 hours?',
        tags: ['mrbeast', 'experiment', 'crazy', 'adventure', 'viral']
      },
      {
        id: 'mb5',
        title: 'I Opened A Free Car Dealership',
        channelTitle: 'MrBeast',
        thumbnail: 'https://via.placeholder.com/320x180/9b59b6/ffffff?text=FREE+CARS',
        viewCount: 52000000,
        likeCount: 2800000,
        commentCount: 98000,
        publishedAt: '2024-01-12',
        description: 'Giving away cars for free to anyone who wants one!',
        tags: ['mrbeast', 'cars', 'free', 'giveaway', 'generous']
      },
      {
        id: 'mb6',
        title: '$1 vs $100,000 Vacation',
        channelTitle: 'MrBeast',
        thumbnail: 'https://via.placeholder.com/320x180/f39c12/ffffff?text=VACATION',
        viewCount: 63000000,
        likeCount: 3200000,
        commentCount: 87000,
        publishedAt: '2024-01-08',
        description: 'Comparing the cheapest vs most expensive vacation!',
        tags: ['mrbeast', 'vacation', 'comparison', 'expensive', 'travel']
      },
      {
        id: 'mb7',
        title: 'I Survived 100 Days In Nuclear Bunker',
        channelTitle: 'MrBeast',
        thumbnail: 'https://via.placeholder.com/320x180/2c3e50/ffffff?text=BUNKER',
        viewCount: 95000000,
        likeCount: 4500000,
        commentCount: 178000,
        publishedAt: '2024-01-03',
        description: 'Living underground for 100 days straight!',
        tags: ['mrbeast', 'survival', 'bunker', 'challenge', 'extreme']
      },
      {
        id: 'mb8',
        title: 'World\'s Largest Nerf War - $100,000 Prize',
        channelTitle: 'MrBeast',
        thumbnail: 'https://via.placeholder.com/320x180/27ae60/ffffff?text=NERF+WAR',
        viewCount: 41000000,
        likeCount: 2100000,
        commentCount: 76000,
        publishedAt: '2024-01-18',
        description: 'Epic Nerf battle with massive cash prize!',
        tags: ['mrbeast', 'nerf', 'battle', 'competition', 'fun']
      }
    ];
  }
  
  // Generic fallback for other queries - generate 8 videos
  const colors = ['9b59b6', 'e74c3c', '3498db', '2ecc71', 'f39c12', '1abc9c', 'e67e22', '34495e'];
  const videoTypes = ['Ultimate Guide', 'Pro Tips', 'Complete Tutorial', 'Best Practices', 'Expert Review', 'Deep Dive', 'Masterclass', 'Advanced Techniques'];
  
  return videoTypes.map((type, index) => ({
    id: `gen${index + 1}`,
    title: `${type}: ${query} - Everything You Need to Know`,
    channelTitle: `${type.split(' ')[0]} Channel`,
    thumbnail: `https://via.placeholder.com/320x180/${colors[index]}/ffffff?text=${encodeURIComponent(type.replace(' ', '+'))}`,
    viewCount: Math.floor(Math.random() * 2000000) + 100000,
    likeCount: Math.floor(Math.random() * 100000) + 5000,
    commentCount: Math.floor(Math.random() * 5000) + 500,
    publishedAt: `2024-01-${String(Math.floor(Math.random() * 25) + 1).padStart(2, '0')}`,
    description: `${type} about ${query} - comprehensive coverage of the topic`,
    tags: [query.toLowerCase(), type.toLowerCase().replace(' ', ''), 'tutorial', 'guide', 'tips']
  }));
}
