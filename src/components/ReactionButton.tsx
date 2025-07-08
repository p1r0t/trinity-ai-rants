import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface ReactionButtonProps {
  emoji: string;
  count: number;
  type: 'smart' | 'funny' | 'trash';
  newsId: number;
  isActive?: boolean;
}

const ReactionButton = ({ emoji, count, type, newsId, isActive = false }: ReactionButtonProps) => {
  const [currentCount, setCurrentCount] = useState(count);
  const [isReacted, setIsReacted] = useState(isActive);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleReaction = () => {
    setIsAnimating(true);
    
    if (isReacted) {
      setCurrentCount(prev => prev - 1);
      setIsReacted(false);
    } else {
      setCurrentCount(prev => prev + 1);
      setIsReacted(true);
    }

    // В будущем здесь будет API вызов
    // await saveReaction(newsId, type, !isReacted);

    setTimeout(() => setIsAnimating(false), 200);
  };

  const getHoverColor = () => {
    switch (type) {
      case 'smart': return 'hover:text-blue-400 hover:bg-blue-500/10';
      case 'funny': return 'hover:text-yellow-400 hover:bg-yellow-500/10';
      case 'trash': return 'hover:text-red-400 hover:bg-red-500/10';
    }
  };

  const getActiveColor = () => {
    switch (type) {
      case 'smart': return 'text-blue-400 bg-blue-500/20';
      case 'funny': return 'text-yellow-400 bg-yellow-500/20';
      case 'trash': return 'text-red-400 bg-red-500/20';
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleReaction}
      className={`
        flex items-center space-x-1 transition-all duration-200 
        ${isReacted ? getActiveColor() : 'text-gray-400'} 
        ${getHoverColor()}
        ${isAnimating ? 'scale-110' : ''}
        hover:scale-105
      `}
    >
      <span className={`text-sm transition-transform ${isAnimating ? 'animate-bounce' : ''}`}>
        {emoji}
      </span>
      <span className="text-xs font-medium">{currentCount}</span>
    </Button>
  );
};

export default ReactionButton;