
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Key, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ApiKeyManagerProps {
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem('youtube_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeyChange(savedApiKey);
      validateApiKey(savedApiKey);
    }
  }, [onApiKeyChange]);

  const validateApiKey = async (key: string) => {
    if (!key.trim()) {
      setIsValid(null);
      return;
    }

    setIsValidating(true);
    try {
      // Test the API key with a simple search request
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&maxResults=1&key=${key}`
      );
      
      if (response.ok) {
        setIsValid(true);
        toast.success('YouTube API key is valid!');
      } else {
        setIsValid(false);
        toast.error('Invalid YouTube API key');
      }
    } catch (error) {
      setIsValid(false);
      toast.error('Failed to validate API key');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    localStorage.setItem('youtube_api_key', apiKey);
    onApiKeyChange(apiKey);
    validateApiKey(apiKey);
    toast.success('API key saved successfully!');
  };

  const handleClearApiKey = () => {
    setApiKey('');
    setIsValid(null);
    localStorage.removeItem('youtube_api_key');
    onApiKeyChange('');
    toast.info('API key cleared');
  };

  return (
    <Card className="glass-effect mb-6">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">YouTube API Configuration</h3>
            <p className="text-sm text-muted-foreground">
              Enter your YouTube Data API key to fetch real data
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your YouTube Data API key..."
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <Button onClick={handleSaveApiKey} disabled={isValidating}>
              {isValidating ? 'Validating...' : 'Save'}
            </Button>
            {apiKey && (
              <Button variant="outline" onClick={handleClearApiKey}>
                Clear
              </Button>
            )}
          </div>

          {isValid !== null && (
            <div className={`flex items-center space-x-2 text-sm ${
              isValid ? 'text-green-600' : 'text-red-600'
            }`}>
              {isValid ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>
                {isValid ? 'API key is valid and ready to use' : 'API key is invalid or has insufficient permissions'}
              </span>
            </div>
          )}

          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <strong>How to get a YouTube API key:</strong><br />
              1. Go to the Google Cloud Console<br />
              2. Create a new project or select an existing one<br />
              3. Enable the YouTube Data API v3<br />
              4. Create credentials (API key)<br />
              5. Copy and paste the key above
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ApiKeyManager;
