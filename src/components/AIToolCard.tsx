
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
    <Card
      className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group ${
        isActive ? 'ring-2 ring-primary neon-glow' : ''
      }`}
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
      <div className="relative p-6 glass-effect h-full">
        <div className="flex items-center space-x-4 mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gradient">{title}</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Card>
  );
};

export default AIToolCard;
