
const GEMINI_API_KEY = 'AIzaSyBdmJafDA7pVwj7cshLLi1PMfzsuxxkoy8';

const generateGeminiContent = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
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
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

export const aiServices = {
  // Content Generator - Generates YouTube titles, descriptions, tags
  generateContent: async (topic: string): Promise<any> => {
    try {
      const prompt = `You are an expert YouTube SEO strategist and AI creative assistant. Based on the user input "${topic}", generate a JSON response only (no explanation, no markdown, no commentary), containing:
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
}`;

      const content = await generateGeminiContent(prompt);
      console.log('Gemini Response:', content);
      
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid JSON response from Gemini');
    } catch (error) {
      console.error('Content Generation Error:', error);
      throw error;
    }
  },

  // Keyword Analysis - Generates SEO keywords with scores
  analyzeKeywords: async (topic: string): Promise<any> => {
    try {
      const prompt = `Given the user input "${topic}" and YouTube video optimization, extract high-ranking SEO-relevant keywords.
For each keyword:
Assign an SEO score (1-100) based on search potential and relevance.
Include a few related queries or search phrases.

Return JSON format only:
{
  "main_keyword": "${topic}",
  "keywords": [
    {
      "keyword": "Your Extracted Keyword",
      "score": 85,
      "related_queries": [
        "related query 1",
        "related query 2"
      ]
    }
  ]
}`;

      const content = await generateGeminiContent(prompt);
      console.log('Keyword Analysis Response:', content);
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid JSON response from Gemini');
    } catch (error) {
      console.error('Keyword Analysis Error:', error);
      throw error;
    }
  },

  // Thumbnail Analysis - Analyzes thumbnails and generates tags
  analyzeThumbnail: async (video: any): Promise<string[]> => {
    try {
      const prompt = `Analyze this YouTube video and generate relevant search tags based on the title and context:
Title: "${video.title}"
Channel: "${video.channelTitle}"
Description: Generate 5-8 relevant search tags that would help find similar videos or thumbnails. Focus on the main topic, style, and content type.

Return only a JSON array of strings:
["tag1", "tag2", "tag3", "tag4", "tag5"]`;

      const content = await generateGeminiContent(prompt);
      console.log('Thumbnail Analysis Response:', content);
      
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback tags if parsing fails
      return [video.title.split(' ').slice(0, 3).join(' '), 'tutorial', 'guide', 'tips'];
    } catch (error) {
      console.error('Thumbnail Analysis Error:', error);
      // Return fallback tags
      return [video.title.split(' ').slice(0, 3).join(' '), 'tutorial', 'guide', 'tips'];
    }
  },

  // Outlier Detection - Calculates outlier scores for video data
  detectOutliers: (videos: any[]): any[] => {
    if (!videos || videos.length === 0) return [];

    const viewCounts = videos.map(v => v.viewCount || 0);
    const { iqr, lowerBound, upperBound } = calculateIQR(viewCounts);
    
    const avgViews = viewCounts.reduce((a, b) => a + b, 0) / viewCounts.length;
    const maxViewsPerDay = Math.max(...videos.map(v => v.viewsPerDay || 0));
    const maxEngagementRate = Math.max(...videos.map(v => v.engagementRate || 0));

    return videos.map(video => {
      const isOutlier = video.viewCount < lowerBound || video.viewCount > upperBound;
      let outlierScore = 0;
      
      if (isOutlier && iqr > 0) {
        if (video.viewCount > upperBound) {
          outlierScore = (video.viewCount - upperBound) / iqr;
        } else if (video.viewCount < lowerBound) {
          outlierScore = (lowerBound - video.viewCount) / iqr;
        }
      }

      const smartScore = 
        (video.viewCount / avgViews) * 0.5 +
        (video.viewsPerDay / maxViewsPerDay) * 0.3 +
        (video.engagementRate / maxEngagementRate) * 0.2;

      return {
        ...video,
        isOutlier,
        outlierScore: Number(outlierScore.toFixed(2)),
        smartScore: Number(smartScore.toFixed(3))
      };
    });
  }
};

// Helper function for IQR calculation
function calculateIQR(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length / 4)];
  const q3 = sorted[Math.floor(sorted.length * 3 / 4)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  return { q1, q3, iqr, lowerBound, upperBound };
}
