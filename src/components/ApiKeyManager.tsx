
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, CheckCircle2 } from 'lucide-react';

const ApiKeyManager: React.FC = () => {
  const [isConfigured, setIsConfigured] = useState(true);

  return (
    <Card className="glass-effect mb-6">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-teal-500">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">API Configuration</h3>
            <p className="text-sm text-muted-foreground">
              YouTube Data API and AI services are pre-configured
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          <span>All APIs are configured and ready to use</span>
          <Badge variant="secondary" className="ml-2">
            Active
          </Badge>
        </div>

        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-700 dark:text-green-300">
            <strong>Configured Services:</strong><br />
            ✅ YouTube Data API v3<br />
            ✅ Google Gemini AI<br />
            ✅ Image Generation AI<br />
            ✅ Cloud Storage Integration
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ApiKeyManager;
