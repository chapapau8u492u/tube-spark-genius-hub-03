
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
    // Using Hugging Face's FLUX model for image generation
    const response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `YouTube thumbnail: ${prompt}. Professional design, 16:9 aspect ratio, 1280x720 resolution, high quality, eye-catching, clickbait style`,
        parameters: {
          width: 1280,
          height: 720,
          num_inference_steps: 4,
          guidance_scale: 3.5
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    
    // Convert blob to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error generating image with Hugging Face:', error);
    
    // Fallback to a different model if the first one fails
    try {
      const fallbackResponse = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `YouTube thumbnail: ${prompt}. Professional design, 16:9 aspect ratio, high quality, eye-catching, clickbait style, bold text overlay`,
          parameters: {
            width: 1024,
            height: 576,
            num_inference_steps: 20,
            guidance_scale: 7.5
          }
        })
      });

      if (!fallbackResponse.ok) {
        throw new Error(`Fallback HTTP error! status: ${fallbackResponse.status}`);
      }

      const fallbackBlob = await fallbackResponse.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fallbackBlob);
      });
    } catch (fallbackError) {
      console.error('Both image generation services failed:', fallbackError);
      throw new Error('Failed to generate thumbnail image. Please try again later.');
    }
  }
};
