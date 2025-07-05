
const GEMINI_API_KEY = 'AIzaSyBdmJafDA7pVwj7cshLLi1PMfzsuxxkoy8';

export const uploadToImageKit = async (file: File): Promise<string> => {
  // Mock upload to ImageKit - in real implementation you'd use ImageKit SDK
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Return a data URL for now - in production this would be ImageKit URL
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

export const generateThumbnailPrompt = async (title: string, keywords: string): Promise<string> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create a detailed and creative prompt for generating a YouTube thumbnail for the video "${title}" with keywords: ${keywords}. 
            
            The prompt should describe a visually striking, professional YouTube thumbnail that would get high click-through rates. 
            Include specific details about:
            - Colors and visual style
            - Text placement and typography
            - Visual elements and composition
            - Emotions and expressions
            - Background and lighting
            - Overall aesthetic that matches YouTube best practices
            
            Keep it under 200 words and focus on visual elements that would work well for YouTube thumbnails.
            Make it creative and engaging while being specific enough for an AI image generator.
            
            Format the response as a clear image generation prompt that can be used with AI image generators.`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
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
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  } catch (error) {
    console.error('Error generating prompt with Gemini:', error);
    return `Professional YouTube thumbnail for "${title}" featuring bold text, vibrant colors, high contrast design, eye-catching graphics, modern layout, 1280x720 resolution, clickbait style, professional quality`;
  }
};

export const generateThumbnailImage = async (prompt: string): Promise<string> => {
  try {
    // Since we're only using Gemini API and not image generation services,
    // we'll create a placeholder thumbnail with the generated prompt
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Canvas context not available');
    }
    
    // Set canvas dimensions for YouTube thumbnail (16:9 aspect ratio)
    canvas.width = 1280;
    canvas.height = 720;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text overlay
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add shadow for better text visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Wrap text if it's too long
    const maxWidth = canvas.width - 100;
    const words = prompt.split(' ').slice(0, 8).join(' '); // Take first 8 words
    const lines = wrapText(ctx, words, maxWidth, 48);
    
    const lineHeight = 60;
    const startY = (canvas.height - (lines.length * lineHeight)) / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
    });
    
    // Add "AI Generated" watermark
    ctx.font = '20px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.shadowBlur = 0;
    ctx.fillText('AI Generated Thumbnail', canvas.width - 150, canvas.height - 30);
    
    // Convert canvas to data URL
    return canvas.toDataURL('image/png');
    
  } catch (error) {
    console.error('Error generating thumbnail image:', error);
    throw new Error('Failed to generate thumbnail image. Please try again later.');
  }
};

// Helper function to wrap text
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}
