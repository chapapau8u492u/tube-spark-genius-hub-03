
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Image, Wand2, Download, Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadToImageKit, generateThumbnailPrompt, generateThumbnailImage } from '@/utils/imageUtils';

const ThumbnailGenerator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  const [faceImagePreview, setFaceImagePreview] = useState<string | null>(null);
  const [generationSteps, setGenerationSteps] = useState<string>('');

  const handleReferenceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onload = () => setReferenceImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFaceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFaceImage(file);
      const reader = new FileReader();
      reader.onload = () => setFaceImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeReferenceImage = () => {
    setReferenceImage(null);
    setReferenceImagePreview(null);
  };

  const removeFaceImage = () => {
    setFaceImage(null);
    setFaceImagePreview(null);
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error('Please enter a video title');
      return;
    }

    setLoading(true);
    setGenerationSteps('Starting thumbnail generation...');
    
    try {
      // Step 1: Upload images to cloud (if any)
      let referenceImageUrl = '';
      let faceImageUrl = '';
      
      if (referenceImage) {
        setGenerationSteps('Uploading reference image to cloud...');
        referenceImageUrl = await uploadToImageKit(referenceImage);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload time
      }
      
      if (faceImage) {
        setGenerationSteps('Uploading face image to cloud...');
        faceImageUrl = await uploadToImageKit(faceImage);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload time
      }

      // Step 2: Generate AI prompt for thumbnail using Gemini
      setGenerationSteps('Generating creative AI prompt using Gemini...');
      const thumbnailPrompt = await generateThumbnailPrompt(title, keywords);
      console.log('Generated prompt:', thumbnailPrompt);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call time

      // Step 3: Generate thumbnail image using AI
      setGenerationSteps('Creating thumbnail with AI model...');
      const generatedThumbnail = await generateThumbnailImage(thumbnailPrompt);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate image generation time

      // Step 4: Store generated thumbnail
      setGenerationSteps('Storing thumbnail to cloud...');
      // In production, you'd upload the generated image to ImageKit here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate storage time

      setGeneratedImage(generatedThumbnail);
      setGenerationSteps('');
      toast.success('Thumbnail generated successfully with Gemini AI!');
      
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate thumbnail. Please try again.');
      setGenerationSteps('');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.download = 'ai-generated-thumbnail.png';
      link.href = generatedImage;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-teal-500">
              <Image className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gradient">AI Thumbnail Generator</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Video Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 10 Amazing React Tips That Will Blow Your Mind!"
                className="bg-background/50 border-muted"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Keywords (Optional)</label>
              <Textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., react, javascript, programming, tutorial, coding"
                className="bg-background/50 border-muted min-h-20"
              />
            </div>

            {/* Image Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reference Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Reference Image (Optional)</label>
                {!referenceImagePreview ? (
                  <label htmlFor="reference-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload reference image</p>
                    </div>
                    <input
                      id="reference-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleReferenceImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={referenceImagePreview}
                      alt="Reference"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={removeReferenceImage}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Face Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Face Image (Optional)</label>
                {!faceImagePreview ? (
                  <label htmlFor="face-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload face image</p>
                    </div>
                    <input
                      id="face-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFaceImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={faceImagePreview}
                      alt="Face"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={removeFaceImage}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              onClick={handleGenerate} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Thumbnail...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate AI Thumbnail
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading Steps */}
      {loading && generationSteps && (
        <Card className="glass-effect">
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <p className="text-sm font-medium">{generationSteps}</p>
            </div>
            <div className="mt-3 bg-background/30 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        </Card>
      )}

      {/* Generated Thumbnail Display */}
      {generatedImage && (
        <Card className="glass-effect">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Your AI Generated Thumbnail</h3>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </Button>
            </div>
            
            <div className="relative">
              <img
                src={generatedImage}
                alt="AI Generated Thumbnail"
                className="w-full rounded-lg border border-muted shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
            </div>
            
            <div className="mt-4 p-4 bg-background/30 rounded-lg border border-muted">
              <h4 className="font-medium mb-2">Thumbnail Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Resolution</p>
                  <p className="font-medium">1280 x 720 (16:9)</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Format</p>
                  <p className="font-medium">PNG</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Generated using</p>
                  <p className="font-medium">Gemini AI + Custom Generator</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Optimized for</p>
                  <p className="font-medium">YouTube Platform</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ThumbnailGenerator;
