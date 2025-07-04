
import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AIToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  onClick: () => void;
  isActive?: boolean;
}

const AIToolCard: React.FC<AIToolCardProps> = ({
  title,
  description,
  icon: Icon,
  gradient,
  onClick,
  isActive = false
}) => {
  return (
    <div className="group relative">
      {/* Animated gradient border */}
      <div className={`absolute -inset-0.5 bg-gradient-to-br ${gradient} rounded-xl blur opacity-20 group-hover:opacity-40 transition-all duration-500 ${isActive ? 'opacity-60' : ''}`} />
      
      <Card
        className={`relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-xl bg-gray-900/60 backdrop-blur-xl border-gray-700/50 rounded-xl h-full group ${
          isActive ? 'ring-2 ring-white/20 shadow-xl' : ''
        }`}
        onClick={onClick}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-black/20" />
        
        {/* Animated glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
        <div className="relative p-4 h-full flex flex-col">
          {/* Icon section */}
          <div className="flex items-start justify-between mb-3">
            <div className={`relative p-2 rounded-lg bg-gradient-to-br ${gradient} shadow-md group-hover:shadow-lg transition-all duration-300`}>
              <Icon className="w-5 h-5 text-white" />
              
              {/* Icon glow effect */}
              <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${gradient} blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
            </div>
            
            {/* Status indicator */}
            <div className="w-2 h-2 rounded-full bg-green-400 opacity-60 animate-pulse shadow-sm shadow-green-400/50" />
          </div>

          {/* Content section */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent group-hover:from-white group-hover:via-white group-hover:to-gray-200 transition-all duration-300">
              {title}
            </h3>
            
            <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors duration-300 flex-1">
              {description}
            </p>
          </div>

          {/* Action indicator */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700/50">
            <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
              Click to explore
            </div>
            
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-white transition-all duration-300 group-hover:shadow-sm group-hover:shadow-white/50" />
          </div>

          {/* Hover shimmer effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      </Card>
    </div>
  );
};

export default AIToolCard;
