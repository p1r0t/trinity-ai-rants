import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, TrendingUp, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingActionButtonProps {
  onAIRecommendations?: () => void;
  onSmartFeed?: () => void;
  onTrending?: () => void;
}

const FloatingActionButton = ({ 
  onAIRecommendations, 
  onSmartFeed, 
  onTrending 
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Sparkles,
      label: 'AI Рекомендации',
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/20',
      onClick: onAIRecommendations
    },
    {
      icon: Brain,
      label: 'Умная лента',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      onClick: onSmartFeed
    },
    {
      icon: TrendingUp,
      label: 'Тренды',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      onClick: onTrending
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end space-y-reverse space-y-3">
      {/* Action buttons */}
      <AnimatePresence>
        {isOpen && actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ delay: index * 0.1 }}
            className="mb-3"
          >
            <Button
              onClick={() => {
                action.onClick?.();
                setIsOpen(false);
              }}
              className={`
                ${action.bgColor} ${action.color} 
                hover:scale-110 transition-all duration-300 
                backdrop-blur-md border border-white/20
                min-w-0 p-3 rounded-full shadow-lg
              `}
              size="sm"
            >
              <action.icon size={20} />
              <span className="sr-only">{action.label}</span>
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            bg-gradient-to-r from-primary to-accent-foreground 
            hover:from-primary/80 hover:to-accent-foreground/80
            text-primary-foreground shadow-xl hover:shadow-2xl
            rounded-full p-4 transition-all duration-300
            ${isOpen ? 'rotate-45' : 'rotate-0'}
          `}
          size="lg"
        >
          {isOpen ? <X size={24} /> : <Zap size={24} />}
        </Button>
      </motion.div>

      {/* Label hint */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -left-32 top-1/2 transform -translate-y-1/2 
                     bg-black/80 text-white text-xs px-3 py-1 rounded-lg
                     backdrop-blur-sm border border-white/20 pointer-events-none"
        >
          AI помощник
        </motion.div>
      )}
    </div>
  );
};

export default FloatingActionButton;