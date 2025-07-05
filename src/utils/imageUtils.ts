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
            text: `Create a highly detailed, professional prompt for generating a YouTube thumbnail image for the video titled "${title}" with keywords: ${keywords}.

            The prompt should be extremely specific and designed for AI image generation tools. Include:

            VISUAL COMPOSITION:
            - Bold, eye-catching design with high contrast colors
            - Professional photography or digital art style
            - 16:9 aspect ratio (1280x720 pixels)
            - Dynamic composition with rule of thirds
            - Clean, uncluttered layout

            TEXT ELEMENTS:
            - Large, bold text overlay with the main hook from the title
            - Maximum 3-4 words for readability
            - Sans-serif font, highly legible
            - Contrasting colors (white text with dark outline, or vice versa)

            VISUAL STYLE:
            - High-quality, professional appearance
            - Vibrant, saturated colors that pop
            - Good lighting and contrast
            - Modern, clean aesthetic
            - YouTube-optimized color palette

            SPECIFIC ELEMENTS based on the title and keywords:
            - Include relevant imagery that matches the video topic
            - Add visual metaphors or symbols related to the content
            - Consider facial expressions if people are involved (surprised, excited, focused)
            - Include relevant props, backgrounds, or settings

            FORMAT REQUIREMENTS:
            - Photorealistic or high-quality digital art
            - No watermarks or text in foreign languages
            - High resolution and sharp details
            - Optimized for small thumbnail viewing

            Create a single, comprehensive prompt that an AI image generator can use to create this thumbnail.`
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
    console.log('Generating thumbnail with AI for prompt:', prompt);
    
    // Use Replicate API for J's AI model (NGP image generation)
    const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': 'Token r8_6zQj3wLAIuOkKS8R4A9QCyN5BgXhbYk2VpWdF',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
        input: {
          prompt: `YouTube thumbnail: ${prompt}`,
          width: 1280,
          height: 720,
          num_outputs: 1,
          quality: 95,
          guidance_scale: 7.5,
          num_inference_steps: 25
        }
      })
    });

    if (!replicateResponse.ok) {
      throw new Error('Replicate API failed');
    }

    const prediction = await replicateResponse.json();
    
    // Poll for completion
    let result = prediction;
    while (result.status === 'starting' || result.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          'Authorization': 'Token r8_6zQj3wLAIuOkKS8R4A9QCyN5BgXhbYk2VpWdF',
        }
      });
      result = await statusResponse.json();
    }

    if (result.status === 'succeeded' && result.output && result.output[0]) {
      // Convert the image URL to data URL
      const imageResponse = await fetch(result.output[0]);
      const blob = await imageResponse.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
    
    throw new Error('Image generation failed');
    
  } catch (error) {
    console.error('Error generating thumbnail image:', error);
    
    // Fallback to Hugging Face FLUX model
    try {
      console.log('Trying fallback Hugging Face API...');
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: `Professional YouTube thumbnail: ${prompt}, 1280x720, high quality, vibrant colors, bold text, eye-catching`,
          }),
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    } catch (fallbackError) {
      console.error('Fallback image generation failed:', fallbackError);
    }
    
    // Final fallback to canvas generation
    return createFallbackThumbnail(prompt);
  }
};

// Improved fallback thumbnail creator
function createFallbackThumbnail(prompt: string): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Canvas context not available');
  }
  
  // Set canvas dimensions for YouTube thumbnail (16:9 aspect ratio)
  canvas.width = 1280;
  canvas.height = 720;
  
  // Create a dynamic gradient based on prompt content
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  
  // Dynamic colors based on content
  if (prompt.toLowerCase().includes('tech') || prompt.toLowerCase().includes('coding')) {
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
  } else if (prompt.toLowerCase().includes('food') || prompt.toLowerCase().includes('cooking')) {
    gradient.addColorStop(0, '#ff9a56');
    gradient.addColorStop(1, '#ff6b95');
  } else if (prompt.toLowerCase().includes('fitness') || prompt.toLowerCase().includes('health')) {
    gradient.addColorStop(0, '#56ab2f');
    gradient.addColorStop(1, '#a8e6cf');
  } else {
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
  }
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add geometric shapes for visual interest
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.arc(canvas.width * 0.8, canvas.height * 0.3, 150, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.beginPath();
  ctx.arc(canvas.width * 0.2, canvas.height * 0.7, 200, 0, Math.PI * 2);
  ctx.fill();
  
  // Extract key words from prompt for text
  const words = prompt.split(' ').filter(word => 
    word.length > 3 && 
    !['the', 'and', 'for', 'with', 'this', 'that', 'thumbnail', 'youtube'].includes(word.toLowerCase())
  ).slice(0, 6);
  
  const displayText = words.join(' ').toUpperCase();
  
  // Add main text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 64px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Add shadow for better text visibility
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  
  // Wrap text if needed
  const maxWidth = canvas.width - 100;
  const lines = wrapText(ctx, displayText, maxWidth, 64);
  
  const lineHeight = 80;
  const startY = (canvas.height - (lines.length * lineHeight)) / 2;
  
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
  });
  
  // Add accent elements
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.fillText('AI GENERATED', canvas.width - 200, canvas.height - 40);
  
  // Add YouTube play button style element
  ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
  ctx.beginPath();
  ctx.arc(100, 100, 40, 0, Math.PI * 2);
  ctx.fill();
  
  // Play triangle
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(85, 85);
  ctx.lineTo(85, 115);
  ctx.lineTo(115, 100);
  ctx.closePath();
  ctx.fill();
  
  return canvas.toDataURL('image/png');
}

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
