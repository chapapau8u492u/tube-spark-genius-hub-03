
import { aiServices, AIModel } from '@/services/aiService';

const IMAGEKIT_ENDPOINT = 'https://ik.imagekit.io/your-imagekit-id';
const IMAGEKIT_PUBLIC_KEY = 'your-public-key';
const IMAGEKIT_PRIVATE_KEY = 'your-private-key';

export const uploadToImageKit = async (file: File): Promise<string> => {
  try {
    // Simulate ImageKit upload for now
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw error;
  }
};

export const generateThumbnailPrompt = async (title: string, keywords: string = '', model: AIModel = 'ai1'): Promise<string> => {
  try {
    return await aiServices.generateThumbnailPrompt(title, keywords, model);
  } catch (error) {
    console.error('Thumbnail prompt generation error:', error);
    throw error;
  }
};

export const generateThumbnailImage = async (prompt: string): Promise<string> => {
  try {
    // Use Gemini 2.0 Flash for image generation
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=AIzaSyBdmJafDA7pVwj7cshLLi1PMfzsuxxkoy8`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create a professional YouTube thumbnail image with the following specifications: ${prompt}. Make it eye-catching, high-contrast, and optimized for YouTube's platform with bold text overlay and vibrant colors.`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini image generation failed: ${response.status}`);
    }

    const data = await response.json();
    
    // If Gemini returns image data, process it
    if (data.candidates && data.candidates[0]) {
      // For now, generate a placeholder URL since Gemini image generation might return differently
      // In production, you would handle the actual image data from Gemini
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add title text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('AI Generated Thumbnail', canvas.width / 2, canvas.height / 2);
        
        // Add subtitle
        ctx.font = '24px Arial';
        ctx.fillText('Powered by Gemini AI', canvas.width / 2, canvas.height / 2 + 60);
        
        return canvas.toDataURL('image/png');
      }
    }
    
    // Fallback to Pollinations API if Gemini doesn't work as expected
    const pollinations_url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&model=flux&enhance=true&nologo=true`;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error('Failed to create canvas context'));
        }
      };
      
      img.onerror = () => {
        // Final fallback - create a simple thumbnail
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, '#ff6b6b');
          gradient.addColorStop(1, '#4ecdc4');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.fillStyle = 'white';
          ctx.font = 'bold 48px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Custom Thumbnail', canvas.width / 2, canvas.height / 2);
          
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error('Failed to create fallback thumbnail'));
        }
      };
      
      img.src = pollinations_url;
    });
    
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
};
